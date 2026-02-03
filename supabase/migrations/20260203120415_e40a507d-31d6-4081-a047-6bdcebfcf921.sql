-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_earned DECIMAL(12,2) NOT NULL DEFAULT 0,
  vip_level INTEGER NOT NULL DEFAULT 0 CHECK (vip_level >= 0 AND vip_level <= 10),
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES public.profiles(id),
  daily_challenges_completed INTEGER NOT NULL DEFAULT 0,
  daily_challenges_limit INTEGER NOT NULL DEFAULT 3,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table for tracking referral relationships and commissions
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  total_commission DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'challenge', 'commission', 'vip_upgrade')),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  related_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform_stats table for global statistics
CREATE TABLE public.platform_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_users INTEGER NOT NULL DEFAULT 0,
  total_paid DECIMAL(15,2) NOT NULL DEFAULT 0,
  active_challenges INTEGER NOT NULL DEFAULT 24,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial platform stats
INSERT INTO public.platform_stats (total_users, total_paid, active_challenges)
VALUES (0, 0, 24);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Allow profile creation during signup"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view referrer profiles"
ON public.profiles FOR SELECT
USING (id IN (
  SELECT referred_by FROM public.profiles WHERE id = auth.uid()
));

-- Referrals policies
CREATE POLICY "Users can view their own referrals"
ON public.referrals FOR SELECT
USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "System can insert referrals"
ON public.referrals FOR INSERT
WITH CHECK (referred_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own transactions"
ON public.transactions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Platform stats policies (public read)
CREATE POLICY "Anyone can view platform stats"
ON public.platform_stats FOR SELECT
USING (true);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'CR7' || upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Function to handle new user registration with referral
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_profile_id UUID;
  new_referral_code TEXT;
BEGIN
  -- Generate unique referral code
  new_referral_code := generate_referral_code();
  
  -- Check if user was referred by someone
  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    SELECT id INTO referrer_profile_id
    FROM profiles
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code';
  END IF;
  
  -- Insert profile
  INSERT INTO profiles (id, username, email, referral_code, referred_by)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    new_referral_code,
    referrer_profile_id
  );
  
  -- If referred, create referral record
  IF referrer_profile_id IS NOT NULL THEN
    INSERT INTO referrals (referrer_id, referred_id)
    VALUES (referrer_profile_id, NEW.id);
  END IF;
  
  -- Update platform stats
  UPDATE platform_stats SET 
    total_users = total_users + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to calculate and add commission on deposit
CREATE OR REPLACE FUNCTION calculate_referral_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id UUID;
  commission_amount DECIMAL(12,2);
BEGIN
  -- Only process completed deposits
  IF NEW.type = 'deposit' AND NEW.status = 'completed' AND NEW.amount > 0 THEN
    -- Get the referrer
    SELECT p.referred_by INTO referrer_id
    FROM profiles p
    WHERE p.id = NEW.user_id;
    
    -- If user has a referrer, calculate 10% commission
    IF referrer_id IS NOT NULL THEN
      commission_amount := NEW.amount * 0.10;
      
      -- Update referral record
      UPDATE referrals
      SET total_commission = total_commission + commission_amount
      WHERE referrer_id = referrer_id AND referred_id = NEW.user_id;
      
      -- Add commission to referrer's balance
      UPDATE profiles
      SET 
        balance = balance + commission_amount,
        total_earned = total_earned + commission_amount,
        updated_at = now()
      WHERE id = referrer_id;
      
      -- Create commission transaction for referrer
      INSERT INTO transactions (user_id, type, amount, description, status, related_user_id)
      VALUES (
        referrer_id,
        'commission',
        commission_amount,
        'عمولة إحالة 10% من إيداع',
        'completed',
        NEW.user_id
      );
      
      -- Update platform total paid
      UPDATE platform_stats SET 
        total_paid = total_paid + commission_amount,
        updated_at = now();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for commission calculation
CREATE TRIGGER on_transaction_insert
AFTER INSERT ON public.transactions
FOR EACH ROW EXECUTE FUNCTION calculate_referral_commission();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();