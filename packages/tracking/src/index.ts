/**
 * Sends a booking tracking event through the Franco tracking layer.
 */
export function track(event: string, payload?: Record<string, unknown>): void {
  void event;
  void payload;
  // TODO: Forward to GTM dataLayer and the tracking-event Edge Function.
}
