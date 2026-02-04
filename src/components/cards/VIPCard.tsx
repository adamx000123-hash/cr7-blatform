import { motion, useAnimation } from 'framer-motion';
import { Check, Crown, Zap, Calendar, TrendingUp, DollarSign, Target, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VIPLevel } from '@/data/mockData';
import { GoldButton } from '../ui/GoldButton';

// Import New VIP Images
import vip0 from '@/assets/vip/vip-0.png';
import vip1 from '@/assets/vip/vip-1.png';
import vip2 from '@/assets/vip/vip-2.png';
import vip3 from '@/assets/vip/vip-3.png';
import vip4 from '@/assets/vip/vip-4.png';
import vip5 from '@/assets/vip/vip-5.png';

interface VIPCardProps {
  vipLevel: VIPLevel;
  currentLevel: number;
  index: number;
  referralDiscount?: number;
}

const ronaldoImages: Record<number, string> = {
  0: vip0,
  0.5: vip0,
  1: vip1,
  2: vip2,
  3: vip3,
  4: vip4,
  5: vip5,
};

export const VIPCard = ({ vipLevel, currentLevel, index, referralDiscount = 0 }: VIPCardProps) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const isCurrentLevel = vipLevel.level === currentLevel;
  const isUnlocked = vipLevel.level <= currentLevel;

  const originalPrice = vipLevel.price;
  const effectiveDiscount = referralDiscount > 0 ? referralDiscount : 20;
  const discountedPrice = Math.max(0, originalPrice - effectiveDiscount);
  const hasDiscount = originalPrice > 0;

  // Stadium atmosphere styles using CSS only
  const levelStyles: Record<number, { 
    bg: string, 
    glow: string, 
    aura: string, 
    border: string,
    stadium: string 
  }> = {
    0: { 
      bg: 'from-zinc-950 via-zinc-900 to-black', 
      glow: 'shadow-[0_0_30px_rgba(255,255,255,0.05)]',
      aura: 'opacity-10 blur-[80px] bg-zinc-500',
      border: 'border-zinc-800/50',
      stadium: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)'
    },
    1: { 
      bg: 'from-blue-950/40 via-zinc-950 to-black', 
      glow: 'shadow-[0_0_40px_rgba(59,130,246,0.15)]',
      aura: 'opacity-20 blur-[100px] bg-blue-600',
      border: 'border-blue-500/20',
      stadium: 'radial-gradient(circle at 20% 0%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.1) 0%, transparent 50%)'
    },
    2: { 
      bg: 'from-slate-900/40 via-zinc-950 to-black', 
      glow: 'shadow-[0_0_40px_rgba(148,163,184,0.2)]',
      aura: 'opacity-20 blur-[100px] bg-slate-400',
      border: 'border-slate-500/20',
      stadium: 'radial-gradient(circle at 50% -20%, rgba(226,232,240,0.15) 0%, transparent 60%)'
    },
    3: { 
      bg: 'from-purple-950/40 via-zinc-950 to-black', 
      glow: 'shadow-[0_0_50px_rgba(168,85,247,0.25)]',
      aura: 'opacity-30 blur-[120px] bg-purple-600',
      border: 'border-purple-500/30',
      stadium: 'linear-gradient(to bottom, rgba(168,85,247,0.1) 0%, transparent 40%), radial-gradient(circle at 50% 0%, rgba(168,85,247,0.2) 0%, transparent 60%)'
    },
    4: { 
      bg: 'from-red-950/40 via-zinc-950 to-black', 
      glow: 'shadow-[0_0_50px_rgba(239,68,68,0.25)]',
      aura: 'opacity-30 blur-[120px] bg-red-600',
      border: 'border-red-500/30',
      stadium: 'radial-gradient(circle at 0% 0%, rgba(239,68,68,0.15) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(239,68,68,0.15) 0%, transparent 50%)'
    },
    5: { 
      bg: 'from-yellow-900/30 via-zinc-950 to-black', 
      glow: 'shadow-[0_0_60px_rgba(255,215,0,0.35)]',
      aura: 'opacity-40 blur-[140px] bg-yellow-500',
      border: 'border-yellow-500/40',
      stadium: 'radial-gradient(circle at 50% -10%, rgba(255,215,0,0.2) 0%, transparent 70%), linear-gradient(to right, transparent, rgba(255,215,0,0.05), transparent)'
    },
  };

  const style = levelStyles[vipLevel.level] || levelStyles[0];

  const handleAction = async () => {
    await controls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    });
    navigate('/profile', { state: { openDeposit: true } });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: "easeOut" } }}
      onClick={handleAction}
      className={`relative rounded-[2.5rem] overflow-hidden cursor-pointer border ${style.border} bg-gradient-to-br ${style.bg} ${style.glow} transition-all duration-500 group`}
    >
      {/* Stadium Background Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 group-hover:opacity-80" 
        style={{ background: style.stadium }} 
      />
      
      {/* Dynamic Aura Background */}
      <div className={`absolute -top-20 -left-20 w-80 h-80 z-0 ${style.aura} rounded-full pointer-events-none animate-pulse`} />
      
      {/* Premium Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Ronaldo Image Container */}
      <div className="absolute left-0 bottom-0 z-[1] h-full w-[45%] flex items-end overflow-visible pointer-events-none">
        <motion.img 
          animate={controls}
          src={ronaldoImages[vipLevel.level]} 
          alt="Cristiano Ronaldo"
          className="h-[95%] w-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700 ease-out"
          style={{
            filter: vipLevel.level === 5 ? `drop-shadow(0 0 20px rgba(255,215,0,0.4))` : 
                    vipLevel.level === 4 ? `drop-shadow(0 0 15px rgba(239,68,68,0.3))` :
                    vipLevel.level === 3 ? `drop-shadow(0 0 15px rgba(168,85,247,0.3))` : 'none'
          }}
        />
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 z-[2]" />
      </div>

      {/* Content Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/40 to-transparent z-[2]" />

      {/* Card Content */}
      <div className="relative z-[3] p-7 ml-auto w-[60%] min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-primary/40 transition-all duration-500`}>
                <Crown className={`w-7 h-7 ${vipLevel.level >= 5 ? 'text-yellow-400' : 'text-zinc-400'} group-hover:scale-110 transition-transform`} />
              </div>
              <div>
                <h3 className="font-display text-3xl font-bold text-white tracking-tight leading-none mb-1">
                  VIP {vipLevel.level}
                </h3>
                <p className="text-xs text-primary font-bold uppercase tracking-[0.2em]">
                  {vipLevel.nameAr}
                </p>
              </div>
            </div>
            {isCurrentLevel && (
              <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                ACTIVE
              </div>
            )}
          </div>

          {/* Premium Info Boxes */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl p-4 border border-white/[0.05] group-hover:bg-white/[0.07] transition-all duration-500 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-zinc-400 font-medium">المهام اليومية</span>
              </div>
              <p className="text-lg font-display font-bold text-white">{vipLevel.dailyChallengeLimit}</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl p-4 border border-white/[0.05] group-hover:bg-white/[0.07] transition-all duration-500 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-xs text-zinc-400 font-medium">الربح اليومي</span>
              </div>
              <p className="text-lg font-display font-bold text-green-400">+{formatNumber(vipLevel.dailyProfit)}</p>
            </div>
          </div>
        </div>

        {/* Premium Action Button */}
        <div className="mt-auto">
          {!isUnlocked && (
            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between px-1">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">السعر الحصري</span>
                </div>
                <div className="flex flex-col items-end leading-none">
                  {hasDiscount && (
                    <span className="text-[10px] text-zinc-600 line-through mb-1">
                      {formatNumber(originalPrice)} USDT
                    </span>
                  )}
                  <span className="text-xl font-display font-bold text-white">
                    {formatNumber(discountedPrice)} <span className="text-xs text-primary ml-1">USDT</span>
                  </span>
                </div>
              </div>
              
              <GoldButton
                variant="primary"
                className="w-full h-14 rounded-2xl shadow-[0_10px_30px_-10px_rgba(234,179,8,0.5)] group-hover:shadow-[0_15px_40px_-10px_rgba(234,179,8,0.6)] group-hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction();
                }}
              >
                <div className="flex flex-col items-center justify-center leading-tight">
                  <span className="text-sm font-black tracking-widest">فتح الآن</span>
                  <span className="text-[10px] opacity-80 font-bold">{formatNumber(discountedPrice)} USDT</span>
                </div>
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
              </GoldButton>
            </div>
          )}
          
          {isUnlocked && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl h-14 flex items-center justify-center gap-3 backdrop-blur-md">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-black stroke-[3px]" />
              </div>
              <span className="text-green-500 font-black tracking-widest text-sm">تم التفعيل</span>
            </div>
          )}
        </div>
      </div>

      {/* Level 5 Legendary Particles */}
      {vipLevel.level === 5 && (
        <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden opacity-50">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: -150,
                x: Math.random() * 200 - 100
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute bottom-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
