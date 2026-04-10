import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCog, Plus, Search, X, Mail, Phone,
  ShieldCheck, Crown, Briefcase, Headphones, Eye,
} from 'lucide-react';
import { getMockStaff } from '../store/staffMock';
import type { Staff, StaffRole } from '../types/staff';

const ROLE_META: Record<StaffRole, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  owner:   { label: 'Owner',   color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Crown },
  admin:   { label: 'Admin',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: ShieldCheck },
  sales:   { label: 'Sales',   color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: Briefcase },
  support: { label: 'Support', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Headphones },
  viewer:  { label: 'Viewer',  color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200',     icon: Eye },
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-orange-500', 'bg-teal-500', 'bg-rose-500',
];

export const StaffPage: React.FC = () => {
  const allStaff = useMemo(() => getMockStaff(), []);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'all'>('all');
  const [selected, setSelected] = useState<Staff | null>(null);

  const staff = useMemo(() => {
    const q = search.toLowerCase();
    return allStaff.filter(s => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchRole = roleFilter === 'all' || s.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [allStaff, search, roleFilter]);

  const roleCounts = useMemo(() => {
    const c: Record<string, number> = { all: allStaff.length };
    allStaff.forEach(s => { c[s.role] = (c[s.role] ?? 0) + 1; });
    return c;
  }, [allStaff]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-blue-600" /> Staff
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{allStaff.length} team members</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Member
        </motion.button>
      </div>

      {/* Role Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'owner', 'admin', 'sales', 'support', 'viewer'] as const).map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              roleFilter === role
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
            }`}
          >
            {role === 'all' ? 'All' : ROLE_META[role].label}
            <span className="ml-1.5 opacity-70">({roleCounts[role] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member, i) => {
          const meta = ROLE_META[member.role];
          const RoleIcon = meta.icon;
          const avatarColor = AVATAR_COLORS[member.id % AVATAR_COLORS.length];
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              onClick={() => setSelected(member)}
              className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-base shrink-0`}>
                  {getInitials(member.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">{member.name}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border mt-0.5 ${meta.bg} ${meta.color}`}>
                    <RoleIcon className="w-3 h-3" /> {meta.label}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
              </div>
              {member.permissions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {member.permissions.slice(0, 3).map(p => (
                    <span key={p} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{p}</span>
                  ))}
                  {member.permissions.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-md">+{member.permissions.length - 3}</span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
        {staff.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <UserCog className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No staff found</p>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${AVATAR_COLORS[selected.id % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-base shrink-0`}>
                    {getInitials(selected.name)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{selected.name}</h2>
                    <p className="text-xs text-gray-500 capitalize">{selected.role}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {(() => { const m = ROLE_META[selected.role]; const I = m.icon; return (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${m.bg} ${m.color}`}>
                    <I className="w-4 h-4" /> {m.label}
                  </span>
                ); })()}
                <Row label="Email" value={selected.email} />
                <Row label="Phone" value={selected.phone} />
                <Row label="Member Since" value={new Date(selected.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} />
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.permissions.map(p => (
                      <span key={p} className="px-2 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-lg font-medium">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800">{value}</span>
  </div>
);

export default StaffPage;
