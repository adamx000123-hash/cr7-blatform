import { motion } from 'framer-motion';
import { Crown, Zap, TrendingUp, Target, ShoppingCart } from 'lucide-react';
import { vipLevels } from '@/data/mockData';
import { GoldButton } from '@/components/ui/GoldButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Import New VIP Images for Home Section
import vip1 from '@/assets/vip/vip-1.png';
import vip2 from '@/assets/vip/vip-2.png';
import vip3 from '@/assets/vip/vip-3.png';
import vip4 from '@/assets/vip/vip-4.png';
import vip5 from '@/assets/vip/vip-5.png';

const ronaldoImages: Record<number, string> = {
  1: vip1,
  2: vip2,
  3: vip3,
  4: vip4,
  5: vip5,
};

export const VIPCardsSection = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const currentLevel = profile?.vip_level || 0;
  const referralDiscount = profile?.referral_discount || 20;

  // Only show VIP 1-5 (exclude 0)
  const mainVipLevels = vipLevels.filter(v => v.level >= 1 && v.level <= 5);

  const handleUpgrade = () => {
    navigate('/vip');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const levelStyles: Record<number, { bg: string, border: string, glow: string }> = {
    1: { bg: 'from-blue-950/40 to-black', border: 'border-blue-500/20', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]' },
    2: { bg: 'from-slate-900/40 to-black', border: 'border-slate-500/20', glow: 'shadow-[0_0_20px_rgba(148,163,184,0.1)]' },
    3: { bg: 'from-purple-950/40 to-black', border: 'border-purple-500/20', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.15)]' },
    4: { bg: 'from-red-950/40 to-black', border: 'border-red-500/20', glow: 'shadow-[0_0_25px_rgba(239,68,68,0.15)]' },
    5: { bg: 'from-yellow-900/30 to-black', border: 'border-yellow-500/30', glow: 'shadow-[0_0_30px_rgba(255,215,0,0.2)]' },
  };

  return (
    <section className="px-4 mb-8">
      <div className="flex items-center justify-between mb-5">
        <GoldButton variant="outline" size="sm" onClick={() => navigate('/vip')} className="rounded-full px-5 h-9 border-white/10 text-zinc-400">
          عرض الكل
        </GoldButton>
        <h3 className="font-display text-2xl text-foreground flex items-center gap-3">
          <Crown className="w-6 h-6 text-primary" />
          مستويات VIP
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mainVipLevels.map((level, index) => {
          const isUnlocked = level.level <= currentLevel;
          const isCurrentLevel = level.level === currentLevel;
          const style = levelStyles[level.level] || levelStyles[1];
          const discountedPrice = Math.max(0, level.price - referralDiscount);

          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={handleUpgrade}
              className={`relative h-40 rounded-3xl overflow-hidden border ${style.border} bg-gradient-to-br ${style.bg} ${style.glow} cursor-pointer group transition-all duration-500`}
            >
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent z-[1]" />
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

              {/* Ronaldo Image */}
              <div className="absolute left-0 bottom-0 h-full w-[40%] flex items-end z-[2] pointer-events-none">
                <img 
                  src={ronaldoImages[level.level]} 
                  alt={`VIP ${level.level}`}
                  className="h-[90%] w-auto object-contain object-bottom drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="relative h-full p-5 ml-auto w-[65%] flex flex-col justify-between z-[3]">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-display text-2xl font-bold text-white leading-none mb-1">
                      VIP {level.level}
                    </h4>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{level.nameAr}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg group-hover:border-primary/40 transition-colors`}>
                    <Crown className={`w-5 h-5 ${level.level >= 5 ? 'text-yellow-400' : 'text-zinc-400'}`} />
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-[10px] text-zinc-400">ربح: <span className="text-white font-bold">${formatNumber(level.dailyProfit)}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3 text-primary" />
                      <span className="text-[10px] text-zinc-400">مهام: <span className="text-white font-bold">{level.dailyChallengeLimit}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {isCurrentLevel ? (
                      <span className="px-3 py-1.5 bg-primary/20 text-primary text-[10px] font-black rounded-xl border border-primary/30 uppercase tracking-tighter">
                        ACTIVE
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-[10px] font-black rounded-xl border border-green-500/30 uppercase tracking-tighter">
                        UNLOCKED
                      </span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-zinc-500 line-through">${formatNumber(level.price)}</span>
                        <span className="text-sm font-display font-bold text-white">${formatNumber(discountedPrice)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
