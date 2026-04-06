/**
 * Temporary / mock data hooks for future API integration.
 * Replace with real fetches in services when backend exists.
 */
export const MOCK_API_DELAY_MS = 0;

export async function mockDelay(ms = MOCK_API_DELAY_MS) {
  if (ms <= 0) return;
  await new Promise((r) => setTimeout(r, ms));
}
