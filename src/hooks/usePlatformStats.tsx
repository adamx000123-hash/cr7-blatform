import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformStats {
  total_users: number;
  total_paid: number;
  active_challenges: number;
}

export const usePlatformStats = () => {
  const [stats, setStats] = useState<PlatformStats>({
    total_users: 0,
    total_paid: 0,
    active_challenges: 24,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('platform_stats')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching platform stats:', error);
      } else if (data) {
        setStats({
          total_users: data.total_users,
          total_paid: Number(data.total_paid),
          active_challenges: data.active_challenges,
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return { stats, loading };
};
