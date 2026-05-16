import { OpenPanel } from '@openpanel/web';

// const nextEnv = typeof process !== 'undefined' ? process.env : ({} as Record<string, string | undefined>);

const clientId = process.env.NEXT_PUBLIC_OPENPANEL_ID ?? '';
const apiUrl = process.env.NEXT_PUBLIC_OPENPANEL_URL ?? '';

export const op = new OpenPanel({
  clientId,
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true,
  apiUrl,
});
