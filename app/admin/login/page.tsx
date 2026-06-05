'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <TrendingUp className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-white text-2xl font-black">لوحة التحكم</h1>
          <p className="text-neutral-500 text-sm mt-1">مؤسسة تلال للمقاولات العامة</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 border border-white/8 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">تسجيل الدخول الآمن</p>
              <p className="text-neutral-500 text-xs">أدخل كلمة المرور للوصول للوحة التحكم</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-neutral-400 text-xs font-bold mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3.5 pl-12 text-sm font-medium placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 disabled:cursor-not-allowed text-neutral-950 font-black rounded-xl px-6 py-4 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <span>دخول إلى لوحة التحكم</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-neutral-600 text-xs mt-6">
          هذه اللوحة للإدارة الداخلية فقط • مؤسسة تلال للمقاولات
        </p>
      </div>
    </div>
  );
}
