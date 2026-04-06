import { OpenTicketPlugin, Incident } from '@openticket/core';

const GitHubIssuesPlugin: OpenTicketPlugin = {
  manifest: {
    id: 'github-issues',
    name: 'GitHub Issues Integration',
    version: '1.0.0',
    description: 'Automatically creates a GitHub issue when a new security incident is reported.',
  },
  hooks: {
    onIncidentCreated: async (incident: Incident, config: Record<string, string>) => {
      const token = config['GITHUB_TOKEN'];
      const owner = config['GITHUB_OWNER'];
      const repo = config['GITHUB_REPO'];
      const labelsInput = config['ISSUE_LABELS'] || 'security,incident';

      if (!token || !owner || !repo) {
        console.error('[GitHub Issues] Missing required configuration (Token, Owner, or Repo).');
        return;
      }

      // Parse comma separated labels
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
          console.log(`[GitHub Issues] Successfully created issue for incident ${incident.id}`);
        }
      } catch (error) {
        console.error('[GitHub Issues] Fatal network error while dispatching request', error);
      }
    },
  }
};

export default GitHubIssuesPlugin;
