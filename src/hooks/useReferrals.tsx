import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Referral {
  id: string;
  referred_id: string;
  commission_rate: number;
  total_commission: number;
  created_at: string;
  referred_profile?: {
    username: string;
    vip_level: number;
  };
}

export const useReferrals = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) {
        setReferrals([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('referrals')
        .select(`
          id,
          referred_id,
          commission_rate,
          total_commission,
          created_at
        `)
        .eq('referrer_id', user.id);

      if (error) {
        console.error('Error fetching referrals:', error);
      } else if (data) {
        setReferrals(data);
        const total = data.reduce((sum, ref) => sum + Number(ref.total_commission), 0);
        setTotalCommission(total);
      }
      setLoading(false);
    };

    fetchReferrals();
  }, [user]);

  return { referrals, totalCommission, loading, count: referrals.length };
};
