import { handlers } from '../../../lib/steps.js';

export const maxDuration = 120;

// Every request needs the owner's access code (APP_ACCESS_CODE), so strangers cannot spend the owner's API credits.
// Nothing is stored on the server and request bodies are never logged.
export async function POST(req) {
  const code = process.env.APP_ACCESS_CODE;
  if (!code) return Response.json({ error: 'not_configured', message: 'The app owner has not set APP_ACCESS_CODE yet.' }, { status: 503 });
  if (req.headers.get('x-access-code') !== code) return Response.json({ error: 'access', message: 'Wrong or missing access code.' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'bad_json' }, { status: 400 }); }
  const fn = handlers[body.step];
  if (!fn) return Response.json({ error: 'unknown_step' }, { status: 400 });
  try {
    return Response.json(await fn(body));
  } catch (e) {
    return Response.json({ error: 'step_failed', message: String(e.message || e).slice(0, 300) }, { status: 500 });
  }
}
