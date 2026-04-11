import React, { useState, useEffect } from 'react';
import type { OpenTicketPlugin } from '@openticket/core';

// ----------------------------------------------------------------------------
// 1. Dashboard Widget Component
// This component will be injected natively into the OpenTicket Admin Dashboard.
// ----------------------------------------------------------------------------
const DemoDashboardWidget = ({ api, config }: any) => {
  const [incidentCount, setIncidentCount] = useState<number | null>(null);

  // Fetch some dummy data or use the injected API
  useEffect(() => {
    // In a real plugin, you would use the authenticated API client
    // For demonstration, we simply mock a response pattern.
    if (api && api.searchOpenIncidents) {
      api.searchOpenIncidents({ limit: 10 }).then((data: any) => {
        setIncidentCount(data.length || 0);
      }).catch(() => setIncidentCount(12)); // fallback for demo
    } else {
      setIncidentCount(42);
    }
  }, [api]);

  return (
    <div style={{
      padding: '1.25rem',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '24px' }}>🎨</span>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
          Custom Injected Widget
        </h3>
      </div>
      <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>
        This React component was delivered directly from the standard OpenTicket Plugin Registry zero-downtime hot-loader.
      </p>
      <div style={{
        marginTop: '12px',
        padding: '12px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontWeight: 500, color: '#64748b' }}>Open Incidents Detected</span>
        <span style={{
          padding: '4px 12px',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontWeight: 700,
          borderRadius: '9999px',
          fontSize: '0.875rem'
        }}>
          {incidentCount !== null ? incidentCount : 'Loading...'}
        </span>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 2. Settings Panel Component
// This component provides an interface inside the System Settings layout.
// ----------------------------------------------------------------------------
const DemoSettingsPanel = ({ config }: any) => {
  const [isDemoModeEnabled, setIsDemoModeEnabled] = useState(
    config['ENABLE_DEMO_MODE'] === 'true'
  );

  return (
    <div style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⚙️ UI Injection Settings Panel
      </h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        This panel supports stateful interactions. You can bind settings directly to the plugin registry schema context or run independent logic here!
      </p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
        <button 
          onClick={() => setIsDemoModeEnabled(!isDemoModeEnabled)}
          style={{
            padding: '10px 20px',
            backgroundColor: isDemoModeEnabled ? '#10b981' : '#f1f5f9',
            color: isDemoModeEnabled ? '#ffffff' : '#475569',
            border: `1px solid ${isDemoModeEnabled ? '#059669' : '#cbd5e1'}`,
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: isDemoModeEnabled ? '0 2px 4px rgba(16, 185, 129, 0.2)' : 'none'
          }}
        >
          {isDemoModeEnabled ? 'Demo Mode Active' : 'Enable Demo Mode'}
        </button>
        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
          This button demonstrates localized React state retention during Hot Reload testing.
        </span>
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
    version: '1.0.0',
    description: 'Demonstrates the Zero-Downtime Hot Reload capabilities of OpenTicket by natively injecting React widgets and settings panels into the dashboard.',
    requestedPermissions: ['VIEW_INCIDENTS_ALL']
  },
  
  // Registering our custom frontend components!
  ui: {
    dashboardWidgets: [DemoDashboardWidget],
    settingsPanels: [DemoSettingsPanel]
  },

  // No specific background hooks needed for this cosmetic plugin demo
  hooks: {}
};

export default UiInjectionDemo;
