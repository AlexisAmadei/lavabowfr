export function getOrCreateClientId(): string {
  let clientId = localStorage.getItem('clientId');

  if (!clientId) {
    clientId = self.crypto.randomUUID();
    localStorage.setItem('clientId', clientId);
  }
  return clientId;
};