export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_adset?: string;
  utm_ad?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
}

const STORAGE_KEY = "dateready_utm_params";

export function captureUtm(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const existing = getStoredUtm();

    const current: UtmParams = {
      utm_source: urlParams.get("utm_source") || existing.utm_source || undefined,
      utm_medium: urlParams.get("utm_medium") || existing.utm_medium || undefined,
      utm_campaign: urlParams.get("utm_campaign") || existing.utm_campaign || undefined,
      utm_adset: urlParams.get("utm_adset") || urlParams.get("ad_set") || existing.utm_adset || undefined,
      utm_ad: urlParams.get("utm_ad") || urlParams.get("content") || existing.utm_ad || undefined,
      fbclid: urlParams.get("fbclid") || existing.fbclid || undefined,
    };

    // Extract Meta _fbp and _fbc cookies if available
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);

    if (cookies["_fbp"]) current.fbp = cookies["_fbp"];
    if (cookies["_fbc"]) current.fbc = cookies["_fbc"];
    else if (current.fbclid) {
      current.fbc = `fb.1.${Date.now()}.${current.fbclid}`;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    return {};
  }
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
