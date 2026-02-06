import { motion, useAnimation } from 'framer-motion';
import { Check, Crown, Target, TrendingUp, Wallet, ArrowRight, Star, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VIPLevel } from '@/data/mockData';
import React from 'react';

// Import New VIP Images from final folder
import vip0 from '@/assets/vip-final/vip0_gen.png';
import vip1 from '@/assets/vip-final/vip1_gen.png';
import vip2 from '@/assets/vip-final/vip2_gen.png';
import vip3 from '@/assets/vip-final/vip3_gen.png';
import vip4 from '@/assets/vip-final/vip4_gen.png';
import vip5 from '@/assets/vip-final/vip5_gen.png';

interface VIPCardProps {
  vipLevel: VIPLevel;
  currentLevel: number;
  index: number;
  referralDiscount?: number;
}

const ronaldoImages: Record<number, string> = {
  0: vip0,
  1: vip1,
  2: vip2,
  3: vip3,
  4: vip4,
  5: vip5,
};

const levelStyles: Record<number, { 
  glow: string, 
  border: string, 
  overlay: string, 
  bgGradient: string,
  particleColor: string,
  buttonGlow: string
}> = {
  0: { 
    glow: 'shadow-[0_0_20px_rgba(30,58,138,0.3)]', 
    border: 'border-blue-900/30', 
    overlay: 'bg-blue-950/40', 
    bgGradient: 'from-blue-950 via-blue-900/20 to-transparent', 
    particleColor: 'bg-blue-400',
    buttonGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]'
  },
  1: { 
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.4)]', 
    border: 'border-blue-500/30', 
    overlay: 'bg-blue-900/40', 
    bgGradient: 'from-blue-900 via-blue-800/20 to-transparent', 
    particleColor: 'bg-blue-300',
    buttonGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]'
  },
  2: { 
    glow: 'shadow-[0_0_30px_rgba(255,255,255,0.3)]', 
    border: 'border-slate-200/30', 
    overlay: 'bg-slate-900/50', 
    bgGradient: 'from-slate-900 via-slate-800/20 to-transparent', 
    particleColor: 'bg-white',
    buttonGlow: 'shadow-[0_0_15px_rgba(255,255,255,0.5)]'
  },
  3: { 
    glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]', 
    border: 'border-purple-500/40', 
    overlay: 'bg-purple-950/50', 
    bgGradient: 'from-purple-950 via-purple-900/20 to-transparent', 
    particleColor: 'bg-purple-400',
    buttonGlow: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]'
  },
  4: { 
    glow: 'shadow-[0_0_50px_rgba(239,68,68,0.5)]', 
    border: 'border-red-500/50', 
    overlay: 'bg-red-950/40', 
    bgGradient: 'from-red-950 via-yellow-900/20 to-transparent', 
    particleColor: 'bg-yellow-500',
    buttonGlow: 'shadow-[0_0_25px_rgba(239,68,68,0.7)]'
  },
  5: { 
    glow: 'shadow-[0_0_100px_rgba(255,215,0,0.8)]', 
    border: 'border-yellow-400/80', 
    overlay: 'bg-yellow-950/10', 
    bgGradient: 'from-yellow-950 via-yellow-900/60 to-transparent', 
    particleColor: 'bg-yellow-200',
    buttonGlow: 'shadow-[0_0_30px_rgba(255,215,0,0.8)]'
  },
};

export const VIPCard = ({ vipLevel, currentLevel, index }: VIPCardProps) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const isUnlocked = vipLevel.level <= currentLevel;
  const style = levelStyles[vipLevel.level] || levelStyles[0];

  const handleAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await controls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    });
    navigate('/profile', { state: { openDeposit: true } });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      onClick={handleAction}
      className={`relative h-[480px] w-full rounded-[2.5rem] overflow-hidden cursor-pointer border ${style.border} ${style.glow} transition-all duration-500 group bg-black shadow-2xl mb-4`}
    >
      {/* Background Effect */}
      <div className={`absolute inset-0 z-[1] ${style.overlay} backdrop-blur-[1px]`} />
      <div className={`absolute inset-0 z-[1] bg-gradient-to-t ${style.bgGradient}`} />

      {/* Ronaldo Image */}
      <div className="absolute left-[-10%] bottom-0 z-[2] h-[95%] w-[65%] flex items-end justify-center pointer-events-none">
        <motion.img 
          loading="eager"
          src={ronaldoImages[vipLevel.level]} 
          alt={vipLevel.name}
          className="h-full w-auto object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-transform duration-500 origin-bottom group-hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="relative z-[3] p-6 ml-auto w-[55%] h-full flex flex-col justify-between text-right">
        <div className="flex flex-col items-end">
          {/* VIP Badge & Title */}
          <div className="flex flex-col items-end mb-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-2">
                <Crown className="w-6 h-6 text-white" />
             </div>
             <h3 className="font-display text-4xl font-black text-white italic tracking-tighter leading-none">
               {vipLevel.name}
             </h3>
             <p className="text-xs font-bold text-gradient-gold mt-1">
               {vipLevel.nameAr}
             </p>
             <p className="text-[11px] font-bold text-gradient-gold uppercase tracking-wider mt-1">
               {vipLevel.clubAr} — {vipLevel.year}
             </p>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 flex items-center justify-end gap-3">
              <span className="text-sm font-display font-bold text-white">{vipLevel.dailyChallengeLimit}</span>
              <span className="text-[10px] text-zinc-400 font-bold">المهام اليومية</span>
              <Target className="w-4 h-4 text-yellow-500" />
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 flex items-center justify-end gap-3">
              <span className="text-sm font-display font-bold text-white">{vipLevel.simpleInterest}%</span>
              <span className="text-[10px] text-zinc-400 font-bold">مصلحة بسيطة</span>
              <Percent className="w-4 h-4 text-blue-400" />
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 flex items-center justify-end gap-3">
              <span className="text-sm font-display font-bold text-green-400">+{formatNumber(vipLevel.dailyProfit)}</span>
              <span className="text-[10px] text-zinc-400 font-bold">الربح اليومي</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 flex items-center justify-end gap-3">
              <span className="text-sm font-display font-bold text-yellow-400">{formatNumber(vipLevel.totalProfit)}</span>
              <span className="text-[10px] text-zinc-400 font-bold">إجمالي الربح</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="w-full mt-auto">
          {!isUnlocked ? (
            <div className="flex flex-col gap-2">
              {/* Pricing Display */}
              <div className="flex flex-col items-end px-2">
                <span className="text-[10px] text-zinc-500 line-through">
                  {formatNumber(vipLevel.price)} USDT
                </span>
                <span className="text-xl font-black text-white">
                  {formatNumber(vipLevel.referralPrice)} USDT
                </span>
              </div>

              <motion.button
                animate={{ 
                  boxShadow: ["0 0 0px rgba(234,179,8,0)", "0 0 20px rgba(234,179,8,0.4)", "0 0 0px rgba(234,179,8,0)"],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center gap-2 ${style.buttonGlow} active:scale-95 transition-all relative overflow-hidden`}
                onClick={handleAction}
              >
                {/* Shine effect */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                />
                <span className="text-sm font-black text-black uppercase relative z-10">
                  فتح الآن — {formatNumber(vipLevel.referralPrice)} USDT
                </span>
                <ArrowRight className="w-4 h-4 text-black relative z-10" />
              </motion.button>
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-500/50 rounded-2xl h-12 flex items-center justify-center gap-3 backdrop-blur-md w-full">
              <span className="text-green-400 font-black text-xs uppercase">تم التفعيل</span>
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-black stroke-[3px]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 480 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: -50,
              x: (Math.random() - 0.5) * 300 + 150,
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className={`absolute bottom-0 w-1 h-1 rounded-full ${style.particleColor}`}
          />
        ))}
      </div>
    </motion.div>
  );
};
