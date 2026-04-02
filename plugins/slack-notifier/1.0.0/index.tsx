import { OpenTicketPlugin } from '@openticket/core';

const SlackNotifierPlugin: OpenTicketPlugin = {
  id: 'slack-notifier',
  name: 'Slack Notifier',
  version: '1.0.0',
  description: 'Send alerts to Slack when security incidents occur.',
  onIncidentCreated: async (incident, config) => {
    const webhookUrl = config['SLACK_WEBHOOK_URL'];
    if (!webhookUrl) return;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 New Incident: ${incident.title}`,
        }),
      });
    } catch (error) {
      console.error('Failed to dispatch Slack notification', error);
    }
  },
};

export default SlackNotifierPlugin;
