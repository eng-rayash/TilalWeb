'use client';

import { useState } from 'react';
import {
  LayoutDashboard, Settings, Wrench, FolderOpen,
  Image, Star, BarChart3, LogOut,
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
    <div className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,.3)] shrink-0">
            <TrendingUp className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <p className="text-stone-900 font-black text-sm leading-tight">لوحة التحكم</p>
            <p className="text-stone-500 text-[10px] font-medium mt-0.5">مؤسسة تلال للمقاولات</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">القائمة الرئيسية</p>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? 'bg-amber-50 text-amber-700 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-500 rounded-l-full" />
              )}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                active ? 'bg-amber-100' : 'bg-stone-100 group-hover:bg-stone-200'
              }`}>
                <item.icon className={`w-4 h-4 ${active ? 'text-amber-600' : 'text-stone-500 group-hover:text-stone-700'}`} />
              </div>
              <span className={`text-sm font-semibold ${active ? 'text-amber-700' : ''}`}>{item.label}</span>
              {active && <ChevronLeft className="w-3 h-3 mr-auto text-amber-400 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Links */}
      <div className="px-3 py-4 border-t border-stone-100 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center shrink-0 transition-colors">
            <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
          </div>
          <span className="text-sm font-semibold">معاينة الموقع</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
            <LogOut className="w-4 h-4 text-stone-400 group-hover:text-red-500" />
          </div>
          <span className="text-sm font-semibold">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8 py-3 bg-white/90 backdrop-blur-sm border-b border-stone-100">
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="بحث سريع..."
            className="w-full bg-stone-50 border border-stone-200 text-stone-700 rounded-xl pr-9 pl-4 py-2 text-xs placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[8px] font-bold text-stone-950 flex items-center justify-center">3</span>
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[11px] font-black text-stone-950 shadow-[0_2px_8px_rgba(245,158,11,.3)]">
          م
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans" dir="rtl">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 right-3 z-50 w-9 h-9 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center shadow-sm"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-stone-900/40 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 right-0 h-full w-64 border-l border-stone-200 z-50 transition-transform duration-300 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 border-l border-stone-200 shrink-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-8 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
