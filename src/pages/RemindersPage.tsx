import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Plus, Search, Clock, Calendar, Flag, X,
  RefreshCw, CheckCircle, AlertTriangle, Repeat,
} from 'lucide-react';
import { getMockReminders, getMockOverdueReminders, getMockUpcomingReminders } from '../store/remindersMock';
import type { Reminder, Priority } from '../types/reminder';

const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  high:   { label: 'High',   color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
  medium: { label: 'Medium', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  low:    { label: 'Low',    color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
};

export const RemindersPage: React.FC = () => {
  const allReminders = useMemo(() => getMockReminders(), []);
  const overdue = useMemo(() => getMockOverdueReminders(), []);
  const upcoming = useMemo(() => getMockUpcomingReminders(), []);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'overdue' | 'upcoming'>('all');
  const [selected, setSelected] = useState<Reminder | null>(null);

  const displayed = useMemo(() => {
    const base = filter === 'overdue' ? overdue : filter === 'upcoming' ? upcoming : allReminders;
    const q = search.toLowerCase();
    return base.filter(r => !q || r.title.toLowerCase().includes(q));
  }, [allReminders, overdue, upcoming, filter, search]);

  const formatDue = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.round(diff / 3600000);
    if (hours < 0) {
      const ago = Math.abs(hours);
      if (ago < 24) return `${ago}h overdue`;
      return `${Math.round(ago / 24)}d overdue`;
    }
    if (hours < 24) return `In ${hours}h`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isOverdue = (d: string) => new Date(d) < new Date();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-500" /> Reminders
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            <span className="text-red-600 font-semibold">{overdue.length} overdue</span>
            {' · '}{upcoming.length} upcoming
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Reminder
        </motion.button>
      </div>

      {/* Overdue Alert */}
      {overdue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">
            <span className="font-semibold">{overdue.length} reminder{overdue.length > 1 ? 's' : ''} overdue.</span>
            {' '}Please take action.
          </p>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'upcoming', 'overdue'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
            }`}
          >
            {f === 'all' ? `All (${allReminders.length})` : f === 'upcoming' ? `Upcoming (${upcoming.length})` : `Overdue (${overdue.length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search reminders…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Reminder List */}
      <div className="space-y-3">
        {displayed.map((reminder, i) => {
          const pm = PRIORITY_META[reminder.priority];
          const overdueBool = isOverdue(reminder.due_at);
          return (
            <motion.div
              key={reminder.id + reminder.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              onClick={() => setSelected(reminder)}
              className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all group flex items-start gap-4 ${
                overdueBool ? 'border-red-200 hover:border-red-400' : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${overdueBool ? 'bg-red-50' : 'bg-orange-50'}`}>
                {reminder.repeat !== 'none'
                  ? <Repeat className={`w-5 h-5 ${overdueBool ? 'text-red-500' : 'text-orange-500'}`} />
                  : <Bell className={`w-5 h-5 ${overdueBool ? 'text-red-500' : 'text-orange-500'}`} />
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 transition-colors leading-snug">
                    {reminder.title}
                  </p>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${pm.bg} ${pm.color}`}>
                    <Flag className="w-2.5 h-2.5" /> {pm.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className={`flex items-center gap-1 text-xs ${overdueBool ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    {formatDue(reminder.due_at)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 capitalize">
                    <Calendar className="w-3.5 h-3.5" />
                    {reminder.object_type}
                    {reminder.repeat !== 'none' && <span className="ml-1 text-blue-500">· {reminder.repeat}</span>}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {displayed.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No reminders found</p>
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
                <h2 className="text-base font-bold text-gray-900 flex-1 pr-3">{selected.title}</h2>
                <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <Row label="Priority" value={PRIORITY_META[selected.priority].label} />
                <Row label="Due" value={new Date(selected.due_at).toLocaleString('en-IN')} />
                <Row label="Object Type" value={selected.object_type} />
                <Row label="Repeat" value={selected.repeat === 'none' ? 'No repeat' : selected.repeat.charAt(0).toUpperCase() + selected.repeat.slice(1)} />
                {selected.object_id && <Row label="Reference ID" value={String(selected.object_id)} />}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                    <CheckCircle className="w-4 h-4" /> Mark Done
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Snooze
                  </button>
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
    <span className="text-sm text-gray-800 capitalize">{value}</span>
  </div>
);

export default RemindersPage;
