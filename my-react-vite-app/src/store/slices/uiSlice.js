import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  theme: 'light',
  loading: false,
  notifications: [],
  modals: {
    addUser: false,
    editUser: false,
    deleteUser: false,
    viewLogs: false,
  },
  currentModal: null,
  message: {
    type: null,
    text: null,
    show: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.currentModal = action.payload;
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      const modalName = action.payload || state.currentModal;
      if (modalName) {
        state.modals[modalName] = false;
        state.currentModal = null;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
      state.currentModal = null;
    },
    showMessage: (state, action) => {
      state.message = {
        type: action.payload.type,
        text: action.payload.text,
        show: true,
      };
    },
    hideMessage: (state) => {
      state.message = {
        type: null,
        text: null,
        show: false,
      };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  showMessage,
  hideMessage,
} = uiSlice.actions;

export default uiSlice.reducer;
