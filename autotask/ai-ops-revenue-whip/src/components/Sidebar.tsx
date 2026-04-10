"use client";

import { FolderKanban, BarChart3, Users, LayoutDashboard, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from 'next-auth/react';
import GoogleLoginButton from './GoogleLoginButton';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/" },
  { id: "projects", label: "Projects", icon: <FolderKanban size={20} />, href: "/projects" },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={20} />, href: "/analytics" },
  { id: "team", label: "Team", icon: <Users size={20} />, href: "/team" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  // Get active item based on current pathname
  const getActiveItem = () => {
    if (pathname === "/") return "dashboard";
    const path = pathname.replace("/", "");
    return navItems.find(item => item.href === pathname)?.id || "dashboard";
  };

  const activeItem = getActiveItem();

  const handleNavigation = (href: string) => {
    router.push(href);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleImageError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = error.target as HTMLImageElement;
    console.error('Image loading error:', {
      src: target.src,
      error: error,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      <aside
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col transition-transform duration-300"
        style={{ 
          transform: typeof window !== 'undefined' && window.innerWidth < 1024 
            ? (isOpen ? 'translateX(0)' : '-100%') 
            : 'translateX(0)'
        }}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">AI-Ops Revenue</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeItem === item.id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          {session ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="w-full h-full rounded-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2 mt-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <GoogleLoginButton />
          )}
        </div>
      </aside>
    </>
  );
}
