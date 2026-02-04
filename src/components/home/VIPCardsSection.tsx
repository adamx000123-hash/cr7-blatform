import { motion } from 'framer-motion';
import { Crown, Zap } from 'lucide-react';
import { vipLevels } from '@/data/mockData';
import { GoldButton } from '@/components/ui/GoldButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const VIPCardsSection = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const currentLevel = profile?.vip_level || 0;
  const referralDiscount = profile?.referral_discount || 0;

  // Only show VIP 1-5 (exclude 0)
  const mainVipLevels = vipLevels.filter(v => v.level >= 1 && v.level <= 5);

  const handleUpgrade = () => {
    // Redirect to profile page with deposit state
    navigate('/profile', { state: { openDeposit: true } });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const levelColors: Record<number, string> = {
    1: 'from-slate-700 to-slate-900',
    2: 'from-slate-600 to-slate-800',
    3: 'from-amber-600 to-amber-800',
    4: 'from-amber-500 to-amber-700',
    5: 'from-yellow-400 to-yellow-600',
  };

  return (
    <section className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <GoldButton variant="outline" size="sm" onClick={() => navigate('/vip')}>
          عرض الكل
        </GoldButton>
        <h3 className="font-display text-xl text-foreground flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          مستويات VIP
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {mainVipLevels.map((level, index) => {
          const isUnlocked = level.level <= currentLevel;
          const isCurrentLevel = level.level === currentLevel;
          const effectiveDiscount = referralDiscount > 0 ? referralDiscount : 20;
          const discountedPrice = Math.max(0, level.price - effectiveDiscount);
          const hasDiscount = level.price > 0;

          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={handleUpgrade}
              className={`relative rounded-2xl overflow-hidden glass-card border border-white/5 cursor-pointer group ${
                isCurrentLevel ? 'ring-2 ring-primary shadow-[0_0_20px_rgba(245,158,11,0.2)]' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[1]" />
              
              {/* Content */}
              <div className="relative p-4 flex items-center justify-between z-[2]">
                <div className="flex items-center gap-3">
                  {!isUnlocked && (
                    <GoldButton
                      variant="primary"
                      size="sm"
                      className="group-hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade();
                      }}
                    >
                      <Zap className="w-3 h-3 ml-1" />
                      {hasDiscount ? (
                        <span className="flex items-center gap-1">
                          <span className="line-through text-[10px] opacity-60">${formatNumber(level.price)}</span>
                          <span>${formatNumber(discountedPrice)}</span>
                        </span>
                      ) : (
                        <span>${formatNumber(level.price)}</span>
                      )}
                    </GoldButton>
                  )}
                  {isCurrentLevel && (
                    <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full border border-primary/30 uppercase">
                      المستوى الحالي
                    </span>
                  )}
                  {isUnlocked && !isCurrentLevel && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30 uppercase">
                      مفعّل
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="font-display text-lg font-bold text-white">
                      VIP {level.level}
                    </h4>
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">{level.nameAr}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      ربح يومي: <span className="text-green-400 font-bold">${formatNumber(level.dailyProfit)}</span>
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${levelColors[level.level]} flex items-center justify-center shadow-xl border border-white/10 group-hover:border-primary/50 transition-colors`}>
                    <Crown className={`w-6 h-6 ${level.level >= 5 ? 'text-yellow-400 animate-pulse' : 'text-white'}`} />
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
