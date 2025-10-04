import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Persist dashboard type in localStorage
export const dashboardTypeAtom = atomWithStorage('dashboardType', null);

// Dashboard state atoms
export const taskUpdatesAtom = atom([]);
export const notificationsAtom = atom([]);
export const dashboardDataAtom = atom({
  tasks: [],
  stats: {},
  activities: []
});

// Dashboard filters and settings
export const dashboardFiltersAtom = atomWithStorage('dashboardFilters', {
  dateRange: '7d',
  taskStatus: 'all',
  showCompleted: true
});

// Real-time updates tracking
export const lastUpdateAtom = atom(null);
export const updateQueueAtom = atom([]);