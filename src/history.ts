export type HistoryPoint = { ts: number; value: number };

export async function fetchHistoryBetween(
  hass: any,
  entityId: string,
  startIso: string,
  endIso: string
): Promise<HistoryPoint[]> {
  const url =
    `history/period/${encodeURIComponent(startIso)}` +
    `?filter_entity_id=${encodeURIComponent(entityId)}` +
    `&end_time=${encodeURIComponent(endIso)}` +
    `&minimal_response`;

  const resp = await hass.callApi("GET", url);
  const states: any[] = Array.isArray(resp) && Array.isArray(resp[0]) ? resp[0] : [];

  return states
    .map((s) => ({
      ts: Date.parse(s.last_changed ?? s.last_updated),
      value: Number(s.state),
    }))
    .filter((p) => Number.isFinite(p.ts) && Number.isFinite(p.value));
}