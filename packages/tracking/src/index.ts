declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export interface TrackingPayload extends Record<string, unknown> {
  flow?: "inquiry" | "transactional" | string;
}

/**
 * Sends a booking tracking event through the host GTM dataLayer and the
 * attribution Edge Function. React components must call this wrapper only.
 */
export function track(event: string, payload: TrackingPayload = {}): void {
  if (typeof window === "undefined") return;

  const timestamp = new Date().toISOString();
  const dataLayerPayload = {
    event,
    ...payload,
    timestamp,
  };
  const edgePayload = {
    event,
    payload,
    timestamp,
    page_url: window.location.href,
    page_path: window.location.pathname,
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(dataLayerPayload);

  const body = JSON.stringify(edgePayload);

  if ("sendBeacon" in navigator) {
    const sent = navigator.sendBeacon(
      "/api/tracking-event",
      new Blob([body], { type: "application/json" }),
    );
    if (sent) return;
  }

  void fetch("/api/tracking-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
