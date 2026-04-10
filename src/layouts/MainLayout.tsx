import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  MessageSquare,
  Receipt,
  Star,
  TrendingUp,
  FolderKanban,
  Bell,
  UserCog,
  Settings,
  BarChart3,
  FileText,
  ShieldCheck,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  TableProperties,
} from 'lucide-react';
import { permissionService, UserRole, Permission } from '../services/permissions';
import { getMockStaff } from '../store/staffMock';
import { useSettings } from '../store/useSettings';
import { SettingsToolbar } from '../components/SettingsToolbar';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    permission: Permission.VIEW_DASHBOARD 
  },
  { 
    name: 'Install', 
    href: '/install', 
    icon: Download,
    permission: Permission.VIEW_DASHBOARD 
  },
  { 
    name: 'Leads', 
    href: '/leads', 
    icon: Users,
    permission: Permission.VIEW_LEADS 
  },
  { 
    name: 'Campaigns', 
    href: '/campaigns', 
    icon: Megaphone,
    permission: Permission.VIEW_CAMPAIGNS 
  },
  { 
    name: 'WhatsApp', 
    href: '/whatsapp', 
    icon: MessageSquare,
    permission: Permission.VIEW_WHATSAPP 
  },
  { 
    name: 'Sales', 
    href: '/sales', 
    icon: Receipt,
    permission: Permission.VIEW_SALES 
  },
  { 
    name: 'Invoices', 
    href: '/invoices', 
    icon: FileText,
    permission: Permission.CREATE_INVOICES 
  },
  { 
    name: 'Reviews', 
    href: '/reviews', 
    icon: Star,
    permission: Permission.VIEW_REVIEWS 
  },
  { 
    name: 'GBP Optimizer', 
    href: '/gbp', 
    icon: TrendingUp,
    permission: Permission.VIEW_GBP 
  },
  { 
    name: 'Projects', 
    href: '/projects', 
    icon: FolderKanban,
    permission: Permission.VIEW_PROJECTS 
  },
  { 
    name: 'Reminders', 
    href: '/reminders', 
    icon: Bell,
    permission: Permission.VIEW_REMINDERS 
  },
  { 
    name: 'Staff', 
    href: '/staff', 
    icon: UserCog,
    permission: Permission.VIEW_STAFF 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    permission: Permission.VIEW_SETTINGS 
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    permission: Permission.VIEW_REPORTS
  },
  {
    name: 'Excel Dashboard',
    href: '/excel-upload',
    icon: TableProperties,
    permission: Permission.VIEW_DASHBOARD,
  },
];

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { animationSpeed } = useSettings();
  
  // Mock current user - in real app, this would come from auth context
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const staff = getMockStaff();
  const currentUser = staff[currentUserIndex];
  const currentRole = currentUser.role as UserRole;

  // Filter navigation items based on user permissions
  const accessibleNavigation = navigation.filter(item => 
    permissionService.hasPermission(currentRole, item.permission)
  );

  const toggleUser = () => {
    setCurrentUserIndex((prev) => (prev + 1) % staff.length);
  };

  // Check scroll position to show/hide buttons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setCanScrollLeft(scrollTop > 0); // Using canScrollLeft for "can scroll up"
      setCanScrollRight(scrollTop < scrollHeight - clientHeight - 1); // Using canScrollRight for "can scroll down"
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'up' | 'down') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollTop = direction === 'up'
        ? scrollContainerRef.current.scrollTop - scrollAmount
        : scrollContainerRef.current.scrollTop + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        top: newScrollTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-sm font-bold text-gray-900">The King of Gym Equipment</h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h1 className="text-base font-bold text-gray-900">Menu</h1>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Current User (Mobile) */}
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-900">{currentUser.name}</p>
                          <p className="text-xs text-gray-600 capitalize">{currentUser.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleUser}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Switch
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {accessibleNavigation.map((item, index) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 / animationSpeed, delay: (index * 0.05) / animationSpeed }}
                      >
                        <Link
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 mr-3 ${
                            isActive ? 'text-blue-600' : 'text-gray-500'
                          }`} />
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div 
        className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col"
        onMouseEnter={() => setShowScrollButtons(true)}
        onMouseLeave={() => setShowScrollButtons(false)}
      >
        {/* Header with Brand */}
        <div className="p-4 border-b border-gray-200">
          <motion.h1 
            className="text-lg font-bold text-gray-900 leading-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 / animationSpeed }}
          >
            The King of Gym Equipment System
          </motion.h1>
          
          {/* Current User Role Badge */}
          <motion.div 
            className="mt-3 p-2 bg-blue-50 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 / animationSpeed, delay: (0.1 / animationSpeed) }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={toggleUser}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                title="Switch user (demo only)"
              >
                Switch
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scrollable Navigation Container */}
        <div className="flex-1 relative">
          {/* Up Scroll Button */}
          <AnimatePresence>
            {showScrollButtons && canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => scroll('up')}
                className="absolute left-1/2 -translate-x-1/2 top-2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all hover:scale-110 border border-gray-200"
                aria-label="Scroll up"
              >
                <ChevronUp className="w-4 h-4 text-gray-700" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Navigation Items with Horizontal Scroll */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 p-4 space-y-1"
            style={{
              scrollBehavior: 'smooth',
            }}
          >
            {accessibleNavigation.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 / animationSpeed, delay: (index * 0.05) / animationSpeed }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    </motion.div>
                    <span className="relative">
                      {item.name}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Down Scroll Button */}
          <AnimatePresence>
            {showScrollButtons && canScrollRight && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => scroll('down')}
                className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all hover:scale-110 border border-gray-200"
                aria-label="Scroll down"
              >
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Role Info */}
        <motion.div 
          className="p-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 / animationSpeed, delay: (0.2 / animationSpeed) }}
        >
          <div className="text-xs text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Role Permissions:</p>
            <p className="text-xs leading-relaxed">
              {permissionService.getRoleDescription(currentRole)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:pt-0 pt-14">
          <SettingsToolbar />
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
