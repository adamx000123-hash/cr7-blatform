import { motion, useAnimation } from 'framer-motion';
import { Check, Crown, Zap, Calendar, TrendingUp, DollarSign, Coins, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VIPLevel } from '@/data/mockData';
import { GoldButton } from '../ui/GoldButton';

// Import New VIP Images
import vip0 from '@/assets/vip/vip-0-al-nassr.png';
import vip1 from '@/assets/vip/vip-1-man-utd.png';
import vip2 from '@/assets/vip/vip-2-training.png';
import vip3 from '@/assets/vip/vip-3-real-madrid.png';
import vip4 from '@/assets/vip/vip-4-prime.png';
import vip5 from '@/assets/vip/vip-5-ballon-dor.png';

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
  // Apply $20 discount if user has a referral discount or was referred
  const effectiveDiscount = referralDiscount > 0 ? referralDiscount : 20;
  const discountedPrice = Math.max(0, originalPrice - effectiveDiscount);
  const hasDiscount = originalPrice > 0; // Show discount for all paid cards as per instructions ($20 discount)

  // Level specific styles
  const levelStyles: Record<number, { bg: string, glow: string, aura: string, border: string }> = {
    0: { 
      bg: 'from-zinc-900 via-zinc-800 to-black', 
      glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]',
      aura: 'opacity-20 blur-xl bg-white',
      border: 'border-zinc-700/30'
    },
    0.5: { 
      bg: 'from-zinc-900 via-zinc-800 to-black', 
      glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]',
      aura: 'opacity-20 blur-xl bg-white',
      border: 'border-zinc-700/30'
    },
    1: { 
      bg: 'from-blue-950 via-slate-900 to-black', 
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.2)]',
      aura: 'opacity-30 blur-2xl bg-blue-500',
      border: 'border-blue-600/30'
    },
    2: { 
      bg: 'from-slate-800 via-slate-900 to-black', 
      glow: 'shadow-[0_0_25px_rgba(148,163,184,0.3)]',
      aura: 'opacity-30 blur-2xl bg-slate-300',
      border: 'border-slate-500/30'
    },
    3: { 
      bg: 'from-purple-950 via-zinc-900 to-black', 
      glow: 'shadow-[0_0_35px_rgba(168,85,247,0.3)]',
      aura: 'opacity-40 blur-3xl bg-purple-500 animate-pulse',
      border: 'border-purple-600/30'
    },
    4: { 
      bg: 'from-red-950 via-zinc-900 to-black', 
      glow: 'shadow-[0_0_35px_rgba(239,68,68,0.3)]',
      aura: 'opacity-40 blur-3xl bg-red-500 animate-pulse',
      border: 'border-red-600/30'
    },
    5: { 
      bg: 'from-yellow-900/40 via-zinc-900 to-black', 
      glow: 'shadow-[0_0_50px_rgba(255,215,0,0.5)]',
      aura: 'opacity-60 blur-[100px] bg-yellow-400 animate-pulse',
      border: 'border-yellow-500/50'
    },
  };

  const style = levelStyles[vipLevel.level] || levelStyles[0];

  const handleAction = async () => {
    // Pulse animation on click
    await controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 }
    });
    // Redirect to profile page with deposit state
    navigate('/profile', { state: { openDeposit: true } });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      onClick={handleAction}
      className={`relative rounded-3xl overflow-hidden cursor-pointer border ${style.border} bg-gradient-to-br ${style.bg} ${style.glow} transition-all duration-500 group`}
    >
      {/* Dynamic Aura Background */}
      <div className={`absolute -inset-20 z-0 ${style.aura} rounded-full pointer-events-none`} />
      
      {/* Luxury Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Ronaldo Image Container */}
      <div className="absolute left-0 bottom-0 z-[1] h-full w-1/2 flex items-end overflow-visible pointer-events-none">
        <motion.img 
          animate={controls}
          src={ronaldoImages[vipLevel.level]} 
          alt="Cristiano Ronaldo"
          className="h-[90%] w-auto object-contain object-bottom drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-700 ease-out mb-2"
          style={{
            filter: vipLevel.level === 5 ? `drop-shadow(0 0 15px rgba(255,215,0,0.6))` : 
                    vipLevel.level === 4 ? `drop-shadow(0 0 12px rgba(239,68,68,0.5))` :
                    vipLevel.level === 3 ? `drop-shadow(0 0 10px rgba(168,85,247,0.5))` : 'none'
          }}
        />
        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-[2]" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/40 to-transparent z-[2]" />

      {/* Card Content */}
      <div className="relative z-[3] p-6 ml-auto w-[65%] min-h-[280px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center shadow-xl group-hover:border-primary/50 transition-colors`}>
                <Crown className={`w-6 h-6 ${vipLevel.level >= 5 ? 'text-yellow-400 animate-pulse' : 'text-zinc-400'}`} />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                  VIP {vipLevel.level}
                </h3>
                <p className="text-sm text-primary font-semibold uppercase tracking-wider">
                  {vipLevel.nameAr}
                </p>
              </div>
            </div>
            {isCurrentLevel && (
              <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                المستوى الحالي
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/5 group-hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-zinc-400 uppercase">المهام</span>
              </div>
              <p className="text-lg font-bold text-white">{vipLevel.dailyChallengeLimit}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/5 group-hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3 h-3 text-green-400" />
                <span className="text-[10px] text-zinc-400 uppercase">الربح</span>
              </div>
              <p className="text-lg font-bold text-green-400">{formatNumber(vipLevel.dailyProfit)}</p>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="space-y-3">
          {!isUnlocked && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-zinc-500">سعر الفتح</span>
                <div className="flex flex-col items-end">
                  {hasDiscount && (
                    <span className="text-[10px] text-zinc-500 line-through">
                      {formatNumber(originalPrice)} USDT
                    </span>
                  )}
                  <span className="text-white font-mono font-bold">
                    {formatNumber(discountedPrice)} USDT
                  </span>
                </div>
              </div>
              <GoldButton
                variant="primary"
                size="lg"
                className="w-full shadow-2xl group-hover:scale-[1.02] transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction();
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                <span>فتح الآن</span>
              </GoldButton>
            </div>
          )}
          
          {isUnlocked && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl py-3 px-4 flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-bold">تم التفعيل</span>
            </div>
          )}
        </div>
      </div>

      {/* Level 5 Special Particles Effect */}
      {vipLevel.level === 5 && (
        <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: -100,
                x: Math.random() * 200 - 100
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
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
