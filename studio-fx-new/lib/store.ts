import { create } from 'zustand';

interface AppState {
  scrollY: number;
  scrollVelocity: number;
  mouseX: number;
  mouseY: number;
  setScroll: (y: number, v: number) => void;
  setMouse: (x: number, y: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  scrollY: 0,
  scrollVelocity: 0,
  mouseX: 0,
  mouseY: 0,
  setScroll: (y, v) => set({ scrollY: y, scrollVelocity: v }),
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
}));
