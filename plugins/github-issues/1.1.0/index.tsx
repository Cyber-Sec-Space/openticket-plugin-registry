import { OpenTicketPlugin, Incident } from '@openticket/core';
import crypto from 'crypto';

const GitHubIssuesPlugin: OpenTicketPlugin = {
  manifest: {
    id: 'github-issues',
    name: 'GitHub Issues Integration',
    version: '1.1.0',
    description: 'Bi-directionally syncs OpenTicket security incidents with GitHub issues.',
  },
  hooks: {
    // ---- Push: OpenTicket to GitHub ----
    onIncidentCreated: async (incident: Incident, config: Record<string, string>) => {
      const token = config['GITHUB_TOKEN'];
      const owner = config['GITHUB_OWNER'];
      const repo = config['GITHUB_REPO'];
      const labelsInput = config['ISSUE_LABELS'] || 'security,incident';

      if (!token || !owner || !repo) {
        console.error('[GitHub Issues] Missing required configuration (Token, Owner, or Repo).');
        return;
      }

      const labels = labelsInput.split(',').map(l => l.trim()).filter(l => l.length > 0);

      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `[Incident] ${incident.title}`,
            body: `### Security Incident Report\n\n**Severity:** ${incident.severity || 'Unknown'}\n**Description:**\n${incident.description || 'No description provided.'}\n\n---\n*Incident ID:* \`${incident.id}\`\n*Reported At:* ${new Date().toUTCString()}`,
            labels: labels
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          console.error(`[GitHub Issues] Failed to create GitHub issue: ${response.status} - ${err}`);
        } else {
          const data = await response.json();
          // Returning data like issue_number allows OpenTicket 0.5.0 engine to store it in incident metadata
          console.log(`[GitHub Issues] Successfully created issue #${data.number} for incident ${incident.id}`);
          return { github_issue_number: data.number };
        }
      } catch (error) {
        console.error('[GitHub Issues] Fatal network error while dispatching request', error);
      }
    },

    onIncidentResolved: async (incident: Incident, config: Record<string, string>, metadata: Record<string, any>) => {
      const token = config['GITHUB_TOKEN'];
      const owner = config['GITHUB_OWNER'];
      const repo = config['GITHUB_REPO'];
      const issueNumber = metadata['github_issue_number'];

      if (!token || !owner || !repo || !issueNumber) return;

      try {
        // Close the issue on GitHub when resolved in OpenTicket
        await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ state: 'closed' }),
        });
        console.log(`[GitHub Issues] Successfully closed issue #${issueNumber}`);
      } catch (error) {
        console.error('[GitHub Issues] Error closing issue', error);
      }
    },

    // ---- Pull: GitHub to OpenTicket ----
    onWebhookReceived: async (req: Request, config: Record<string, string>, api: any) => {
      const secret = config['WEBHOOK_SECRET'];
      if (!secret) return new Response('Webhook Secret Not Configured', { status: 400 });

      // Verify GitHub Signature
      const signature = req.headers.get('x-hub-signature-256') || '';
      const bodyText = await req.text();
      
      const hmac = crypto.createHmac('sha256', secret);
      const digest = `sha256=${hmac.update(bodyText).digest('hex')}`;
      if (signature !== digest) {
        return new Response('Invalid Signature', { status: 401 });
      }

      const payload = JSON.parse(bodyText);

      // Listen for issue close events
      if (req.headers.get('x-github-event') === 'issues' && payload.action === 'closed') {
        const issueNumber = payload.issue.number;
        // Call the OpenTicket API injected into the hook to resolve the incident associated with this ID
        await api.incidents.resolveByMetadata('github_issue_number', issueNumber);
        console.log(`[GitHub Issues] Synced close status for issue #${issueNumber} to OpenTicket.`);
      }

      return new Response('Webhook processed successfully', { status: 200 });
    }
  }
};

export default GitHubIssuesPlugin;
