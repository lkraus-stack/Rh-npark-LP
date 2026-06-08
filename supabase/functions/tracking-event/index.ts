import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createServiceRoleClient } from "../_shared/supabase-client.ts";

type TrackingRequest = {
  event?: string;
  payload?: Record<string, unknown>;
  timestamp?: string;
  page_url?: string;
  page_path?: string;
};

function getSearchParam(pageUrl: string | undefined, name: string) {
  if (!pageUrl) return null;

  try {
    return new URL(pageUrl).searchParams.get(name);
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = (await req.json().catch(() => ({}))) as TrackingRequest;
  const eventName = body.event;

  if (!eventName) {
    return new Response(JSON.stringify({ error: "Missing event" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const payload = body.payload ?? {};
  const propertySlug = typeof payload.property_slug === "string" ? payload.property_slug : "rhoenpark";
  const supabase = createServiceRoleClient();
  const { data: property } = await supabase.from("properties").select("id").eq("slug", propertySlug).maybeSingle();
  const eventId = typeof payload.event_id === "string" ? payload.event_id : crypto.randomUUID();

  const { error } = await supabase.from("tracking_events").insert({
    property_id: property?.id ?? null,
    event_id: eventId,
    event_name: eventName,
    user_agent: req.headers.get("user-agent"),
    page_url: body.page_url ?? null,
    referrer: req.headers.get("referer"),
    gclid: getSearchParam(body.page_url, "gclid"),
    fbclid: getSearchParam(body.page_url, "fbclid"),
    utm_source: getSearchParam(body.page_url, "utm_source"),
    utm_medium: getSearchParam(body.page_url, "utm_medium"),
    utm_campaign: getSearchParam(body.page_url, "utm_campaign"),
    utm_content: getSearchParam(body.page_url, "utm_content"),
    utm_term: getSearchParam(body.page_url, "utm_term"),
    payload: {
      ...payload,
      page_path: body.page_path ?? null,
      client_timestamp: body.timestamp ?? null,
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: "Could not store tracking event" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ ok: true, event_id: eventId }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
