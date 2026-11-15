// Minimal Anthropic Messages API client (fetch only, no SDK). The key comes from the ANTHROPIC_API_KEY environment variable
// set by the app owner in Vercel; it is never sent to the browser or logged.
export const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';

export async function callClaude(system, user, maxTokens = 4096) {
  const key = process.env.ANTHROPIC_API_KEY || process.env.CATARINA_API_KEY; // the owner's Vercel variable is named CATARINA_API_KEY
  if (!key) throw new Error('No API key is set on the server (ANTHROPIC_API_KEY).');
  const started = Date.now();
  const res = await fetch((process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com') + '/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error('Model call failed with status ' + res.status);
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  return { text, usage: data.usage || {}, ms: Date.now() - started };
}

export function parseJson(text) {
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  const c = t.indexOf('['), d = t.lastIndexOf(']');
  const useArr = c !== -1 && (a === -1 || c < a);
  return JSON.parse(useArr ? t.slice(c, d + 1) : t.slice(a, b + 1));
}
