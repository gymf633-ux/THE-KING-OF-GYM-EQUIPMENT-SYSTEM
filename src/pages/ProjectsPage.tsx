import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, Plus, Search, Calendar, User, Tag,
  ChevronRight, X, Clock, CheckCircle, PauseCircle, XCircle, StickyNote,
} from 'lucide-react';
import { getMockProjects } from '../store/projectsMock';
import type { Project, ProjectStage } from '../types/project';

const STAGE_META: Record<ProjectStage, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  planning:  { label: 'Planning',  color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   icon: Clock },
  active:    { label: 'Active',    color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  icon: CheckCircle },
  hold:      { label: 'On Hold',   color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: PauseCircle },
  closed:    { label: 'Closed',    color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200',   icon: XCircle },
};

export const ProjectsPage: React.FC = () => {
  const allProjects = useMemo(() => getMockProjects(), []);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<ProjectStage | 'all'>('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const projects = useMemo(() => {
    return allProjects.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
      const matchStage = stageFilter === 'all' || p.stage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [allProjects, search, stageFilter]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allProjects.length };
    allProjects.forEach(p => { counts[p.stage] = (counts[p.stage] ?? 0) + 1; });
    return counts;
  }, [allProjects]);

  const formatDate = (d?: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-600" /> Projects
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{allProjects.length} total projects</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Project
        </motion.button>
      </div>

      {/* Stage Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'planning', 'active', 'hold', 'closed'] as const).map(stage => (
          <button
            key={stage}
            onClick={() => setStageFilter(stage)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              stageFilter === stage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
            }`}
          >
            {stage === 'all' ? 'All' : STAGE_META[stage].label}
            <span className="ml-1.5 opacity-70">({stageCounts[stage] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by project or client name…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, i) => {
          const meta = STAGE_META[project.stage];
          const StageIcon = meta.icon;
          return (
            <motion.div
              key={project.id + project.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              onClick={() => setSelected(project)}
              className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug flex-1 pr-2">
                  {project.title}
                </h3>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${meta.bg} ${meta.color}`}>
                  <StageIcon className="w-3 h-3" />
                  {meta.label}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{project.client}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{formatDate(project.start_date)} → {formatDate(project.due_date)}</span>
                </div>
                {project.members.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{project.members.join(', ')}</span>
                  </div>
                )}
              </div>

              {project.notes && (
                <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">{project.notes}</p>
              )}

              <div className="flex justify-end mt-3">
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </motion.div>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No projects found</p>
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
                <div>
                  <h2 className="text-base font-bold text-gray-900">{selected.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.client}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Stage Badge */}
                <div className="flex items-center gap-2">
                  {(() => { const m = STAGE_META[selected.stage]; const I = m.icon; return (
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${m.bg} ${m.color}`}>
                      <I className="w-4 h-4" /> {m.label}
                    </span>
                  ); })()}
                </div>
                <Row label="Client" value={selected.client} />
                <Row label="Start Date" value={formatDate(selected.start_date)} />
                <Row label="Due Date" value={formatDate(selected.due_date)} />
                <Row label="Team Members" value={selected.members.join(', ') || '—'} />
                {selected.notes && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                      <StickyNote className="w-3.5 h-3.5" /> Notes
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{selected.notes}</p>
                  </div>
                )}
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

export default ProjectsPage;
