import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Crown, Mail, Lock, User, UserPlus, LogIn, Eye, EyeOff, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GoldButton } from '@/components/ui/GoldButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const signUpSchema = z.object({
  username: z.string().trim().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(50, 'الاسم طويل جداً'),
  email: z.string().trim().email('البريد الإلكتروني غير صالح').max(255, 'البريد الإلكتروني طويل جداً'),
  password: z.string().min(6, 'كلمة السر يجب أن تكون 6 أحرف على الأقل').max(100, 'كلمة السر طويلة جداً'),
  referralCode: z.string().max(20, 'رمز الإحالة غير صالح').optional().or(z.literal('')),
});

const signInSchema = z.object({
  email: z.string().trim().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة السر مطلوبة'),
});

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
  
  const { signUp, signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate signup data
        const validation = signUpSchema.safeParse({ username, email, password, referralCode });
        if (!validation.success) {
          toast({
            title: 'خطأ في البيانات',
            description: validation.error.errors[0].message,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email.trim(), password, username.trim(), referralCode.trim() || undefined);
        
        if (error) {
          let message = 'حدث خطأ أثناء إنشاء الحساب';
          if (error.message?.includes('already registered')) {
            message = 'البريد الإلكتروني مسجل مسبقاً';
          } else if (error.message?.includes('Invalid email')) {
            message = 'البريد الإلكتروني غير صالح';
          } else if (error.message?.includes('Password')) {
            message = 'كلمة السر ضعيفة جداً';
          }
          toast({
            title: 'خطأ',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'تم إنشاء الحساب بنجاح! 🎉',
            description: 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني',
          });
        }
      } else {
        // Validate signin data
        const validation = signInSchema.safeParse({ email, password });
        if (!validation.success) {
          toast({
            title: 'خطأ في البيانات',
            description: validation.error.errors[0].message,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email.trim(), password);
        
        if (error) {
          let message = 'حدث خطأ أثناء تسجيل الدخول';
          if (error.message?.includes('Invalid login')) {
            message = 'البريد الإلكتروني أو كلمة السر غير صحيحة';
          } else if (error.message?.includes('Email not confirmed')) {
            message = 'يرجى تأكيد بريدك الإلكتروني أولاً';
          }
          toast({
            title: 'خطأ',
            description: message,
            variant: 'destructive',
          });
        }
      }
    } catch (err) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-10 pb-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-gradient-gold">CR7 ELITE</h1>
            <p className="text-muted-foreground text-sm mt-1">منصة النخبة للربح</p>
          </div>
        </motion.div>
      </div>

      {/* Form Card */}
      <div className="flex-1 px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-card border border-border rounded-3xl p-6 max-w-md mx-auto"
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                !isSignUp 
                  ? 'bg-gradient-gold text-primary-foreground shadow-gold' 
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                isSignUp 
                  ? 'bg-gradient-gold text-primary-foreground shadow-gold' 
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              حساب جديد
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-11 text-right bg-secondary/50 border-border h-12 rounded-xl"
                  dir="rtl"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-11 text-right bg-secondary/50 border-border h-12 rounded-xl"
                dir="rtl"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة السر"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11 pl-11 text-right bg-secondary/50 border-border h-12 rounded-xl"
                dir="rtl"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {isSignUp && (
              <div className="relative">
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="رمز الإحالة (اختياري)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="pr-11 text-right bg-secondary/50 border-border h-12 rounded-xl"
                  dir="rtl"
                  maxLength={20}
                />
              </div>
            )}

            <GoldButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  إنشاء حساب جديد
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </span>
              )}
            </GoldButton>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            {isSignUp ? (
              <>بإنشاء حساب، أنت توافق على شروط الاستخدام وسياسة الخصوصية</>
            ) : (
              <>مرحباً بك مجدداً في منصة النخبة</>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
