import { OpenTicketPlugin } from '@openticket/core';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import crypto from 'crypto';

const EmailToTicket: OpenTicketPlugin = {
  manifest: {
    id: 'email-to-ticket',
    name: 'Email Receiver (Webhook & IMAP)',
    version: '1.0.0',
    description: 'Parses incoming emails and generates security incidents. Supports both passive Webhooks and active IMAP polling.',
  },
  hooks: {
    onWebhookReceived: async (req: Request, config: Record<string, string>, api: any) => {
      // Exit if user selected IMAP
      if (config['INTEGRATION_METHOD'] !== 'WEBHOOK') {
        return new Response('Webhook integration is disabled', { status: 403 });
      }

      const secret = config['WEBHOOK_SECRET'];
      if (!secret) return new Response('Webhook Secret Not Configured', { status: 400 });

      // Verify HMAC or Basic Auth based on secret could be implemented here
      // For this implementation, we will assume a generic JSON webhook structural payload
      const bodyText = await req.text();
      
      try {
        const payload = JSON.parse(bodyText);
        const subject = payload.subject || payload.Title || 'Incoming Email Incident';
        // Mailgun style or Sendgrid style
        const body = payload['body-plain'] || payload.text || payload.Description || 'No content provided';
        const sender = payload.sender || payload.from || 'Unknown Sender';

        await api.incidents.create({
          title: subject,
          description: body,
          severity: 'MEDIUM',
          metadata: { 
            source: 'email-webhook',
            sender: sender
          }
        });

        return new Response('Email Processed Successfully', { status: 200 });
      } catch (err) {
        return new Response('Invalid JSON payload', { status: 400 });
      }
    },

    onTick: async (config: Record<string, string>, api: any) => {
      // Exit if user selected WEBHOOK
      if (config['INTEGRATION_METHOD'] !== 'IMAP') return;

      const host = config['IMAP_HOST'];
      const user = config['IMAP_USER'];
      const password = config['IMAP_PASSWORD'];
      const port = parseInt(config['IMAP_PORT'] || '993', 10);
      const tls = config['IMAP_TLS'] !== 'false';

      if (!host || !user || !password) {
        console.error('[EmailToTicket] IMAP missing credentials. Skipping sync.');
        return;
      }

      return new Promise((resolve, reject) => {
        const imap = new Imap({
          user: user,
          password: password,
          host: host,
          port: port,
          tls: tls,
          tlsOptions: { rejectUnauthorized: false }
        });

        imap.once('ready', () => {
          imap.openBox('INBOX', false, (err, box) => {
            if (err) return reject(err);

            imap.search(['UNSEEN'], (err, results) => {
              // No unseen messages or error
              if (err || !results || results.length === 0) {
                imap.end();
                return resolve(null);
              }

              // Fetch the entire message bodies
              const f = imap.fetch(results, { bodies: '' });
              
              f.on('message', (msg) => {
                msg.on('body', (stream) => {
                  simpleParser(stream, async (err, parsed) => {
                    if (err) return;
                    await api.incidents.create({
                      title: parsed.subject || 'Incoming Email Incident (IMAP)',
                      description: parsed.text || 'No text content',
                      severity: 'MEDIUM',
                      metadata: { 
                        source: 'email-imap', 
                        sender: parsed.from?.text || 'Unknown'
                      }
                    });
                  });
                });
                msg.once('attributes', (attrs) => {
                  // Mark the fetched email as Seen to avoid processing it again
                  imap.addFlags(attrs.uid, ['\\Seen'], (err) => {
                    if (err) console.error("[EmailToTicket] Failed to mark email as seen", err);
                  });
                });
              });

              f.once('error', (err) => {
                reject(err);
              });

              f.once('end', () => {
                imap.end();
                resolve(null);
              });
            });
          });
        });

        imap.once('error', (err: any) => reject(err));
        imap.connect();
      });
    }
  }
};

export default EmailToTicket;
