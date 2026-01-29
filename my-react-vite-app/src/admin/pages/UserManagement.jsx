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
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userActivityLogs, setUserActivityLogs] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
    department: ''
  });

  // Success message state
  const [successMessage, setSuccessMessage] = useState('');

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
      
      if (!Array.isArray(usersData)) {
        throw new Error('Invalid response format: expected array of users');
      }
      
      // Transform backend data to match frontend format
      const transformedUsers = usersData.map(user => ({
        id: user.id,
        name: user.full_name || user.name || 'N/A',
        email: user.email,
        role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown',
        status: user.is_active !== undefined ? (user.is_active ? 'Active' : 'Inactive') : (user.status || 'Active'),
        createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
        lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
        department: user.department || 'N/A'
      }));
      
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error loading users:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load users';
      setError(errorMessage);
      setUsers([]);
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

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const userData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role.toLowerCase(),
        department: formData.department?.trim() || null
      };
      
      await adminService.createUser(userData);
      
      showSuccess(`User "${userData.full_name}" created successfully!`);
      await loadUsers();
      closeModals();
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create user';
      setError(errorMessage);
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
      
      if (formData.password) {
        userData.password = formData.password;
      }
      
      await adminService.updateUser(selectedUser.id, userData);
      showSuccess(`User "${userData.full_name}" updated successfully!`);
      await loadUsers();
      closeModals();
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
      showSuccess(`User "${selectedUser.name}" deleted successfully!`);
      await loadUsers();
      closeModals();
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
      
      const result = await adminService.resetUserPassword(user.id);
      
      showSuccess(`Password reset successfully for ${user.name}. Temporary password: ${result.tempPassword}`);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      setLoading(true);
      setError(null);
      
      const newStatus = user.status === 'Active' ? false : true;
      await adminService.toggleUserStatus(user.id, newStatus);
      showSuccess(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      await loadUsers();
    } catch (err) {
      console.error('Error toggling user status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewActivityLogs = async (user) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedUser(user);
      
      const response = await adminService.getUserActivityLogs(user.id);
      setUserActivityLogs(response.logs || response.data || response);
      setShowActivityModal(true);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select users first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (bulkAction === 'delete') {
        await adminService.bulkDeleteUsers(selectedUsers);
        showSuccess(`${selectedUsers.length} users deleted successfully`);
      } else if (bulkAction === 'role_student' || bulkAction === 'role_advisor' || bulkAction === 'role_admin') {
        const role = bulkAction.split('_')[1];
        await adminService.bulkUpdateRole(selectedUsers, role);
        showSuccess(`${selectedUsers.length} users updated to ${role} role successfully`);
      }

      await loadUsers();
      setSelectedUsers([]);
      closeModals();
    } catch (err) {
      console.error('Error performing bulk action:', err);
      setError(err.response?.data?.message || err.message || 'Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setError(null);
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (user) => {
    setError(null);
    setSelectedUser(user);
    setFormData({
      full_name: user.name,
      email: user.email,
      password: '',
      role: user.role.toLowerCase(),
      department: user.department || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setError(null);
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowActivityModal(false);
    setShowBulkActionsModal(false);
    setSelectedUser(null);
    setUserActivityLogs([]);
    setBulkAction('');
    resetForm();
    setError(null);
  };

  const closeModalOnOverlayClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction();
    }
  };

  if (loading && users.length === 0) {
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
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {selectedUsers.length > 0 && (
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowBulkActionsModal(true)}
              disabled={loading}
            >
              Bulk Actions ({selectedUsers.length})
            </button>
          )}
          <button 
            className="btn btn-primary" 
            onClick={openCreateModal}
            disabled={loading}
          >
            + Add User
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      
      {successMessage && (
        <div className="success-message" style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '12px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          {successMessage}
        </div>
      )}

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
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAllUsers}
                />
              </th>
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
                <td colSpan="9" className="no-data">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
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
                        Reset
                      </button>
                      <button 
                        className="btn-small"
                        onClick={() => handleToggleUserStatus(user)}
                        title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        disabled={loading}
                        style={{ backgroundColor: user.status === 'Active' ? '#f39c12' : '#27ae60' }}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className="btn-small"
                        onClick={() => handleViewActivityLogs(user)}
                        title="View Activity Logs"
                        disabled={loading}
                        style={{ backgroundColor: '#3498db' }}
                      >
                        Activity
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
        <div className="modal-overlay" onClick={(e) => closeModalOnOverlayClick(e, closeModals)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button 
                className="close-btn" 
                onClick={closeModals}
                type="button"
                disabled={loading}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                {error && (
                  <div className="error-message" style={{ marginBottom: '20px' }}>
                    {error}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="full_name">Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                    disabled={loading}
                    autoFocus
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
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password (minimum 6 characters)"
                    required
                    minLength="6"
                    disabled={loading}
                  />
                  <small className="form-help">Password must be at least 6 characters long</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="role">Role *</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModals} 
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading || !formData.full_name.trim() || !formData.email.trim() || !formData.password.trim()}
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={(e) => closeModalOnOverlayClick(e, closeModals)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={closeModals} disabled={loading}>&times;</button>
            </div>
            <form onSubmit={handleEditUser}>
              <div className="modal-body">
                {error && (
                  <div className="error-message" style={{ marginBottom: '20px' }}>
                    {error}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="edit-full_name">Full Name *</label>
                  <input
                    type="text"
                    id="edit-full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-role">Role *</label>
                  <select
                    id="edit-role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                    disabled={loading}
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
                    disabled={loading}
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
        <div className="modal-overlay" onClick={(e) => closeModalOnOverlayClick(e, closeModals)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={closeModals} disabled={loading}>&times;</button>
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

      {/* Bulk Actions Modal */}
      {showBulkActionsModal && (
        <div className="modal-overlay" onClick={(e) => closeModalOnOverlayClick(e, closeModals)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bulk Actions ({selectedUsers.length} users selected)</h2>
              <button className="close-btn" onClick={closeModals} disabled={loading}>&times;</button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="error-message" style={{ marginBottom: '20px' }}>
                  {error}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="bulk-action">Select Action</label>
                <select
                  id="bulk-action"
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Choose an action...</option>
                  <option value="role_student">Change Role to Student</option>
                  <option value="role_advisor">Change Role to Advisor</option>
                  <option value="role_admin">Change Role to Admin</option>
                  <option value="delete">Delete Users</option>
                </select>
              </div>
              {bulkAction === 'delete' && (
                <div className="warning-text">
                  ⚠️ Warning: This will permanently delete {selectedUsers.length} users. This action cannot be undone.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModals} disabled={loading}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleBulkAction}
                disabled={loading || !bulkAction}
              >
                {loading ? 'Processing...' : 'Apply Action'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs Modal */}
      {showActivityModal && (
        <div className="modal-overlay" onClick={(e) => closeModalOnOverlayClick(e, closeModals)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Activity Logs - {selectedUser?.name}</h2>
              <button className="close-btn" onClick={closeModals} disabled={loading}>&times;</button>
            </div>
            <div className="modal-body">
              {userActivityLogs.length === 0 ? (
                <p className="text-muted">No activity logs found for this user.</p>
              ) : (
                <div className="activity-logs">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userActivityLogs.map((log, index) => (
                        <tr key={index}>
                          <td>{new Date(log.created_at).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${log.action.toLowerCase().replace('_', '-')}`}>
                              {log.action.replace('_', ' ')}
                            </span>
                          </td>
                          <td>{log.details || 'N/A'}</td>
                          <td>{log.ip_address || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModals} disabled={loading}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;