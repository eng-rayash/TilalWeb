'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'كلمة المرور غير صحيحة');
        setLoading(false);
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/8 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-stone-200/60 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #92400e 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_8px_24px_rgba(245,158,11,.3)] mb-4">
            <TrendingUp className="w-8 h-8 text-stone-950" />
          </div>
          <h1 className="text-stone-900 text-2xl font-black">لوحة التحكم</h1>
          <p className="text-stone-500 text-sm mt-1 font-medium">مؤسسة تلال للمقاولات العامة</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,.08)]">
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-7 pb-5 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-stone-900 font-bold text-sm">تسجيل الدخول الآمن</p>
              <p className="text-stone-400 text-xs mt-0.5">أدخل كلمة المرور للوصول للوحة التحكم</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-stone-600 text-xs font-bold mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium placeholder-stone-300 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-stone-950 font-black rounded-xl px-6 py-4 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(245,158,11,.25)] hover:shadow-[0_4px_20px_rgba(245,158,11,.35)] active:scale-[.98]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>دخول إلى لوحة التحكم</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <p className="text-stone-400 text-xs">هذه اللوحة للإدارة الداخلية فقط • مؤسسة تلال للمقاولات</p>
        </div>
      </div>
    </div>
  );
}
