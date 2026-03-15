const API_BASE_URL = '/api';

const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser)?.user_id || null;
    } catch { return null; }
  }
  return null;
};

export const matchService = {
  enableMatching: async () => {
    const response = await fetch(`${API_BASE_URL}/match/enable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId() }),
    });
    return response.json();
  },

  disableMatching: async () => {
    const response = await fetch(`${API_BASE_URL}/match/disable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId() }),
    });
    return response.json();
  },

  getStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/match/status?userId=${getUserId()}`);
    return response.json();
  },

  findMatch: async () => {
    const response = await fetch(`${API_BASE_URL}/match/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId() }),
    });
    const data = await response.json();
    return { ok: response.ok, ...data };
  },

  endMatch: async () => {
    const response = await fetch(`${API_BASE_URL}/match/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId() }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error');
    return data;
  },
};

export default matchService;
