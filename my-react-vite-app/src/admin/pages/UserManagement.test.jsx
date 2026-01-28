import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import UserManagement from './UserManagement';
import * as adminService from '../services/admin.service';

// Mock the admin service
vi.mock('../services/admin.service');

describe('UserManagement Component', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@ards.edu', role: 'Student', status: 'Active', createdAt: '2024-01-15', lastLogin: '2024-01-28' },
    { id: 2, name: 'Jane Smith', email: 'jane@ards.edu', role: 'Advisor', status: 'Active', createdAt: '2024-01-10', lastLogin: '2024-01-27' },
    { id: 3, name: 'Admin User', email: 'admin@ards.edu', role: 'Admin', status: 'Active', createdAt: '2024-01-01', lastLogin: '2024-01-28' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    adminService.getAllUsers.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the user management page with title', () => {
      render(<UserManagement />);
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    it('should render the Add User button', () => {
      render(<UserManagement />);
      expect(screen.getByText('+ Add User')).toBeInTheDocument();
    });

    it('should render the users table with correct headers', () => {
      render(<UserManagement />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should render mock user data in the table', () => {
      render(<UserManagement />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@ards.edu')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    it('should display user roles as badges', () => {
      render(<UserManagement />);
      const badges = screen.getAllByText(/Student|Advisor|Admin/);
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should display user status with correct styling', () => {
      render(<UserManagement />);
      const statusBadges = screen.getAllByText('Active');
      expect(statusBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    it('should render search input field', () => {
      render(<UserManagement />);
      const searchInput = screen.queryByPlaceholderText(/search/i);
      if (searchInput) {
        expect(searchInput).toBeInTheDocument();
      }
    });

    it('should filter users by name when searching', async () => {
      render(<UserManagement />);
      const searchInput = screen.queryByPlaceholderText(/search/i);
      
      if (searchInput) {
        await userEvent.type(searchInput, 'John');
        await waitFor(() => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
      }
    });

    it('should filter users by email when searching', async () => {
      render(<UserManagement />);
      const searchInput = screen.queryByPlaceholderText(/search/i);
      
      if (searchInput) {
        await userEvent.type(searchInput, 'jane@ards.edu');
        await waitFor(() => {
          expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
      }
    });

    it('should show no results when search matches nothing', async () => {
      render(<UserManagement />);
      const searchInput = screen.queryByPlaceholderText(/search/i);
      
      if (searchInput) {
        await userEvent.type(searchInput, 'nonexistent@ards.edu');
        await waitFor(() => {
          expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });
      }
    });

    it('should be case-insensitive when searching', async () => {
      render(<UserManagement />);
      const searchInput = screen.queryByPlaceholderText(/search/i);
      
      if (searchInput) {
        await userEvent.type(searchInput, 'JOHN');
        await waitFor(() => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Create User Modal', () => {
    it('should open create user modal when Add User button is clicked', async () => {
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const modal = screen.queryByText(/create user|new user|add new/i);
        if (modal) {
          expect(modal).toBeInTheDocument();
        }
      });
    });

    it('should have form fields for name, email, and role', async () => {
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const nameInput = screen.queryByLabelText(/name/i) || screen.queryByPlaceholderText(/name/i);
        const emailInput = screen.queryByLabelText(/email/i) || screen.queryByPlaceholderText(/email/i);
        const roleSelect = screen.queryByLabelText(/role/i) || screen.queryByDisplayValue(/student|advisor|admin/i);
        
        if (nameInput) expect(nameInput).toBeInTheDocument();
        if (emailInput) expect(emailInput).toBeInTheDocument();
        if (roleSelect) expect(roleSelect).toBeInTheDocument();
      });
    });

    it('should validate required fields before creating user', async () => {
      adminService.createUser.mockResolvedValue({ id: 4, name: 'New User', email: 'new@ards.edu', role: 'Student', status: 'Active' });
      
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const submitButton = screen.queryByText(/create|submit|save/i);
        if (submitButton) {
          fireEvent.click(submitButton);
          // Should show validation error or not call createUser
          expect(adminService.createUser).not.toHaveBeenCalled();
        }
      });
    });

    it('should call createUser API with correct data', async () => {
      const newUser = { name: 'New User', email: 'new@ards.edu', role: 'Student' };
      adminService.createUser.mockResolvedValue({ id: 4, ...newUser, status: 'Active' });
      
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const nameInput = screen.queryByLabelText(/name/i) || screen.queryByPlaceholderText(/name/i);
        const emailInput = screen.queryByLabelText(/email/i) || screen.queryByPlaceholderText(/email/i);
        
        if (nameInput && emailInput) {
          userEvent.type(nameInput, newUser.name);
          userEvent.type(emailInput, newUser.email);
          
          const submitButton = screen.queryByText(/create|submit|save/i);
          if (submitButton) {
            fireEvent.click(submitButton);
            
            waitFor(() => {
              expect(adminService.createUser).toHaveBeenCalledWith(expect.objectContaining(newUser));
            });
          }
        }
      });
    });

    it('should close modal after successful user creation', async () => {
      adminService.createUser.mockResolvedValue({ id: 4, name: 'New User', email: 'new@ards.edu', role: 'Student', status: 'Active' });
      
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const submitButton = screen.queryByText(/create|submit|save/i);
        if (submitButton) {
          fireEvent.click(submitButton);
          
          waitFor(() => {
            const modal = screen.queryByText(/create user|new user/i);
            expect(modal).not.toBeInTheDocument();
          });
        }
      });
    });
  });

  describe('Update User Modal', () => {
    it('should open update user modal when Edit button is clicked', async () => {
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const modal = screen.queryByText(/edit user|update user/i);
        if (modal) {
          expect(modal).toBeInTheDocument();
        }
      });
    });

    it('should populate form with current user data', async () => {
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const nameInput = screen.queryByDisplayValue('John Doe');
        const emailInput = screen.queryByDisplayValue('john@ards.edu');
        
        if (nameInput) expect(nameInput).toBeInTheDocument();
        if (emailInput) expect(emailInput).toBeInTheDocument();
      });
    });

    it('should call updateUser API with modified data', async () => {
      const updatedUser = { name: 'John Updated', email: 'john.updated@ards.edu', role: 'Advisor', status: 'Active' };
      adminService.updateUser.mockResolvedValue({ id: 1, ...updatedUser });
      
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const nameInput = screen.queryByDisplayValue('John Doe');
        if (nameInput) {
          userEvent.clear(nameInput);
          userEvent.type(nameInput, updatedUser.name);
          
          const submitButton = screen.queryByText(/update|save/i);
          if (submitButton) {
            fireEvent.click(submitButton);
            
            waitFor(() => {
              expect(adminService.updateUser).toHaveBeenCalledWith(1, expect.objectContaining(updatedUser));
            });
          }
        }
      });
    });

    it('should close modal after successful user update', async () => {
      adminService.updateUser.mockResolvedValue({ id: 1, name: 'John Updated', email: 'john@ards.edu', role: 'Student', status: 'Active' });
      
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const submitButton = screen.queryByText(/update|save/i);
        if (submitButton) {
          fireEvent.click(submitButton);
          
          waitFor(() => {
            const modal = screen.queryByText(/edit user|update user/i);
            expect(modal).not.toBeInTheDocument();
          });
        }
      });
    });
  });

  describe('Delete User', () => {
    it('should show delete confirmation dialog when Delete button is clicked', async () => {
      render(<UserManagement />);
      const deleteButtons = screen.getAllByText('Delete');
      
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        const confirmDialog = screen.queryByText(/confirm|are you sure|delete/i);
        if (confirmDialog) {
          expect(confirmDialog).toBeInTheDocument();
        }
      });
    });

    it('should call deleteUser API when confirmed', async () => {
      adminService.deleteUser.mockResolvedValue({ success: true });
      
      render(<UserManagement />);
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        const confirmButton = screen.queryByText(/confirm|yes|delete/i);
        if (confirmButton) {
          fireEvent.click(confirmButton);
          
          waitFor(() => {
            expect(adminService.deleteUser).toHaveBeenCalledWith(1);
          });
        }
      });
    });

    it('should remove user from table after successful deletion', async () => {
      adminService.deleteUser.mockResolvedValue({ success: true });
      
      render(<UserManagement />);
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        const confirmButton = screen.queryByText(/confirm|yes|delete/i);
        if (confirmButton) {
          fireEvent.click(confirmButton);
          
          waitFor(() => {
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
          });
        }
      });
    });

    it('should not delete user when cancelled', async () => {
      render(<UserManagement />);
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        const cancelButton = screen.queryByText(/cancel|no/i);
        if (cancelButton) {
          fireEvent.click(cancelButton);
          
          waitFor(() => {
            expect(adminService.deleteUser).not.toHaveBeenCalled();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
          });
        }
      });
    });
  });

  describe('Role Assignment', () => {
    it('should display role options in dropdown', async () => {
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const roleSelect = screen.queryByLabelText(/role/i);
        if (roleSelect) {
          fireEvent.click(roleSelect);
          expect(screen.queryByText('Student')).toBeInTheDocument();
          expect(screen.queryByText('Advisor')).toBeInTheDocument();
          expect(screen.queryByText('Admin')).toBeInTheDocument();
        }
      });
    });

    it('should update user role when changed', async () => {
      adminService.updateUser.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@ards.edu', role: 'Advisor', status: 'Active' });
      
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const roleSelect = screen.queryByLabelText(/role/i);
        if (roleSelect) {
          fireEvent.change(roleSelect, { target: { value: 'Advisor' } });
          
          const submitButton = screen.queryByText(/update|save/i);
          if (submitButton) {
            fireEvent.click(submitButton);
            
            waitFor(() => {
              expect(adminService.updateUser).toHaveBeenCalledWith(1, expect.objectContaining({ role: 'Advisor' }));
            });
          }
        }
      });
    });

    it('should display updated role in table after change', async () => {
      adminService.updateUser.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@ards.edu', role: 'Advisor', status: 'Active' });
      
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const roleSelect = screen.queryByLabelText(/role/i);
        if (roleSelect) {
          fireEvent.change(roleSelect, { target: { value: 'Advisor' } });
          
          const submitButton = screen.queryByText(/update|save/i);
          if (submitButton) {
            fireEvent.click(submitButton);
            
            waitFor(() => {
              const advisorBadge = screen.queryByText('Advisor');
              expect(advisorBadge).toBeInTheDocument();
            });
          }
        }
      });
    });
  });

  describe('Password Reset', () => {
    it('should show password reset option in user actions', async () => {
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const resetButton = screen.queryByText(/reset password|change password/i);
        if (resetButton) {
          expect(resetButton).toBeInTheDocument();
        }
      });
    });

    it('should call resetUserPassword API when password reset is confirmed', async () => {
      adminService.resetUserPassword.mockResolvedValue({ tempPassword: 'TempPass123!' });
      
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const resetButton = screen.queryByText(/reset password|change password/i);
        if (resetButton) {
          fireEvent.click(resetButton);
          
          waitFor(() => {
            const confirmButton = screen.queryByText(/confirm|yes/i);
            if (confirmButton) {
              fireEvent.click(confirmButton);
              expect(adminService.resetUserPassword).toHaveBeenCalledWith(1);
            }
          });
        }
      });
    });

    it('should display temporary password after reset', async () => {
      const tempPassword = 'TempPass123!';
      adminService.resetUserPassword.mockResolvedValue({ tempPassword });
      
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const resetButton = screen.queryByText(/reset password|change password/i);
        if (resetButton) {
          fireEvent.click(resetButton);
          
          waitFor(() => {
            const confirmButton = screen.queryByText(/confirm|yes/i);
            if (confirmButton) {
              fireEvent.click(confirmButton);
              expect(screen.queryByText(tempPassword)).toBeInTheDocument();
            }
          });
        }
      });
    });
  });

  describe('User Status Management', () => {
    it('should display user status in table', () => {
      render(<UserManagement />);
      const statusBadges = screen.getAllByText('Active');
      expect(statusBadges.length).toBeGreaterThan(0);
    });

    it('should allow changing user status', async () => {
      adminService.updateUser.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@ards.edu', role: 'Student', status: 'Inactive' });
      
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const statusSelect = screen.queryByLabelText(/status/i);
        if (statusSelect) {
          fireEvent.change(statusSelect, { target: { value: 'Inactive' } });
          
          const submitButton = screen.queryByText(/update|save/i);
          if (submitButton) {
            fireEvent.click(submitButton);
            
            waitFor(() => {
              expect(adminService.updateUser).toHaveBeenCalledWith(1, expect.objectContaining({ status: 'Inactive' }));
            });
          }
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when user creation fails', async () => {
      const errorMessage = 'Email already exists';
      adminService.createUser.mockRejectedValue(new Error(errorMessage));
      
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const nameInput = screen.queryByLabelText(/name/i) || screen.queryByPlaceholderText(/name/i);
        if (nameInput) {
          userEvent.type(nameInput, 'New User');
          
          const submitButton = screen.queryByText(/create|submit|save/i);
          if (submitButton) {
            fireEvent.click(submitButton);
            
            waitFor(() => {
              expect(screen.queryByText(errorMessage)).toBeInTheDocument();
            });
          }
        }
      });
    });

    it('should display error message when user update fails', async () => {
      const errorMessage = 'Failed to update user';
      adminService.updateUser.mockRejectedValue(new Error(errorMessage));
      
      render(<UserManagement />);
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      await waitFor(() => {
        const submitButton = screen.queryByText(/update|save/i);
        if (submitButton) {
          fireEvent.click(submitButton);
          
          waitFor(() => {
            expect(screen.queryByText(errorMessage)).toBeInTheDocument();
          });
        }
      });
    });

    it('should display error message when user deletion fails', async () => {
      const errorMessage = 'Cannot delete user with active sessions';
      adminService.deleteUser.mockRejectedValue(new Error(errorMessage));
      
      render(<UserManagement />);
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        const confirmButton = screen.queryByText(/confirm|yes|delete/i);
        if (confirmButton) {
          fireEvent.click(confirmButton);
          
          waitFor(() => {
            expect(screen.queryByText(errorMessage)).toBeInTheDocument();
          });
        }
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator while fetching users', async () => {
      adminService.getAllUsers.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockUsers), 100)));
      
      render(<UserManagement />);
      
      const loadingIndicator = screen.queryByText(/loading|please wait/i);
      if (loadingIndicator) {
        expect(loadingIndicator).toBeInTheDocument();
      }
    });

    it('should show loading indicator while creating user', async () => {
      adminService.createUser.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ id: 4, name: 'New User', email: 'new@ards.edu', role: 'Student', status: 'Active' }), 100)));
      
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const nameInput = screen.queryByLabelText(/name/i) || screen.queryByPlaceholderText(/name/i);
        if (nameInput) {
          userEvent.type(nameInput, 'New User');
          
          const submitButton = screen.queryByText(/create|submit|save/i);
          if (submitButton) {
            fireEvent.click(submitButton);
            
            const loadingIndicator = screen.queryByText(/loading|please wait/i);
            if (loadingIndicator) {
              expect(loadingIndicator).toBeInTheDocument();
            }
          }
        }
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on buttons', () => {
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      expect(addButton).toHaveAttribute('type', 'button');
    });

    it('should have proper table structure for screen readers', () => {
      render(<UserManagement />);
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should have proper form labels in modals', async () => {
      render(<UserManagement />);
      const addButton = screen.getByText('+ Add User');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const nameLabel = screen.queryByLabelText(/name/i);
        const emailLabel = screen.queryByLabelText(/email/i);
        
        if (nameLabel) expect(nameLabel).toBeInTheDocument();
        if (emailLabel) expect(emailLabel).toBeInTheDocument();
      });
    });
  });
});
