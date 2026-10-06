export type TreasuryApiAction =
  | "addTransaction"
  | "recordDuesPayment"
  | "recordMeetingCollections"
  | "voidTransaction";

export type TreasuryApiResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
  updatedAt?: string;
};

const API_PATH = "/api/treasury";

async function parseResponse<T>(response: Response): Promise<TreasuryApiResult<T>> {
  const text = await response.text();
  let payload: TreasuryApiResult<T>;
  try {
    payload = JSON.parse(text) as TreasuryApiResult<T>;
  } catch {
    throw new Error(response.ok ? "Treasury API returned an invalid response." : `Treasury API failed (${response.status}).`);
  }
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Treasury API failed (${response.status}).`);
  }
  return payload;
}

export async function fetchGoogleSheetsSnapshot<T>(): Promise<{data:T;updatedAt?:string}> {
  const response = await fetch(`${API_PATH}?resource=bootstrap`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const payload = await parseResponse<T>(response);
  if (!payload.data) throw new Error("Treasury API returned no data.");
  return { data: payload.data, updatedAt: payload.updatedAt };
}

export async function postGoogleSheetsAction<T = unknown>(
  action: TreasuryApiAction,
  payload: Record<string, unknown>,
): Promise<TreasuryApiResult<T>> {
  const response = await fetch(API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  return parseResponse<T>(response);
}
