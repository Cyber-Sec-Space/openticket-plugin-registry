import type { ComponentType } from "react";

export type Permission = 
  | 'VIEW_INCIDENTS_ALL' | 'VIEW_INCIDENTS_ASSIGNED' | 'VIEW_INCIDENTS_UNASSIGNED' | 'CREATE_INCIDENTS' | 'UPDATE_INCIDENTS_METADATA'
  | 'UPDATE_INCIDENT_STATUS_RESOLVE' | 'UPDATE_INCIDENT_STATUS_CLOSE' | 'ASSIGN_INCIDENTS_SELF' | 'ASSIGN_INCIDENTS_OTHERS'
  | 'LINK_INCIDENT_TO_ASSET' | 'UPLOAD_INCIDENT_ATTACHMENTS' | 'DELETE_INCIDENT_ATTACHMENTS' | 'DELETE_INCIDENTS' | 'EXPORT_INCIDENTS'
  | 'ADD_COMMENTS' | 'DELETE_OWN_COMMENTS' | 'DELETE_ANY_COMMENTS'
  | 'VIEW_ASSETS' | 'CREATE_ASSETS' | 'UPDATE_ASSETS' | 'DELETE_ASSETS'
  | 'VIEW_VULNERABILITIES' | 'CREATE_VULNERABILITIES' | 'UPDATE_VULNERABILITIES' | 'DELETE_VULNERABILITIES'
  | 'ASSIGN_VULNERABILITIES_SELF' | 'ASSIGN_VULNERABILITIES_OTHERS' | 'LINK_VULN_TO_ASSET' | 'UPLOAD_VULN_ATTACHMENTS' | 'DELETE_VULN_ATTACHMENTS'
  | 'VIEW_USERS' | 'CREATE_USERS' | 'UPDATE_USER_PROFILE' | 'ASSIGN_USER_ROLES' | 'RESET_USER_PASSWORDS' | 'SUSPEND_USERS' | 'DELETE_USERS'
  | 'VIEW_ROLES' | 'CREATE_ROLES' | 'UPDATE_ROLES' | 'DELETE_ROLES'
  | 'VIEW_DASHBOARD' | 'VIEW_SYSTEM_SETTINGS' | 'UPDATE_SYSTEM_SETTINGS' | 'MANAGE_INTEGRATIONS'
  | 'VIEW_PLUGINS' | 'INSTALL_PLUGINS' | 'TOGGLE_PLUGINS' | 'CONFIGURE_PLUGINS' | 'RESTART_SYSTEM_SERVICES'
  | 'VIEW_AUDIT_LOGS' | 'ACCESS_API' | 'VIEW_API_TOKENS' | 'ISSUE_API_TOKENS' | 'REVOKE_API_TOKENS';

export type IncidentStatus = 'NEW' | 'IN_PROGRESS' | 'PENDING_INFO' | 'RESOLVED' | 'CLOSED';
export type IncidentType = 'MALWARE' | 'PHISHING' | 'DATA_BREACH' | 'UNAUTHORIZED_ACCESS' | 'NETWORK_ANOMALY' | 'OTHER';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AssetType = 'SERVER' | 'ENDPOINT' | 'NETWORK' | 'SOFTWARE' | 'REPOSITORY' | 'CLOUD_RESOURCE' | 'DOMAIN' | 'IAM_ROLE' | 'SAAS_APP' | 'CONTAINER' | 'OTHER';
export type AssetStatus = 'ACTIVE' | 'INACTIVE' | 'COMPROMISED' | 'MAINTENANCE';
export type VulnStatus = 'OPEN' | 'MITIGATED' | 'RESOLVED';
export type VulnAssetStatus = 'AFFECTED' | 'MITIGATED' | 'PATCHED' | 'FALSE_POSITIVE';

export type IncidentData = {
  title: string;
  description: string;
  type?: IncidentType;
  severity?: Severity;
  assetId?: string | null;
  tags?: string[];
};

export type TicketIncident = {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: Severity;
  status: IncidentStatus;
  createdAt: Date;
  updatedAt: Date;
  reporterId: string | null;
  tags: string[];
  assetId: string | null;
  targetSlaDate: Date | null;
};

export type TicketAsset = {
  id: string;
  name: string;
  type: AssetType;
  ipAddress: string | null;
  externalId: string | null;
  metadata: any | null;
  status: AssetStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type TicketVulnerability = {
  id: string;
  title: string;
  cveId: string | null;
  cvssScore: number | null;
  description: string;
  severity: Severity;
  status: VulnStatus;
  createdAt: Date;
  updatedAt: Date;
  targetSlaDate: Date | null;
  vulnerabilityAssets?: TicketVulnerabilityAsset[];
};

export type TicketComment = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  incidentId: string | null;
  vulnId: string | null;
  authorId: string | null;
};

export type TicketUser = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  isTwoFactorEnabled?: boolean;
  isBot: boolean;
  botPluginIdentifier?: string | null;
  isDisabled: boolean;
};

export type TicketAttachment = {
  id: string;
  filename: string;
  fileUrl: string;
  createdAt: Date;
  incidentId: string | null;
  vulnId: string | null;
  uploaderId: string | null;
};

export type TicketVulnerabilityAsset = {
  id: string;
  vulnId: string;
  assetId: string;
  status: VulnAssetStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TicketAuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: any | null;
  createdAt: Date;
  userId: string | null;
};

export type TicketNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  isPushed: boolean;
  createdAt: Date;
};

export type TicketSystemSetting = {
  id: string;
  allowRegistration: boolean;
  requireGlobal2FA: boolean;
  webhookUrl: string | null;
  webhookEnabled: boolean;
  slaCriticalHours: number;
  slaHighHours: number;
  slaMediumHours: number;
  slaLowHours: number;
  rateLimitEnabled: boolean;
  rateLimitWindowMs: number;
  rateLimitMaxAttempts: number;
  smtpEnabled: boolean;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpFrom: string | null;
  smtpTriggerOnCritical: boolean;
  smtpTriggerOnHigh: boolean;
  smtpTriggerOnAssign: boolean;
  smtpTriggerOnResolution: boolean;
  smtpTriggerOnAssetCompromise: boolean;
  smtpTriggerOnNewUser: boolean;
  smtpTriggerOnNewVulnerability: boolean;
  requireEmailVerification: boolean;
  systemPlatformUrl: string;
  soarAutoQuarantineEnabled: boolean;
  soarAutoQuarantineThreshold: Severity;
  updatedAt: Date;
};

export type PluginSdkContext = {
  plugin: { id: string };
  api: {
    initEntity: (name?: string, requestedPermissions?: Permission[]) => Promise<void>;
    
    // Phase 1
    createIncident: (data: IncidentData) => Promise<TicketIncident>;
    
    // Phase 2
    getIncident: (id: string) => Promise<TicketIncident | null>;
    updateIncidentStatus: (id: string, status: IncidentStatus, comment?: string) => Promise<TicketIncident>;
    addComment: (incidentId: string, content: string) => Promise<TicketComment>;
    createAsset: (name: string, type: AssetType, ipAddress?: string, externalId?: string, metadata?: any) => Promise<TicketAsset>;
    reportVulnerability: (title: string, description: string, severity: Severity, targetAssetId: string, options?: { cveId?: string, cvssScore?: number }) => Promise<TicketVulnerability>;
    
    // Phase 3
    getUserByEmail: (email: string) => Promise<TicketUser | null>;
    assignIncident: (incidentId: string, targetUserId: string) => Promise<TicketIncident>;
    updateAssetStatus: (assetId: string, status: AssetStatus) => Promise<TicketAsset>;
    attachEvidenceToIncident: (incidentId: string, filename: string, fileUrl: string) => Promise<TicketAttachment>;
    attachEvidenceToVulnerability: (vulnId: string, filename: string, fileUrl: string) => Promise<TicketAttachment>;

    // Phase 4
    getAssetByIp: (ipAddress: string) => Promise<TicketAsset | null>;
    getAssetByIdentifier: (identifier: string) => Promise<TicketAsset | null>;
    updateVulnerabilityStatus: (vulnId: string, status: VulnStatus) => Promise<TicketVulnerability>;
    manageIncidentTags: (incidentId: string, tag: string, action: 'add' | 'remove') => Promise<TicketIncident>;
    pushNotification: (targetUserId: string, title: string, body: string, link?: string) => Promise<TicketNotification>;
    searchOpenIncidents: (query?: { severity?: Severity, tags?: string[], limit?: number }) => Promise<TicketIncident[]>;

    // Phase 6
    deleteIncident: (id: string) => Promise<TicketIncident>;
    deleteAsset: (id: string) => Promise<TicketAsset>;
    deleteVulnerability: (id: string) => Promise<TicketVulnerability>;
    updateAssetMetadata: (assetId: string, metadataPatch: any) => Promise<TicketAsset>;
    logPluginMetric: (metricName: string, value: number, payload?: any) => Promise<void>;

    // Phase 7
    createUser: (email: string, name: string, assignRoleNames?: string[]) => Promise<TicketUser>;
    suspendUser: (userId: string) => Promise<TicketUser>;
    assignUserRoles: (userId: string, targetRoleNames: string[]) => Promise<TicketUser>;
    resetUserMfaSession: (userId: string) => Promise<TicketUser>;

    // Phase 8
    updateIncidentDetails: (incidentId: string, updates: { title?: string, description?: string, severity?: Severity, assetId?: string | null }) => Promise<TicketIncident>;
    getVulnerability: (vulnId: string) => Promise<TicketVulnerability | null>;
    searchVulnerabilities: (query?: { severity?: Severity, status?: VulnStatus, limit?: number }) => Promise<TicketVulnerability[]>;
    updateVulnerabilityDetails: (vulnId: string, updates: { title?: string, description?: string, severity?: Severity, cveId?: string | null, cvssScore?: number | null }) => Promise<TicketVulnerability>;
    addCommentToVulnerability: (vulnId: string, content: string) => Promise<TicketComment>;
    assignVulnerability: (vulnId: string, targetUserId: string) => Promise<TicketVulnerability>;
    linkVulnerabilityToAsset: (vulnId: string, assetId: string) => Promise<TicketVulnerabilityAsset>;
    updateVulnerabilityAssetStatus: (vulnId: string, assetId: string, status: VulnAssetStatus, notes?: string) => Promise<TicketVulnerabilityAsset>;
    getAsset: (assetId: string) => Promise<TicketAsset | null>;
    searchAssets: (query?: { type?: AssetType, status?: AssetStatus, limit?: number }) => Promise<TicketAsset[]>;
    updateAssetDetails: (assetId: string, updates: { name?: string, type?: AssetType, ipAddress?: string | null, externalId?: string | null }) => Promise<TicketAsset>;

    // Phase 9
    linkIncidentToAsset: (incidentId: string, assetId: string) => Promise<TicketIncident>;
    unassignIncident: (incidentId: string, targetUserId: string) => Promise<TicketIncident>;
    unassignVulnerability: (vulnId: string, targetUserId: string) => Promise<TicketVulnerability>;
    unlinkVulnerabilityFromAsset: (vulnId: string, assetId: string) => Promise<TicketVulnerabilityAsset>;
    deleteComment: (commentId: string) => Promise<TicketComment | null>;
    deleteIncidentAttachment: (attachmentId: string) => Promise<TicketAttachment>;
    deleteVulnerabilityAttachment: (attachmentId: string) => Promise<TicketAttachment>;
    logAudit: (action: string, entityType: string, entityId: string, changes: any) => Promise<TicketAuditLog>;
  };
};

export type OpenTicketPluginUI = {
  dashboardWidgets?: ComponentType<any>[];
  settingsPanels?: ComponentType<any>[];
};

export type OpenTicketPlugin = {
  manifest: {
    id: string;
    name: string;
    version: string;
    description: string;
    requestedPermissions?: Permission[];
  };
  ui?: OpenTicketPluginUI;
  hooks?: {
    onInstall?: (config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onUninstall?: (config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onIncidentCreated?: (incident: TicketIncident, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onIncidentUpdated?: (incident: TicketIncident, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onIncidentResolved?: (incident: TicketIncident, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onIncidentDestroyed?: (incidentId: string, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onAssetCompromise?: (asset: TicketAsset, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onAssetCreated?: (asset: TicketAsset, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onAssetUpdated?: (asset: TicketAsset, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onAssetDestroyed?: (assetId: string, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onVulnerabilityCreated?: (vulnerability: TicketVulnerability, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onVulnerabilityUpdated?: (vulnerability: TicketVulnerability, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onVulnerabilityDestroyed?: (vulnerabilityId: string, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onCommentAdded?: (comment: TicketComment, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onUserCreated?: (user: TicketUser, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onUserUpdated?: (user: TicketUser, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onUserDestroyed?: (userId: string, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onEvidenceAttached?: (attachment: TicketAttachment, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onEvidenceDestroyed?: (attachmentId: string, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onSystemSettingsUpdated?: (settings: TicketSystemSetting, config: Record<string, any>, context: PluginSdkContext) => Promise<void>;
    onWebhookReceived?: (req: Request, config: Record<string, any>, context: PluginSdkContext) => Promise<Response>;
  };
};
