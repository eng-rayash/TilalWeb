'use client';

import { useState } from 'react';
import {
  LayoutDashboard, Settings, Wrench, FolderOpen,
  FileText, Image, Star, BarChart3, LogOut,
  ChevronLeft, Menu, X, TrendingUp, ExternalLink,
  Bell, Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'لوحة الرئيسية', icon: LayoutDashboard, exact: true },
  { href: '/admin/analytics', label: 'إحصائيات الزوار', icon: BarChart3 },
  { href: '/admin/settings', label: 'الإعدادات العامة', icon: Settings },
  { href: '/admin/services', label: 'إدارة الخدمات', icon: Wrench },
  { href: '/admin/projects', label: 'إدارة المشاريع', icon: FolderOpen },
  { href: '/admin/articles', label: 'إدارة المقالات', icon: FileText },
  { href: '/admin/gallery', label: 'معرض الصور', icon: Image },
  { href: '/admin/testimonials', label: 'آراء العملاء', icon: Star },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <TrendingUp className="w-5 h-5 text-neutral-950" />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">لوحة التحكم</p>
            <p className="text-neutral-600 text-[10px] font-medium">مؤسسة تلال للمقاولات</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-400 shadow-sm'
                  : 'text-neutral-500 hover:bg-white/[0.03] hover:text-neutral-200'
              }`}
            >
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-500 rounded-r-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              )}
              <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : 'text-neutral-600 group-hover:text-amber-400'}`} />
              <span className="text-sm font-semibold">{item.label}</span>
              {active && <ChevronLeft className="w-3 h-3 mr-auto opacity-40" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.04] space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-neutral-500 hover:bg-white/[0.03] hover:text-neutral-200 transition-all duration-200 group"
        >
          <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-amber-400" />
          <span className="text-sm font-semibold">معاينة الموقع</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-neutral-500 hover:bg-red-500/[0.06] hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 text-neutral-600 group-hover:text-red-400" />
          <span className="text-sm font-semibold">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8 py-3 mb-2">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input
            type="text"
            placeholder="بحث سريع..."
            className="w-full bg-neutral-900/50 border border-white/[0.04] text-neutral-300 rounded-xl pr-9 pl-4 py-2 text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/30 focus:bg-neutral-900/80 transition-all backdrop-blur-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-xl bg-neutral-900/50 border border-white/[0.04] flex items-center justify-center text-neutral-500 hover:text-amber-400 hover:border-amber-500/20 transition-all backdrop-blur-sm">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[8px] font-bold text-neutral-950 flex items-center justify-center">3</span>
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[11px] font-black text-neutral-950 shadow-lg shadow-amber-500/10">
          م
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] font-sans" dir="rtl">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 right-3 z-50 w-9 h-9 rounded-xl bg-neutral-900/80 border border-white/[0.06] text-white flex items-center justify-center backdrop-blur-md"
      >
        <Menu className="w-4 h-4" />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-[#0c0c14] border-l border-white/[0.04] z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-white/[0.04] text-neutral-500 hover:text-white flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </aside>

      <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 bg-[#0c0c14] border-l border-white/[0.04] shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#0a0a0f]">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
