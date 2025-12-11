const SITE_MODES = {
  LSD: 'lsd',
  NORMAL: 'normal',
};

const normalizeMode = (mode) => {
  const safeValue = (mode || '').toString().toLowerCase();
  return safeValue === SITE_MODES.LSD ? SITE_MODES.LSD : SITE_MODES.NORMAL;
};

const readEnvMode = () => normalizeMode(import.meta.env.VITE_SITE_MODE || SITE_MODES.NORMAL);

export const loadSiteMode = () => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('siteModeOverride');
    if (stored) {
      return normalizeMode(stored);
    }
  }

  return readEnvMode();
};

export const persistSiteModeOverride = (mode) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('siteModeOverride', normalizeMode(mode));
  }
};

export const clearSiteModeOverride = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('siteModeOverride');
  }
};

export { SITE_MODES };
