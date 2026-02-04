import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';
const WITHDRAWAL_COOLDOWN_HOURS = 24;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Supabase configuration missing');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const userClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, currency, walletAddress } = await req.json();

    // Get dynamic limits from admin_settings
    const { data: limitSetting } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'withdrawal_limits')
      .single();
    
    const minLimit = Number(limitSetting?.value?.min || 10);
    const maxLimit = Number(limitSetting?.value?.max || 1000);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance, last_withdrawal_at')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check 24-hour cooldown
    if (profile.last_withdrawal_at) {
      const lastWithdrawal = new Date(profile.last_withdrawal_at);
      const cooldownEnd = new Date(lastWithdrawal.getTime() + WITHDRAWAL_COOLDOWN_HOURS * 60 * 60 * 1000);
      
      if (new Date() < cooldownEnd) {
        const remainingHours = Math.ceil((cooldownEnd.getTime() - Date.now()) / (60 * 60 * 1000));
        return new Response(
          JSON.stringify({
            success: false,
            error: `يمكنك السحب مرة واحدة كل 24 ساعة. يتبقى ${remainingHours} ساعة`,
            cooldownEnds: cooldownEnd.toISOString(),
            remainingHours,
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate amount against dynamic limits
    if (!amount || amount < minLimit) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `الحد الأدنى للسحب هو $${minLimit}`,
          minimumWithdrawal: minLimit,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (amount > maxLimit) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `الحد الأقصى للسحب هو $${maxLimit}`,
          maximumWithdrawal: maxLimit,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check balance
    if (Number(profile.balance) < amount) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'رصيدك غير كافٍ',
          currentBalance: profile.balance,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!currency || !walletAddress) {
      return new Response(
        JSON.stringify({ success: false, error: 'Currency and wallet address are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API Key for estimation
    const { data: apiKeySetting } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'nowpayments_api_key')
      .single();
    
    const apiKey = apiKeySetting?.value?.value || Deno.env.get('NOWPAYMENTS_API_KEY');

    let estimatedCrypto = null;
    if (apiKey) {
      try {
        const estimateResponse = await fetch(
          `${NOWPAYMENTS_API_URL}/estimate?amount=${amount}&currency_from=usd&currency_to=${currency.toLowerCase()}`,
          {
            headers: { 'x-api-key': apiKey },
          }
        );

        if (estimateResponse.ok) {
          const estimateData = await estimateResponse.json();
          estimatedCrypto = estimateData.estimated_amount;
        }
      } catch (e) {
        console.error('Estimation error:', e);
      }
    }

    // Deduct from user balance first
    const newBalance = Number(profile.balance) - amount;
    const { error: balanceUpdateError } = await supabase
      .from('profiles')
      .update({
        balance: newBalance,
        last_withdrawal_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (balanceUpdateError) {
      throw new Error('Failed to update balance');
    }

    // Create withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('crypto_withdrawals')
      .insert({
        user_id: user.id,
        amount_usd: amount,
        amount_crypto: estimatedCrypto,
        currency: currency.toUpperCase(),
        wallet_address: walletAddress,
        status: 'pending',
      })
      .select()
      .single();

    if (withdrawalError) {
      // Refund balance
      await supabase
        .from('profiles')
        .update({ balance: profile.balance })
        .eq('id', user.id);
      throw new Error('Failed to create withdrawal record');
    }

    // Create transaction record
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'withdrawal',
        amount: -amount,
        description: `سحب ${currency.toUpperCase()} إلى ${walletAddress.slice(0, 10)}...`,
        status: 'pending',
      });

    return new Response(
      JSON.stringify({
        success: true,
        withdrawal: {
          id: withdrawal.id,
          amountUsd: amount,
          estimatedCrypto,
          currency: currency.toUpperCase(),
          walletAddress,
          status: 'pending',
          nextWithdrawalAt: new Date(Date.now() + WITHDRAWAL_COOLDOWN_HOURS * 60 * 60 * 1000).toISOString(),
        },
        message: 'تم إرسال طلب السحب بنجاح. سيتم معالجته من قبل الإدارة.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Withdrawal error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
