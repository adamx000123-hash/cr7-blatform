import { motion, useAnimation } from 'framer-motion';
import { Check, Crown, Target, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VIPLevel } from '@/data/mockData';
import React from 'react';

// Import New VIP Images from processed folder
import vip0 from '@/assets/vip-processed/vip0.png';
import vip1 from '@/assets/vip-processed/vip1.png';
import vip2 from '@/assets/vip-processed/vip2.png';
import vip3 from '@/assets/vip-processed/vip3.png';
import vip4 from '@/assets/vip-processed/vip4.png';
import vip5 from '@/assets/vip-processed/vip5.png';

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

const stadiumBackgrounds: Record<number, string> = {
  0: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWO2aWvgj9iecV4Vy1q2hH_s4j4iQXTvFmlpIPZWB7oWinie5k28keUV3RIfX45mPEgfzRYLUC8r9SOB6R5v_8JJDRHKLgkDSLvndphI7BYB6GTDomQauLURv3ay6bemePNU4oaVZbm2fPLL2Jv3PQ5c4CbE2Guw0PYdjD3citekYQDSwRJOSjPOca5lI/s1600/IMG_2561.png',
  1: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4mOmSgoCoctyIOJyLKCbocZpRqFB29IhBd4Q9fbAyKP_c7XasCLMGfeSX6sKXNbEkfh7nLyYGF1yPV42ja1jzEohg432ABmQIkRFdCsd3Pv_r32EMJ81R-REcV_go9r-sQYSp9shEIuHgxEgEY-SoZ33udIoVxr3q-ac-jbDkfibNaXvftpNCjsLMGoY/s1600/IMG_2560.png',
  2: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjo0TFuiXxehVTorQw5zImbrMGPa6kaKZF2YxvaHiVqMaJIoIHcxfW95PX-juwZ3rKDJokReHPA3eLmTeWSryfyDTsfdmLv_KrtGsn1koOB1rvpp4nCUGDcZnzotZSDGWJeOA6K1nqh4MZ3L9MW1c2cOIcYTZEnuUVThMTfAstcHjL1KORXgBMfMfDZtns/s1600/IMG_2562.jpeg',
  3: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_cd6NYjdWfvpHXCplBWhkZndYiF1_w73CqlsyzWfPH5-9m488YEUE_YWmVu9rZ2pNphLxo-aEMKGRvaX7ESSctmWvuudxkPoXk7Q95WUvzlV2FWQUg_c4PHFKqfB37_BIJxxCC9JBs-_XqYK5EDuX9PeAbAy2tFFtCiyvd3PyyE-3oIywAUMebKIuf08/s1600/IMG_2558.png',
  4: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSgxijf0Qsz757uduMUR9pjq6F1ILmbdTImLqNs62EXOFjVMLzNUaldV5_gWrjOAMdPjUNDquu6OZSQaw1yZl0eQU314cLrcls67H7V53yt7Dj2Z6cUdeLvumaOTOnwcAztNVxMgoGY5TjEk0QPY0jnar28qxN-YHwQIobRbsXW5KYbB0VSWr3yQIbxN4/s1600/IMG_2559.png',
  5: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmsHqltpEzmafR80EfvGx5Jcicbx3cRB7dgnFFKfNIsvQ9CdAPmU38ANrD8X8w6waTEjVS_orRm88-qGMJ03pjPCSTwtS8_9t_mudx8ui2zalEEB7isMEx4b3Dkk4ijloeZKSy_xC_uZaGnpuhgfdVPc14ZMxz5VmmwIU3ccP8nBVI3ljaWSupAE0V6TA/s1600/IMG_2557.png',
};

const levelStyles: Record<number, { 
  glow: string, 
  border: string, 
  overlay: string, 
  bgGradient: string,
  particleColor: string 
}> = {
  0: { glow: 'shadow-[0_0_20px_rgba(30,58,138,0.3)]', border: 'border-blue-900/30', overlay: 'bg-blue-950/40', bgGradient: 'from-blue-950 via-blue-900/20 to-transparent', particleColor: 'bg-blue-400' },
  1: { glow: 'shadow-[0_0_25px_rgba(59,130,246,0.4)]', border: 'border-blue-500/30', overlay: 'bg-blue-900/40', bgGradient: 'from-blue-900 via-blue-800/20 to-transparent', particleColor: 'bg-blue-300' },
  2: { glow: 'shadow-[0_0_30px_rgba(255,255,255,0.3)]', border: 'border-slate-200/30', overlay: 'bg-slate-900/50', bgGradient: 'from-slate-900 via-slate-800/20 to-transparent', particleColor: 'bg-white' },
  3: { glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]', border: 'border-purple-500/40', overlay: 'bg-purple-950/50', bgGradient: 'from-purple-950 via-purple-900/20 to-transparent', particleColor: 'bg-purple-400' },
  4: { glow: 'shadow-[0_0_50px_rgba(239,68,68,0.5)]', border: 'border-red-500/50', overlay: 'bg-red-950/40', bgGradient: 'from-red-950 via-yellow-900/20 to-transparent', particleColor: 'bg-yellow-500' },
  5: { glow: 'shadow-[0_0_100px_rgba(255,215,0,0.8)]', border: 'border-yellow-400/80', overlay: 'bg-yellow-950/10', bgGradient: 'from-yellow-950 via-yellow-900/60 to-transparent', particleColor: 'bg-yellow-200' },
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
      className={`relative h-[380px] w-full rounded-[2.5rem] overflow-hidden cursor-pointer border ${style.border} ${style.glow} transition-all duration-500 group bg-black shadow-2xl`}
    >
      {/* Background Stadium Effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
        style={{ backgroundImage: `url(${stadiumBackgrounds[vipLevel.level] || stadiumBackgrounds[0]})` }} 
      />
      <div className={`absolute inset-0 z-[1] ${style.overlay} backdrop-blur-[1px]`} />
      <div className={`absolute inset-0 z-[1] bg-gradient-to-t ${style.bgGradient}`} />

      {/* Ronaldo Image - Positioned to the left and adjusted for the new height */}
      <div className="absolute left-[-5%] bottom-0 z-[2] h-[85%] w-[60%] flex items-end justify-center pointer-events-none">
        <motion.img 
          loading="eager"
          src={ronaldoImages[vipLevel.level]} 
          alt={vipLevel.name}
          className="h-full w-auto object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 origin-bottom"
        />
      </div>

      {/* Content Area - Positioned to the right */}
      <div className="relative z-[3] p-6 ml-auto w-[60%] h-full flex flex-col justify-between text-right">
        <div className="flex flex-col items-end">
          {/* VIP Badge & Title */}
          <div className="flex flex-col items-end mb-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-2">
                <Crown className="w-6 h-6 text-white" />
             </div>
             <h3 className="font-display text-4xl font-black text-white italic tracking-tighter leading-none">
               {vipLevel.name}
             </h3>
             <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mt-1">
               {vipLevel.nameAr}
             </p>
          </div>

          {/* Stats Section - Re-designed to match the image */}
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/5 flex items-center justify-end gap-3 h-12">
              <span className="text-sm font-display font-bold text-white">{vipLevel.dailyChallengeLimit}</span>
              <span className="text-[11px] text-zinc-400 font-bold">المهام</span>
              <Target className="w-4 h-4 text-yellow-500" />
            </div>

            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/5 flex items-center justify-end gap-3 h-12">
              <span className="text-sm font-display font-bold text-green-400">+{formatNumber(vipLevel.dailyProfit)}</span>
              <span className="text-[11px] text-zinc-400 font-bold">الربح</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
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
                  ${formatNumber(vipLevel.price)}
                </span>
                <span className="text-lg font-black text-white">
                  ${formatNumber(vipLevel.referralPrice)}
                </span>
              </div>

              <button
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                onClick={handleAction}
              >
                <span className="text-sm font-black text-black uppercase">افتح الآن</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
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

      {/* Floating Particles for Premium Effect */}
      <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden opacity-30">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 380 }}
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
