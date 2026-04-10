import { OpenTicketPlugin, Incident } from '@openticket/core';
import crypto from 'crypto';

const GitHubIssuesPlugin: OpenTicketPlugin = {
  manifest: {
    id: 'github-issues',
    name: 'GitHub Issues Integration',
    version: '1.1.0',
    description: 'Bi-directionally syncs OpenTicket security incidents with GitHub issues. Supports multiple repositories mapped as distinct Assets.',
  },
  hooks: {
    // ---- Initialization: Create Assets for all configured Repos ----
    onPluginActivated: async (config: Record<string, string>, api: any) => {
      const reposInput = config['GITHUB_REPOS'];
      if (!reposInput) return;

      // Extract comma-separated repositories, e.g. "Cyber-Sec-Space/openticket, Cyber-Sec-Space/another-project"
      const repos = reposInput.split(',').map(r => r.trim()).filter(r => r.length > 0 && r.includes('/'));

      for (const repo of repos) {
        try {
          await api.assets.upsert({
            name: `${repo}`,
            type: 'REPOSITORY',
            description: `Auto-synced repository asset for GitHub Project: ${repo}`,
            metadata: {
              plugin: 'github-issues',
              repo_identifier: repo
            }
          });
          console.log(`[GitHub Issues] Created/Validated repository asset for ${repo}`);
        } catch (error) {
          console.error(`[GitHub Issues] Failed to create asset for ${repo}`, error);
        }
      }
    },

    // ---- Push: OpenTicket to GitHub ----
    onIncidentCreated: async (incident: Incident, config: Record<string, string>) => {
      const token = config['GITHUB_TOKEN'];
      const labelsInput = config['ISSUE_LABELS'] || 'security,incident';

      if (!token) return;

      // Determine correct repo from incident's attached asset
      // Fallback: If no asset is selected, we cannot determine which repo to create the issue on.
      const targetRepo = incident.asset?.metadata?.repo_identifier;
      if (!targetRepo || !targetRepo.includes('/')) {
        console.log(`[GitHub Issues] Skipping issue creation: Incident ${incident.id} is not mapped to a GitHub Repository Asset.`);
        return;
      }

      const [owner, repo] = targetRepo.split('/');
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

        if (response.ok) {
          const data = await response.json();
          console.log(`[GitHub Issues] Successfully created issue #${data.number} in ${targetRepo} for incident ${incident.id}`);
          // Saving target_repo alongside issue_number to ensure correct repo is used for resolutions
          return { github_issue_number: data.number, target_repo: targetRepo };
        } else {
          console.error(`[GitHub Issues] Failed to create issue in ${targetRepo}: ${response.status}`);
        }
      } catch (error) {
        console.error('[GitHub Issues] Fatal network error', error);
      }
    },

    onIncidentResolved: async (incident: Incident, config: Record<string, string>, metadata: Record<string, any>) => {
      const token = config['GITHUB_TOKEN'];
      const issueNumber = metadata['github_issue_number'];
      const targetRepo = metadata['target_repo'];

      if (!token || !issueNumber || !targetRepo) return;

      const [owner, repo] = targetRepo.split('/');

      try {
        await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ state: 'closed' }),
        });
        console.log(`[GitHub Issues] Closed issue #${issueNumber} in ${targetRepo}`);
      } catch (error) {
        console.error('[GitHub Issues] Error closing issue', error);
      }
    },

    // ---- Pull: GitHub to OpenTicket ----
    onWebhookReceived: async (req: Request, config: Record<string, string>, api: any) => {
      const secret = config['WEBHOOK_SECRET'];
      if (!secret) return new Response('Webhook Secret Not Configured', { status: 400 });

      const signature = req.headers.get('x-hub-signature-256') || '';
      const bodyText = await req.text();
      
      const hmac = crypto.createHmac('sha256', secret);
      const digest = `sha256=${hmac.update(bodyText).digest('hex')}`;
      if (signature !== digest) {
        return new Response('Invalid Signature', { status: 401 });
      }

      const payload = JSON.parse(bodyText);

      // Verify actions only for issues that are closed
      if (req.headers.get('x-github-event') === 'issues' && payload.action === 'closed') {
        const issueNumber = payload.issue.number;
        const targetRepo = payload.repository.full_name;

        // Resolve all incidents that match BOTH the metadata signature so cross-repo issues don't collide
        await api.incidents.resolveByMetadata({
          github_issue_number: issueNumber,
          target_repo: targetRepo
        });
        console.log(`[GitHub Issues] Synced close status for ${targetRepo}#${issueNumber} to OpenTicket.`);
      }

      return new Response('Webhook processed', { status: 200 });
    }
  }
};

export default GitHubIssuesPlugin;
