import { create } from 'zustand'

interface AsideState {
  isAsideOpen: boolean
  toggleAside: () => void
}

export const useAsideStore = create<AsideState>(set => ({
  isAsideOpen: true,
  toggleAside: () => set(state => ({ isAsideOpen: !state.isAsideOpen })),
}))

interface DialogState {
  isDialogOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
}

export const useDialogStore = create<DialogState>(set => ({
  isDialogOpen: false,
  setIsDialogOpen: (isOpen: boolean) => set({ isDialogOpen: isOpen }),
}))
