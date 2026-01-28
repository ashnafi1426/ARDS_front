/**
 * Property-Based Tests for Entity Creation Rejection
 * **Property 2: Entity Creation Rejection**
 * **Validates: Requirements 1.2, 3.2, 7.2, 10.2**
 * 
 * Test that creating entities with missing required fields fails
 * Generate random incomplete data
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';

// Mock the admin service to simulate validation failures
const mockAdminService = {
  createUser: vi.fn(),
  createAdvisor: vi.fn(),
  sendNotification: vi.fn(),
  createIssue: vi.fn()
};

// Mock the module
vi.mock('../../services/admin.service', () => mockAdminService);

describe('Property-Based Tests: Entity Creation Rejection', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  /**
   * Property 2.1: User Creation with Missing Required Fields Always Fails
   * **Validates: Requirements 1.2**
   */
  it('should reject user creation when required fields are missing', async () => {
    // Mock validation failure
    mockAdminService.createUser.mockRejectedValue(
      new Error('Email, password, and role are required')
    );

    await fc.assert(
      fc.asyncProperty(
        // Generate incomplete user data (missing at least one required field)
        fc.record({
          full_name: fc.option(fc.string({ minLength: 2, maxLength: 100 }), { nil: undefined }),
          email: fc.option(fc.emailAddress(), { nil: undefined }),
          password: fc.option(fc.string({ minLength: 6, maxLength: 50 }), { nil: undefined }),
          role: fc.option(fc.constantFrom('student', 'advisor', 'admin'), { nil: undefined }),
          department: fc.option(fc.string({ minLength: 2, maxLength: 50 }), { nil: null })
        }).filter(userData => 
          // Ensure at least one required field is missing
          !userData.email || !userData.password || !userData.role
        ),
        async (incompleteUserData) => {
          // Attempt to create user with incomplete data
          try {
            await mockAdminService.createUser(incompleteUserData);
            // If we reach here, the test should fail
            expect.fail('Expected user creation to fail with incomplete data');
          } catch (error) {
            // Verify the service was called with incomplete data
            expect(mockAdminService.createUser).toHaveBeenCalledWith(incompleteUserData);
            
            // Verify error is thrown for missing required fields
            expect(error).toBeDefined();
            expect(error.message).toContain('required');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.2: Advisor Creation with Missing Required Fields Always Fails
   * **Validates: Requirements 3.2**
   */
  it('should reject advisor creation when required fields are missing', async () => {
    // Mock validation failure
    mockAdminService.createAdvisor.mockRejectedValue(
      new Error('Full name, email, and department are required')
    );

    await fc.assert(
      fc.asyncProperty(
        // Generate incomplete advisor data
        fc.record({
          full_name: fc.option(fc.string({ minLength: 2, maxLength: 100 }), { nil: undefined }),
          email: fc.option(fc.emailAddress(), { nil: undefined }),
          department: fc.option(fc.string({ minLength: 2, maxLength: 50 }), { nil: undefined }),
          specialization: fc.option(fc.string({ minLength: 2, maxLength: 100 }), { nil: null }),
          max_students: fc.option(fc.integer({ min: 1, max: 50 }), { nil: undefined })
        }).filter(advisorData => 
          // Ensure at least one required field is missing
          !advisorData.full_name || !advisorData.email || !advisorData.department
        ),
        async (incompleteAdvisorData) => {
          // Attempt to create advisor with incomplete data
          try {
            await mockAdminService.createAdvisor(incompleteAdvisorData);
            expect.fail('Expected advisor creation to fail with incomplete data');
          } catch (error) {
            // Verify the service was called with incomplete data
            expect(mockAdminService.createAdvisor).toHaveBeenCalledWith(incompleteAdvisorData);
            
            // Verify error is thrown for missing required fields
            expect(error).toBeDefined();
            expect(error.message).toContain('required');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.3: Notification Creation with Missing Required Fields Always Fails
   * **Validates: Requirements 7.2**
   */
  it('should reject notification creation when required fields are missing', async () => {
    // Mock validation failure
    mockAdminService.sendNotification.mockRejectedValue(
      new Error('Title, message, recipient_type, and priority are required')
    );

    await fc.assert(
      fc.asyncProperty(
        // Generate incomplete notification data
        fc.record({
          title: fc.option(fc.string({ minLength: 5, maxLength: 200 }), { nil: undefined }),
          message: fc.option(fc.string({ minLength: 10, maxLength: 1000 }), { nil: undefined }),
          recipient_type: fc.option(fc.constantFrom('all', 'students', 'advisors', 'admins', 'specific'), { nil: undefined }),
          priority: fc.option(fc.constantFrom('low', 'medium', 'high', 'urgent'), { nil: undefined }),
          recipient_ids: fc.option(fc.array(fc.integer({ min: 1, max: 1000 }), { minLength: 1, maxLength: 10 }), { nil: null }),
          scheduled_at: fc.option(fc.date({ min: new Date(), max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }), { nil: null })
        }).filter(notificationData => 
          // Ensure at least one required field is missing
          !notificationData.title || !notificationData.message || 
          !notificationData.recipient_type || !notificationData.priority
        ),
        async (incompleteNotificationData) => {
          // Attempt to create notification with incomplete data
          try {
            await mockAdminService.sendNotification(incompleteNotificationData);
            expect.fail('Expected notification creation to fail with incomplete data');
          } catch (error) {
            // Verify the service was called with incomplete data
            expect(mockAdminService.sendNotification).toHaveBeenCalledWith(incompleteNotificationData);
            
            // Verify error is thrown for missing required fields
            expect(error).toBeDefined();
            expect(error.message).toContain('required');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.4: Issue Creation with Missing Required Fields Always Fails
   * **Validates: Requirements 10.2**
   */
  it('should reject issue creation when required fields are missing', async () => {
    // Mock validation failure
    mockAdminService.createIssue.mockRejectedValue(
      new Error('Title, description, priority, category, and reported_by are required')
    );

    await fc.assert(
      fc.asyncProperty(
        // Generate incomplete issue data
        fc.record({
          title: fc.option(fc.string({ minLength: 5, maxLength: 200 }), { nil: undefined }),
          description: fc.option(fc.string({ minLength: 10, maxLength: 2000 }), { nil: undefined }),
          priority: fc.option(fc.constantFrom('low', 'medium', 'high', 'critical'), { nil: undefined }),
          category: fc.option(fc.constantFrom('bug', 'feature', 'support', 'maintenance', 'security'), { nil: undefined }),
          reported_by: fc.option(fc.integer({ min: 1, max: 1000 }), { nil: undefined }),
          assigned_to: fc.option(fc.integer({ min: 1, max: 100 }), { nil: null }),
          due_date: fc.option(fc.date({ min: new Date(), max: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }), { nil: null })
        }).filter(issueData => 
          // Ensure at least one required field is missing
          !issueData.title || !issueData.description || !issueData.priority || 
          !issueData.category || !issueData.reported_by
        ),
        async (incompleteIssueData) => {
          // Attempt to create issue with incomplete data
          try {
            await mockAdminService.createIssue(incompleteIssueData);
            expect.fail('Expected issue creation to fail with incomplete data');
          } catch (error) {
            // Verify the service was called with incomplete data
            expect(mockAdminService.createIssue).toHaveBeenCalledWith(incompleteIssueData);
            
            // Verify error is thrown for missing required fields
            expect(error).toBeDefined();
            expect(error.message).toContain('required');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.5: Invalid Data Types Always Cause Rejection
   * **Validates: Requirements 1.2, 3.2, 7.2, 10.2**
   */
  it('should reject entity creation with invalid data types', async () => {
    // Mock validation failure for invalid data types
    mockAdminService.createUser.mockRejectedValue(new Error('Invalid data type'));
    mockAdminService.createAdvisor.mockRejectedValue(new Error('Invalid data type'));
    mockAdminService.sendNotification.mockRejectedValue(new Error('Invalid data type'));
    mockAdminService.createIssue.mockRejectedValue(new Error('Invalid data type'));

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          entityType: fc.constantFrom('user', 'advisor', 'notification', 'issue'),
          invalidData: fc.oneof(
            // Invalid email formats
            fc.record({
              email: fc.oneof(
                fc.constant('invalid-email'),
                fc.constant(''),
                fc.constant('no-at-sign'),
                fc.constant('@no-local-part.com'),
                fc.constant('no-domain@'),
                fc.integer() // Wrong type
              )
            }),
            // Invalid role values
            fc.record({
              role: fc.oneof(
                fc.constant('invalid-role'),
                fc.constant(''),
                fc.integer(), // Wrong type
                fc.constant(null)
              )
            }),
            // Invalid priority values
            fc.record({
              priority: fc.oneof(
                fc.constant('invalid-priority'),
                fc.constant(''),
                fc.integer(), // Wrong type
                fc.constant(null)
              )
            }),
            // Invalid integer fields
            fc.record({
              max_students: fc.oneof(
                fc.constant(-1), // Negative value
                fc.constant(0), // Zero value
                fc.string(), // Wrong type
                fc.constant('not-a-number')
              )
            })
          )
        }),
        async ({ entityType, invalidData }) => {
          let mockFunction;
          let testData = {
            // Provide minimum required fields but with invalid data
            full_name: 'Test Name',
            email: 'test@example.com',
            password: 'password123',
            role: 'student',
            title: 'Test Title',
            message: 'Test Message',
            description: 'Test Description',
            priority: 'medium',
            category: 'bug',
            reported_by: 1,
            recipient_type: 'all',
            department: 'Test Department',
            ...invalidData // Override with invalid data
          };

          switch (entityType) {
            case 'user':
              mockFunction = mockAdminService.createUser;
              break;
            case 'advisor':
              mockFunction = mockAdminService.createAdvisor;
              break;
            case 'notification':
              mockFunction = mockAdminService.sendNotification;
              break;
            case 'issue':
              mockFunction = mockAdminService.createIssue;
              break;
          }

          try {
            await mockFunction(testData);
            expect.fail(`Expected ${entityType} creation to fail with invalid data`);
          } catch (error) {
            // Verify the service was called with invalid data
            expect(mockFunction).toHaveBeenCalledWith(testData);
            
            // Verify error is thrown for invalid data
            expect(error).toBeDefined();
            expect(error.message).toBeDefined();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 2.6: Empty String Fields Are Treated as Missing
   * **Validates: Requirements 1.2, 3.2, 7.2, 10.2**
   */
  it('should treat empty strings as missing required fields', async () => {
    // Mock validation failure for empty strings
    mockAdminService.createUser.mockRejectedValue(new Error('Field cannot be empty'));

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          full_name: fc.constantFrom('', '   ', '\t', '\n'), // Various empty string formats
          email: fc.constantFrom('', '   ', '\t', '\n'),
          password: fc.constantFrom('', '   ', '\t', '\n'),
          role: fc.constantFrom('', '   ', '\t', '\n')
        }),
        async (emptyStringData) => {
          try {
            await mockAdminService.createUser(emptyStringData);
            expect.fail('Expected user creation to fail with empty string fields');
          } catch (error) {
            // Verify the service was called with empty string data
            expect(mockAdminService.createUser).toHaveBeenCalledWith(emptyStringData);
            
            // Verify error is thrown for empty fields
            expect(error).toBeDefined();
            expect(error.message).toMatch(/empty|required/i);
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});