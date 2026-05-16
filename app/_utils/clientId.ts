export const updateLastSeen = async (clientId: string) => {
  try {
    await fetch('/api/updateLastSeen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId }),
    });
  } catch (error) {
    console.error('Error updating last seen:', error);
  }
};

export const deleteOnlineUser = async (clientId: string) => {
  try {
    await fetch('/api/deleteOnlineUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId }),
    });
  } catch (error) {
    console.error('Error deleting online user:', error);
  }
};

export function getOrCreateClientId(): string {
  let clientId = localStorage.getItem('clientId');

  if (!clientId) {
    clientId = self.crypto.randomUUID();
    localStorage.setItem('clientId', clientId);
  }
  return clientId;
};