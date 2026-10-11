import { create } from 'zustand';

export interface ModalButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive' | 'primary';
}

export interface ModalOptions {
  title: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  buttons?: ModalButton[];
}

interface ModalStoreState {
  isVisible: boolean;
  options: ModalOptions | null;
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  isVisible: false,
  options: null,
  showModal: (options) => set({ isVisible: true, options }),
  hideModal: () => set({ isVisible: false, options: null }),
}));
