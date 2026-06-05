'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  LayoutDashboard, Settings, Wrench, FolderOpen,
  FileText, Image, Star, BarChart3, LogOut,
  ChevronLeft, Menu, X, TrendingUp, ExternalLink
} from 'lucide-react';

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

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-neutral-950 font-black" />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">لوحة التحكم</p>
            <p className="text-neutral-500 text-[10px] font-medium">مؤسسة تلال للمقاولات</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                active
                  ? 'bg-amber-500 text-neutral-950'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-300 rounded-l-full" />
              )}
              <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-neutral-950' : 'text-neutral-500 group-hover:text-amber-400'}`} />
              <span className="text-sm font-bold">{item.label}</span>
              {active && <ChevronLeft className="w-3 h-3 mr-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: View Site + Logout */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-white/5 hover:text-white transition-all duration-200 group"
        >
          <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-amber-400" />
          <span className="text-sm font-bold">معاينة الموقع</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 text-neutral-600 group-hover:text-red-400" />
          <span className="text-sm font-bold">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-xl bg-neutral-800 border border-white/10 text-white flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-neutral-900 border-l border-white/5 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-neutral-900 border-l border-white/5 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
