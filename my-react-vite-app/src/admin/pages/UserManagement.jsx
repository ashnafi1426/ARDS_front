import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import * as adminService from '../services/admin.service';
import '../styles/admin-pages.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
    department: ''
  });

  // Load users from backend
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllUsers();
      const usersData = response.users || response.data || response;
      
      // Transform backend data to match frontend format
      const transformedUsers = usersData.map(user => ({
        id: user.id,
        name: user.full_name || user.name || 'N/A',
        email: user.email,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        status: user.status || 'Active',
        createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'
      }));
      
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      role: 'student',
      department: ''
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
        department: formData.department || null
      };
      
      await adminService.createUser(userData);
      await loadUsers(); // Reload users list
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role.toLowerCase(),
        department: formData.department || null
      };
      
      // Only include password if it's provided
      if (formData.password) {
        userData.password = formData.password;
      }
      
      await adminService.updateUser(selectedUser.id, userData);
      await loadUsers(); // Reload users list
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await adminService.deleteUser(selectedUser.id);
      await loadUsers(); // Reload users list
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (user) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminService.resetUserPassword(user.id);
      alert(`Password reset successfully for ${user.name}. New password has been sent to ${user.email}.`);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password
      role: user.role.toLowerCase(),
      department: user.department || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    resetForm();
    setError(null);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>User Management</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add User
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.createdAt}</td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-small"
                        onClick={() => openEditModal(user)}
                        title="Edit User"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-small warning"
                        onClick={() => handleResetPassword(user)}
                        title="Reset Password"
                        disabled={loading}
                      >
                        Reset Password
                      </button>
                      <button 
                        className="btn-small danger"
                        onClick={() => openDeleteModal(user)}
                        title="Delete User"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button className="close-btn" onClick={closeModals}>&times;</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="full_name">Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="role">Role *</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="advisor">Advisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department (optional)"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={closeModals}>&times;</button>
            </div>
            <form onSubmit={handleEditUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="edit-full_name">Full Name *</label>
                  <input
                    type="text"
                    id="edit-full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-email">Email *</label>
                  <input
                    type="email"
                    id="edit-email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-password">New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    id="edit-password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter new password (optional)"
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-role">Role *</label>
                  <select
                    id="edit-role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="advisor">Advisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-department">Department</label>
                  <input
                    type="text"
                    id="edit-department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department (optional)"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={closeModals}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModals} disabled={loading}>
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteUser}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
