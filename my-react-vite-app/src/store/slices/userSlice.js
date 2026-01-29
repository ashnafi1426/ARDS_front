import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  filteredUsers: [],
  selectedUsers: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    role: 'all',
    status: 'all',
    department: 'all',
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.filteredUsers = action.payload;
      state.loading = false;
    },
    setFilteredUsers: (state, action) => {
      state.filteredUsers = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addUser: (state, action) => {
      state.users.unshift(action.payload);
      state.filteredUsers.unshift(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        const filteredIndex = state.filteredUsers.findIndex(user => user.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredUsers[filteredIndex] = action.payload;
        }
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.filteredUsers = state.filteredUsers.filter(user => user.id !== action.payload);
      state.selectedUsers = state.selectedUsers.filter(id => id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload;
    },
    toggleUserSelection: (state, action) => {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      } else {
        state.selectedUsers.push(userId);
      }
    },
    selectAllUsers: (state) => {
      state.selectedUsers = state.filteredUsers.map(user => user.id);
    },
    clearSelection: (state) => {
      state.selectedUsers = [];
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUsers,
  setFilteredUsers,
  setLoading,
  setError,
  addUser,
  updateUser,
  deleteUser,
  setFilters,
  setSelectedUsers,
  toggleUserSelection,
  selectAllUsers,
  clearSelection,
  setPagination,
  clearError: clearUserError,
} = userSlice.actions;

export default userSlice.reducer;
