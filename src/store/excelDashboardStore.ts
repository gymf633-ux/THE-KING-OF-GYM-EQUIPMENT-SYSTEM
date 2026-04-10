import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { DashboardSession, KPISummary, TradeRecord } from '../types/tradeData';
import { parseExcelFile } from '../utils/excelParser';
import { computeKPIs } from '../utils/dataProcessor';

const LOCK_KEY = 'excel-dashboard-lock';
const USER_ID_KEY = 'excel-dashboard-user-id';
const LAST_SESSION_KEY = 'excel-dashboard-last-session';
const LOCK_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface LockInfo {
  userId: string;
  lockedAt: number;
}

function getOrCreateUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

function readLock(): LockInfo | null {
  try {
    const raw = localStorage.getItem(LOCK_KEY);
    if (!raw) return null;
    const lock: LockInfo = JSON.parse(raw);
    if (Date.now() - lock.lockedAt > LOCK_TTL_MS) {
      localStorage.removeItem(LOCK_KEY);
      return null;
    }
    return lock;
  } catch {
    return null;
  }
}

function writeLock(userId: string): void {
  localStorage.setItem(LOCK_KEY, JSON.stringify({ userId, lockedAt: Date.now() }));
}

function clearLock(): void {
  localStorage.removeItem(LOCK_KEY);
}

export type UploadPhase = 'idle' | 'uploading' | 'processing' | 'confirmed';

interface StatusInfo {
  fileName: string;
  uploadedAt: string;
  recordCount: number;
  kpi: KPISummary;
}

interface ExcelDashboardState {
  myUserId: string;
  uploadPhase: UploadPhase;
  currentSession: DashboardSession | null;
  lastSessionId: string | null;
  errorMessage: string | null;

  isLockedByOther: () => boolean;
  isLockedByMe: () => boolean;
  getLockInfo: () => LockInfo | null;
  acquireLock: () => boolean;
  releaseLock: () => void;
  processFile: (file: File) => Promise<void>;
  loadSession: (id: string) => DashboardSession | null;
  resetUpload: () => void;
  getStatus: () => StatusInfo | null;
  navigateToDashboard: () => string | null;
}

export const useExcelDashboardStore = create<ExcelDashboardState>()((set, get) => {
  const myUserId = getOrCreateUserId();
  const lastSessionId = localStorage.getItem(LAST_SESSION_KEY);

  return {
    myUserId,
    uploadPhase: 'idle',
    currentSession: null,
    lastSessionId,
    errorMessage: null,

    isLockedByOther: () => {
      const lock = readLock();
      return lock !== null && lock.userId !== get().myUserId;
    },

    isLockedByMe: () => {
      const lock = readLock();
      return lock !== null && lock.userId === get().myUserId;
    },

    getLockInfo: () => readLock(),

    acquireLock: () => {
      const lock = readLock();
      if (lock && lock.userId !== get().myUserId) return false;
      writeLock(get().myUserId);
      return true;
    },

    releaseLock: () => {
      const lock = readLock();
      if (lock && lock.userId === get().myUserId) clearLock();
    },

    processFile: async (file: File) => {
      set({ errorMessage: null, uploadPhase: 'uploading' });

      // Acquire lock
      const acquired = get().acquireLock();
      if (!acquired) {
        set({ errorMessage: 'System is currently in use by another user.', uploadPhase: 'idle' });
        return;
      }

      try {
        // Parse
        await new Promise((r) => setTimeout(r, 400)); // small delay for UX
        set({ uploadPhase: 'processing' });

        const records: TradeRecord[] = await parseExcelFile(file);
        if (records.length === 0) throw new Error('No valid data rows found in the file.');

        const kpi = computeKPIs(records);
        const id = uuidv4();
        const session: DashboardSession = {
          id,
          uploadedAt: new Date().toISOString(),
          fileName: file.name,
          kpi,
          data: records,
        };

        // Persist to localStorage
        localStorage.setItem(`excel-dashboard-${id}`, JSON.stringify(session));
        localStorage.setItem(LAST_SESSION_KEY, id);

        set({ currentSession: session, lastSessionId: id, uploadPhase: 'confirmed' });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error during processing.';
        set({ errorMessage: msg, uploadPhase: 'idle' });
        get().releaseLock();
      }
    },

    loadSession: (id: string) => {
      try {
        const raw = localStorage.getItem(`excel-dashboard-${id}`);
        if (!raw) return null;
        return JSON.parse(raw) as DashboardSession;
      } catch {
        return null;
      }
    },

    resetUpload: () => {
      get().releaseLock();
      set({ uploadPhase: 'idle', currentSession: null, errorMessage: null });
    },

    getStatus: () => {
      const lastId = get().lastSessionId;
      if (!lastId) return null;
      const session = get().loadSession(lastId);
      if (!session) return null;
      return {
        fileName: session.fileName,
        uploadedAt: session.uploadedAt,
        recordCount: session.data.length,
        kpi: session.kpi,
      };
    },

    navigateToDashboard: () => {
      const lastId = get().lastSessionId;
      return lastId ? `/excel-dashboard/${lastId}` : null;
    },
  };
});
