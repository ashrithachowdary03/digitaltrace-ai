const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  // If user passed 'https://xyz.onrender.com', ensure '/api' suffix
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = getApiBase();

export const apiClient = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, using client fallback:', e);
      return { status: 'client_mode', service: 'DigitalTrace AI' };
    }
  },

  async getShowcaseProfiles() {
    try {
      const res = await fetch(`${API_BASE}/showcase`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Error fetching showcase profiles:', e);
    }
    return null;
  },

  async runPipeline(targetInput) {
    const res = await fetch(`${API_BASE}/pipeline/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(targetInput),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Failed to execute intelligence pipeline' }));
      throw new Error(errorData.detail || 'Pipeline execution failed');
    }

    return await res.json();
  },

  async getReport(targetId) {
    const res = await fetch(`${API_BASE}/reports/${targetId}`);
    if (!res.ok) throw new Error('Report not found');
    return await res.json();
  },

  async getSupabaseStatus() {
    try {
      const res = await fetch(`${API_BASE}/supabase/status`);
      if (res.ok) return await res.json();
    } catch (e) {
      return { status: 'local_mode', connected: false, message: 'Local storage active' };
    }
  }
};
