/**
 * Roles & Permissions Service
 * Manages user roles and their permissions across the application
 */

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  SALES = 'sales',
  SUPPORT = 'support',
  VIEWER = 'viewer',
}

export enum Permission {
  // Dashboard & Reports
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_REPORTS = 'view_reports',
  
  // Leads Management
  VIEW_LEADS = 'view_leads',
  CREATE_LEADS = 'create_leads',
  EDIT_LEADS = 'edit_leads',
  DELETE_LEADS = 'delete_leads',
  
  // WhatsApp
  VIEW_WHATSAPP = 'view_whatsapp',
  SEND_WHATSAPP = 'send_whatsapp',
  CONFIGURE_WHATSAPP = 'configure_whatsapp',
  
  // Sales & Invoices
  VIEW_SALES = 'view_sales',
  CREATE_SALES = 'create_sales',
  EDIT_SALES = 'edit_sales',
  DELETE_SALES = 'delete_sales',
  CREATE_INVOICES = 'create_invoices',
  
  // Reviews & GBP
  VIEW_REVIEWS = 'view_reviews',
  MANAGE_REVIEWS = 'manage_reviews',
  VIEW_GBP = 'view_gbp',
  MANAGE_GBP = 'manage_gbp',
  
  // Projects
  VIEW_PROJECTS = 'view_projects',
  MANAGE_PROJECTS = 'manage_projects',
  
  // Reminders
  VIEW_REMINDERS = 'view_reminders',
  MANAGE_REMINDERS = 'manage_reminders',
  
  // Campaigns
  VIEW_CAMPAIGNS = 'view_campaigns',
  MANAGE_CAMPAIGNS = 'manage_campaigns',
  
  // Staff & Settings
  VIEW_STAFF = 'view_staff',
  MANAGE_STAFF = 'manage_staff',
  VIEW_SETTINGS = 'view_settings',
  MANAGE_SETTINGS = 'manage_settings',
  
  // Billing (Owner/Admin only - Admin excludes keys)
  VIEW_BILLING = 'view_billing',
  MANAGE_BILLING = 'manage_billing',
  MANAGE_BILLING_KEYS = 'manage_billing_keys',
}

/**
 * Permission Matrix
 * Defines which permissions each role has
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.OWNER]: [
    // Owner has all permissions
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_REPORTS,
    Permission.VIEW_LEADS,
    Permission.CREATE_LEADS,
    Permission.EDIT_LEADS,
    Permission.DELETE_LEADS,
    Permission.VIEW_WHATSAPP,
    Permission.SEND_WHATSAPP,
    Permission.CONFIGURE_WHATSAPP,
    Permission.VIEW_SALES,
    Permission.CREATE_SALES,
    Permission.EDIT_SALES,
    Permission.DELETE_SALES,
    Permission.CREATE_INVOICES,
    Permission.VIEW_REVIEWS,
    Permission.MANAGE_REVIEWS,
    Permission.VIEW_GBP,
    Permission.MANAGE_GBP,
    Permission.VIEW_PROJECTS,
    Permission.MANAGE_PROJECTS,
    Permission.VIEW_REMINDERS,
    Permission.MANAGE_REMINDERS,
    Permission.VIEW_CAMPAIGNS,
    Permission.MANAGE_CAMPAIGNS,
    Permission.VIEW_STAFF,
    Permission.MANAGE_STAFF,
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_BILLING,
    Permission.MANAGE_BILLING,
    Permission.MANAGE_BILLING_KEYS,
  ],
  
  [UserRole.ADMIN]: [
    // Admin has all except billing keys
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_REPORTS,
    Permission.VIEW_LEADS,
    Permission.CREATE_LEADS,
    Permission.EDIT_LEADS,
    Permission.DELETE_LEADS,
    Permission.VIEW_WHATSAPP,
    Permission.SEND_WHATSAPP,
    Permission.CONFIGURE_WHATSAPP,
    Permission.VIEW_SALES,
    Permission.CREATE_SALES,
    Permission.EDIT_SALES,
    Permission.DELETE_SALES,
    Permission.CREATE_INVOICES,
    Permission.VIEW_REVIEWS,
    Permission.MANAGE_REVIEWS,
    Permission.VIEW_GBP,
    Permission.MANAGE_GBP,
    Permission.VIEW_PROJECTS,
    Permission.MANAGE_PROJECTS,
    Permission.VIEW_REMINDERS,
    Permission.MANAGE_REMINDERS,
    Permission.VIEW_CAMPAIGNS,
    Permission.MANAGE_CAMPAIGNS,
    Permission.VIEW_STAFF,
    Permission.MANAGE_STAFF,
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_BILLING,
    Permission.MANAGE_BILLING,
    // Note: MANAGE_BILLING_KEYS is excluded for Admin
  ],
  
  [UserRole.SALES]: [
    // Sales: Leads, WhatsApp send, Sales, Reminders
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_LEADS,
    Permission.CREATE_LEADS,
    Permission.EDIT_LEADS,
    Permission.DELETE_LEADS,
    Permission.VIEW_WHATSAPP,
    Permission.SEND_WHATSAPP,
    Permission.VIEW_SALES,
    Permission.CREATE_SALES,
    Permission.EDIT_SALES,
    Permission.CREATE_INVOICES,
    Permission.VIEW_REMINDERS,
    Permission.MANAGE_REMINDERS,
  ],
  
  [UserRole.SUPPORT]: [
    // Support: Reviews, GBP Posts, Projects
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_REVIEWS,
    Permission.MANAGE_REVIEWS,
    Permission.VIEW_GBP,
    Permission.MANAGE_GBP,
    Permission.VIEW_PROJECTS,
    Permission.MANAGE_PROJECTS,
  ],
  
  [UserRole.VIEWER]: [
    // Viewer: Dashboard + Reports only
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_REPORTS,
  ],
};

/**
 * Permission Service Class
 */
class PermissionService {
  /**
   * Check if a role has a specific permission
   */
  hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions.includes(permission);
  }

  /**
   * Check if a role has any of the specified permissions
   */
  hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(role, permission));
  }

  /**
   * Check if a role has all of the specified permissions
   */
  hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(role, permission));
  }

  /**
   * Get all permissions for a role
   */
  getPermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(role: UserRole): string {
    const displayNames: Record<UserRole, string> = {
      [UserRole.OWNER]: 'Owner',
      [UserRole.ADMIN]: 'Admin',
      [UserRole.SALES]: 'Sales',
      [UserRole.SUPPORT]: 'Support',
      [UserRole.VIEWER]: 'Viewer',
    };
    return displayNames[role];
  }

  /**
   * Get role description
   */
  getRoleDescription(role: UserRole): string {
    const descriptions: Record<UserRole, string> = {
      [UserRole.OWNER]: 'Full access to all features including billing keys',
      [UserRole.ADMIN]: 'Full access to all features except billing keys',
      [UserRole.SALES]: 'Access to Leads, WhatsApp, Sales, and Reminders',
      [UserRole.SUPPORT]: 'Access to Reviews, GBP Posts, and Projects',
      [UserRole.VIEWER]: 'Read-only access to Dashboard and Reports',
    };
    return descriptions[role];
  }

  /**
   * Check if user can access a route
   */
  canAccessRoute(role: UserRole, route: string): boolean {
    const routePermissions: Record<string, Permission[]> = {
      '/': [Permission.VIEW_DASHBOARD],
      '/leads': [Permission.VIEW_LEADS],
      '/campaigns': [Permission.VIEW_CAMPAIGNS],
      '/whatsapp': [Permission.VIEW_WHATSAPP],
      '/sales': [Permission.VIEW_SALES],
      '/invoices': [Permission.CREATE_INVOICES],
      '/reviews': [Permission.VIEW_REVIEWS],
      '/gbp': [Permission.VIEW_GBP],
      '/projects': [Permission.VIEW_PROJECTS],
      '/reminders': [Permission.VIEW_REMINDERS],
      '/staff': [Permission.VIEW_STAFF],
      '/settings': [Permission.VIEW_SETTINGS],
      '/reports': [Permission.VIEW_REPORTS],
    };

    const requiredPermissions = routePermissions[route];
    if (!requiredPermissions) return true; // Allow access to undefined routes

    return this.hasAnyPermission(role, requiredPermissions);
  }

  /**
   * Get all available roles
   */
  getAllRoles(): UserRole[] {
    return Object.values(UserRole);
  }
}

export const permissionService = new PermissionService();
