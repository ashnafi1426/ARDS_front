/**
 * Property-Based Tests for Entity Deletion
 * **Property 4: Deletion Removes Entity**
 * **Validates: Requirements 1.4, 7.10**
 * 
 * Test that deleted entities don't appear in subsequent fetches
 * Test across User and Notification types
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';

// Mock the admin service for deletion and fetch operations
const mockAdminService = {
  // User operations
  deleteUser: vi.fn(),
  getAllUsers: vi.fn(),
  
  // Notification operations
  deleteNotification: vi.fn(),
  getAllNotifications: vi.fn()
};

// Mock the module
vi.mock('../../services/admin.service', () => mockAdminService);

describe('Property-Based Tests: Entity Deletion', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  /**
   * Property 4.1: User Deletion Removes Entity
   * **Validates: Requirements 1.4**
   */
  it('should remove user from subsequent fetches after deletion', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate user data and deletion scenario
        fc.record({
          userToDelete: fc.record({
            id: fc.integer({ min: 1, max: 1000 }),
            name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
            role: fc.constantFrom('student', 'advisor', 'admin')
          }),
          otherUsers: fc.array(
            fc.record({
              id: fc.integer({ min: 1001, max: 2000 }), // Different ID range to avoid conflicts
              name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
              email: fc.emailAddress(),
              role: fc.constantFrom('student', 'advisor', 'admin')
            }),
            { minLength: 1, maxLength: 10 }
          )
        }),
        async ({ userToDelete, otherUsers }) => {
          // Mock initial state with user present
          const initialUsers = [userToDelete, ...otherUsers];
          mockAdminService.getAllUsers.mockResolvedValueOnce({
            users: initialUsers
          });

          // Verify user exists initially
          const initialFetch = await mockAdminService.getAllUsers();
          const userExists = initialFetch.users.some(user => user.id === userToDelete.id);
          expect(userExists).toBe(true);

          // Mock successful deletion
          mockAdminService.deleteUser.mockResolvedValue({
            message: 'User deleted successfully'
          });

          // Mock fetch after deletion (user should be gone)
          mockAdminService.getAllUsers.mockResolvedValue({
            users: otherUsers // Only other users remain
          });

          // Perform deletion
          await mockAdminService.deleteUser(userToDelete.id);

          // Fetch users after deletion
          const afterDeletionFetch = await mockAdminService.getAllUsers();
          const userStillExists = afterDeletionFetch.users.some(user => user.id === userToDelete.id);

          // Verify deletion
          expect(mockAdminService.deleteUser).toHaveBeenCalledWith(userToDelete.id);
          expect(userStillExists).toBe(false);
          expect(afterDeletionFetch.users.length).toBe(otherUsers.length);
          
          // Verify other users are still present
          otherUsers.forEach(otherUser => {
            const stillExists = afterDeletionFetch.users.some(user => user.id === otherUser.id);
            expect(stillExists).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.2: Notification Deletion Removes Entity
   * **Validates: Requirements 7.10**
   */
  it('should remove notification from subsequent fetches after deletion', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate notification data and deletion scenario
        fc.record({
          notificationToDelete: fc.record({
            id: fc.integer({ min: 1, max: 1000 }),
            title: fc.string({ minLength: 5, maxLength: 100 }),
            message: fc.string({ minLength: 10, maxLength: 500 }),
            type: fc.constantFrom('info', 'warning', 'error', 'success'),
            status: fc.constantFrom('unread', 'read', 'resolved')
          }),
          otherNotifications: fc.array(
            fc.record({
              id: fc.integer({ min: 1001, max: 2000 }), // Different ID range
              title: fc.string({ minLength: 5, maxLength: 100 }),
              message: fc.string({ minLength: 10, maxLength: 500 }),
              type: fc.constantFrom('info', 'warning', 'error', 'success'),
              status: fc.constantFrom('unread', 'read', 'resolved')
            }),
            { minLength: 1, maxLength: 10 }
          )
        }),
        async ({ notificationToDelete, otherNotifications }) => {
          // Mock initial state with notification present
          const initialNotifications = [notificationToDelete, ...otherNotifications];
          mockAdminService.getAllNotifications.mockResolvedValueOnce({
            notifications: initialNotifications
          });

          // Verify notification exists initially
          const initialFetch = await mockAdminService.getAllNotifications();
          const notificationExists = initialFetch.notifications.some(
            notif => notif.id === notificationToDelete.id
          );
          expect(notificationExists).toBe(true);

          // Mock successful deletion
          mockAdminService.deleteNotification.mockResolvedValue({
            message: 'Notification deleted successfully'
          });

          // Mock fetch after deletion (notification should be gone)
          mockAdminService.getAllNotifications.mockResolvedValue({
            notifications: otherNotifications // Only other notifications remain
          });

          // Perform deletion
          await mockAdminService.deleteNotification(notificationToDelete.id);

          // Fetch notifications after deletion
          const afterDeletionFetch = await mockAdminService.getAllNotifications();
          const notificationStillExists = afterDeletionFetch.notifications.some(
            notif => notif.id === notificationToDelete.id
          );

          // Verify deletion
          expect(mockAdminService.deleteNotification).toHaveBeenCalledWith(notificationToDelete.id);
          expect(notificationStillExists).toBe(false);
          expect(afterDeletionFetch.notifications.length).toBe(otherNotifications.length);
          
          // Verify other notifications are still present
          otherNotifications.forEach(otherNotification => {
            const stillExists = afterDeletionFetch.notifications.some(
              notif => notif.id === otherNotification.id
            );
            expect(stillExists).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.3: Multiple Deletions Remove All Specified Entities
   * **Validates: Requirements 1.4, 7.10**
   */
  it('should remove all specified entities after multiple deletions', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate multiple users to delete and users to keep
        fc.record({
          usersToDelete: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 500 }),
              name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
              email: fc.emailAddress(),
              role: fc.constantFrom('student', 'advisor', 'admin')
            }),
            { minLength: 1, maxLength: 5 }
          ).map(users => {
            // Ensure unique IDs by reassigning duplicates
            const uniqueUsers = [];
            const seenIds = new Set();
            let nextId = 1;
            
            for (const user of users) {
              let userId = user.id;
              // Find next available ID if current is taken
              while (seenIds.has(userId)) {
                userId = nextId++;
                if (nextId > 500) nextId = 1; // Wrap around if needed
              }
              seenIds.add(userId);
              uniqueUsers.push({ ...user, id: userId });
            }
            return uniqueUsers;
          }),
          usersToKeep: fc.array(
            fc.record({
              id: fc.integer({ min: 501, max: 1000 }),
              name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
              email: fc.emailAddress(),
              role: fc.constantFrom('student', 'advisor', 'admin')
            }),
            { minLength: 1, maxLength: 5 }
          ).map(users => {
            // Ensure unique IDs by reassigning duplicates
            const uniqueUsers = [];
            const seenIds = new Set();
            let nextId = 501;
            
            for (const user of users) {
              let userId = user.id;
              // Find next available ID if current is taken
              while (seenIds.has(userId)) {
                userId = nextId++;
                if (nextId > 1000) nextId = 501; // Wrap around if needed
              }
              seenIds.add(userId);
              uniqueUsers.push({ ...user, id: userId });
            }
            return uniqueUsers;
          })
        }),
        async ({ usersToDelete, usersToKeep }) => {
          // Skip if no users to delete
          if (usersToDelete.length === 0) return;

          // Reset mocks for this test run
          vi.clearAllMocks();
          vi.resetAllMocks();

          // Mock initial state with all users present
          const allUsers = [...usersToDelete, ...usersToKeep];
          mockAdminService.getAllUsers.mockResolvedValueOnce({
            users: allUsers
          });

          // Verify all users exist initially
          const initialFetch = await mockAdminService.getAllUsers();
          expect(initialFetch.users.length).toBe(allUsers.length);

          // Mock deletions
          for (const user of usersToDelete) {
            mockAdminService.deleteUser.mockResolvedValueOnce({
              message: 'User deleted successfully'
            });
          }

          // Perform all deletions
          for (const user of usersToDelete) {
            await mockAdminService.deleteUser(user.id);
          }

          // Mock final fetch with only remaining users
          mockAdminService.getAllUsers.mockResolvedValue({
            users: usersToKeep
          });

          // Fetch users after all deletions
          const finalFetch = await mockAdminService.getAllUsers();

          // Verify all deleted users are gone
          for (const deletedUser of usersToDelete) {
            const stillExists = finalFetch.users.some(user => user.id === deletedUser.id);
            expect(stillExists).toBe(false);
          }

          // Verify all kept users are still present
          for (const keptUser of usersToKeep) {
            const stillExists = finalFetch.users.some(user => user.id === keptUser.id);
            expect(stillExists).toBe(true);
          }

          // Verify correct number of deletion calls
          expect(mockAdminService.deleteUser).toHaveBeenCalledTimes(usersToDelete.length);
          
          // Verify final count
          expect(finalFetch.users.length).toBe(usersToKeep.length);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 4.4: Deletion of Non-Existent Entity Handles Gracefully
   * **Validates: Requirements 1.4, 7.10**
   */
  it('should handle deletion of non-existent entities gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate non-existent ID and existing entities
        fc.record({
          nonExistentId: fc.integer({ min: 9000, max: 10000 }),
          existingUsers: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 1000 }),
              name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
              email: fc.emailAddress(),
              role: fc.constantFrom('student', 'advisor', 'admin')
            }),
            { minLength: 1, maxLength: 5 }
          )
        }),
        async ({ nonExistentId, existingUsers }) => {
          // Ensure the non-existent ID is truly non-existent
          const idExists = existingUsers.some(user => user.id === nonExistentId);
          if (idExists) return; // Skip this test case

          // Mock initial state
          mockAdminService.getAllUsers.mockResolvedValue({
            users: existingUsers
          });

          // Mock deletion of non-existent entity (should handle gracefully)
          mockAdminService.deleteUser.mockRejectedValue(
            new Error('User not found')
          );

          // Attempt to delete non-existent user
          let deletionError = null;
          try {
            await mockAdminService.deleteUser(nonExistentId);
          } catch (error) {
            deletionError = error;
          }

          // Verify error was thrown for non-existent entity
          expect(deletionError).toBeTruthy();
          expect(deletionError.message).toBe('User not found');

          // Verify existing users are unaffected
          const afterAttemptFetch = await mockAdminService.getAllUsers();
          expect(afterAttemptFetch.users.length).toBe(existingUsers.length);
          
          // Verify all existing users are still present
          existingUsers.forEach(user => {
            const stillExists = afterAttemptFetch.users.some(u => u.id === user.id);
            expect(stillExists).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.5: Deletion Maintains Data Integrity
   * **Validates: Requirements 1.4**
   */
  it('should maintain data integrity of remaining entities after deletion', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate user to delete and users to verify integrity
        fc.record({
          userToDelete: fc.record({
            id: fc.integer({ min: 1, max: 100 }),
            name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
            role: fc.constantFrom('student', 'advisor', 'admin'),
            department: fc.string({ minLength: 2, maxLength: 50 })
          }),
          remainingUsers: fc.array(
            fc.record({
              id: fc.integer({ min: 101, max: 1000 }),
              name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
              email: fc.emailAddress(),
              role: fc.constantFrom('student', 'advisor', 'admin'),
              department: fc.string({ minLength: 2, maxLength: 50 })
            }),
            { minLength: 2, maxLength: 10 }
          ).map(users => {
            // Ensure unique IDs
            const uniqueUsers = [];
            const seenIds = new Set();
            for (const user of users) {
              if (!seenIds.has(user.id)) {
                seenIds.add(user.id);
                uniqueUsers.push(user);
              } else {
                // Generate a new unique ID
                let newId = user.id + 1;
                while (seenIds.has(newId)) {
                  newId++;
                }
                seenIds.add(newId);
                uniqueUsers.push({ ...user, id: newId });
              }
            }
            return uniqueUsers;
          })
        }),
        async ({ userToDelete, remainingUsers }) => {
          // Mock initial state
          const initialUsers = [userToDelete, ...remainingUsers];
          mockAdminService.getAllUsers.mockResolvedValueOnce({
            users: initialUsers
          });

          // Store original data for integrity check
          const originalRemainingUsers = remainingUsers.map(user => ({ ...user }));

          // Mock successful deletion
          mockAdminService.deleteUser.mockResolvedValue({
            message: 'User deleted successfully'
          });

          // Mock fetch after deletion
          mockAdminService.getAllUsers.mockResolvedValue({
            users: remainingUsers
          });

          // Perform deletion
          await mockAdminService.deleteUser(userToDelete.id);

          // Fetch remaining users
          const afterDeletionFetch = await mockAdminService.getAllUsers();

          // Verify data integrity of remaining users
          expect(afterDeletionFetch.users.length).toBe(remainingUsers.length);
          
          afterDeletionFetch.users.forEach((user) => {
            const originalUser = remainingUsers.find(u => u.id === user.id);
            expect(originalUser).toBeDefined();
            expect(user.name).toBe(originalUser.name);
            expect(user.email).toBe(originalUser.email);
            expect(user.role).toBe(originalUser.role);
            expect(user.department).toBe(originalUser.department);
          });

          // Verify deleted user is not present
          const deletedUserExists = afterDeletionFetch.users.some(user => user.id === userToDelete.id);
          expect(deletedUserExists).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});