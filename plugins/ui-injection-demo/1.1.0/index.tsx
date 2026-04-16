import React from 'react';
import type { OpenTicketPlugin } from '@openticket/core';

const CardStyle = {
  padding: '1.25rem',
  backgroundColor: 'rgba(59, 130, 246, 0.05)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px'
};

const HeaderStyle = { margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' };

// ----------------------------------------------------------------------------
// 1. Dashboard Widget Component
// ----------------------------------------------------------------------------
const DemoDashboardWidget = async ({ api, config }: any) => {
  let incidentCount = 42;
  if (api && api.searchOpenIncidents) {
    try {
      const data = await api.searchOpenIncidents({ limit: 10 });
      incidentCount = data?.length || 0;
    } catch {
      incidentCount = 12;
    }
  }

  return (
    <div style={CardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '24px' }}>🎨</span>
        <h3 style={HeaderStyle}>Dashboard Widget Injection</h3>
      </div>
      <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>
        React component injected into the Dashboard. Open Incidents: <strong>{incidentCount}</strong>
      </p>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 2. Settings Panel Component
// ----------------------------------------------------------------------------
const DemoSettingsPanel = ({ config }: any) => {
  const isDemoModeEnabled = config?.ENABLE_DEMO_MODE === 'true';
  return (
    <div style={CardStyle}>
      <h3 style={HeaderStyle}>⚙️ Operator Settings Panel</h3>
      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
        Demo Mode is: {isDemoModeEnabled ? 'ACTIVE' : 'INACTIVE'} (from config)
      </p>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 3. Context Widgets
// ----------------------------------------------------------------------------
const DemoIncidentWidget = ({ incident }: any) => (
  <div style={{ ...CardStyle, backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
    <h3 style={HeaderStyle}>📄 Incident Context Widget</h3>
    <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
      Viewing Incident ID: <code>{incident?.id || 'Unknown'}</code><br/>
      Title: {incident?.title || 'Unknown'}
    </p>
  </div>
);

const DemoAssetWidget = ({ asset }: any) => (
  <div style={{ ...CardStyle, backgroundColor: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
    <h3 style={HeaderStyle}>💻 Asset Context Widget</h3>
    <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
      Contextual Asset: {asset?.name || 'Unknown'} (IP: {asset?.ipAddress || 'N/A'})
    </p>
  </div>
);

const DemoVulnerabilityWidget = ({ vulnerability }: any) => (
  <div style={{ ...CardStyle, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
    <h3 style={HeaderStyle}>🛡️ Vulnerability Context Widget</h3>
    <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
      Inspecting Vuln: {vulnerability?.title || 'Unknown'} ({vulnerability?.cveId || 'No CVE'})
    </p>
  </div>
);

const DemoUserWidget = ({ user }: any) => (
  <div style={{ ...CardStyle, backgroundColor: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
    <h3 style={HeaderStyle}>👤 User Context Widget</h3>
    <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
      Profile Target: {user?.name || 'Unknown'} ({user?.email})
    </p>
  </div>
);

// ----------------------------------------------------------------------------
// 4. Full Page Component
// ----------------------------------------------------------------------------
const DemoFullPage = ({ routeSlug }: any) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={CardStyle}>
        <h1 style={{ ...HeaderStyle, fontSize: '1.5rem', marginBottom: '1rem' }}>🚀 Full Page Plugin Route</h1>
        <p style={{ color: '#475569', lineHeight: 1.6 }}>
          Welcome to a completely isolated full-page React route injected by the plugin system!
          <br/><br/>
          This page bypasses standard Next.js file-system routing and is directly served via our dynamic catch-all system (<code>/plugins/[pluginId]/[[...slug]]</code>).
        </p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <strong>Extracted Sub-Route Slugs:</strong>
          <pre style={{ margin: 0, marginTop: '0.5rem' }}>{JSON.stringify(routeSlug || [], null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 5. System Config Tab Component
// ----------------------------------------------------------------------------
const DemoSystemConfigTab = ({ config }: any) => {
  return (
    <div style={{ ...CardStyle, border: 'none', padding: '0', boxShadow: 'none' }}>
      <h3 style={{ ...HeaderStyle, fontSize: '1.25rem', marginBottom: '1rem' }}>⚙️ Custom System Configuration</h3>
      <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        This Native Tab allows plugin administrators to manage global configuration independently of the main System Settings forms.
      </p>
      <div style={{ padding: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Active Configuration Dump:</h4>
        <pre style={{ fontSize: '12px', background: '#f1f5f9', padding: '12px', borderRadius: '4px', overflowX: 'auto', marginTop: '8px' }}>
          {JSON.stringify(config || { "message": "No config available" }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Plugin Registration Manifest
// ----------------------------------------------------------------------------
const UiInjectionDemo: OpenTicketPlugin = {
  manifest: {
    id: 'ui-injection-demo',
    name: 'UI Frontend Injection Demo',
    version: '1.1.0',
    description: 'Demonstrates the Zero-Downtime Hot Reload capabilities of OpenTicket by natively injecting React widgets, full pages, and settings tabs.',
    supportedPluginApiVersion: ['1.0.0', '1.1.0', '1.2.0', '1.3.0'],
    requestedPermissions: ['VIEW_INCIDENTS_ALL'],
    options: [
      {
        key: "ENABLE_DEMO_MODE",
        type: "boolean",
        label: "Enable Settings Panel Interactive Demo Mode",
        required: false
      }
    ]
  },
  
  ui: {
    dashboardWidgets: [DemoDashboardWidget],
    settingsPanels: [DemoSettingsPanel],
    incidentMainWidgets: [DemoIncidentWidget],
    incidentSidebarWidgets: [DemoIncidentWidget],
    assetMainWidgets: [DemoAssetWidget],
    assetSidebarWidgets: [DemoAssetWidget],
    vulnerabilityMainWidgets: [DemoVulnerabilityWidget],
    vulnerabilitySidebarWidgets: [DemoVulnerabilityWidget],
    userMainWidgets: [DemoUserWidget],
    userSidebarWidgets: [DemoUserWidget],
    pages: [
      {
        routeUrl: 'demo-page',
        title: 'UI Integration Demo',
        component: DemoFullPage
      }
    ],
    systemConfigTabs: [
      {
        tabId: 'ui-demo-config',
        label: 'UI Demonstration Settings',
        component: DemoSystemConfigTab
      }
    ]
  },

  hooks: {}
};

export default UiInjectionDemo;
