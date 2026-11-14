"""Vercel Python function: CV spec (JSON) -> .docx filled from a copy of the IE New York College template.
Uses the same renderer (scripts/build_cv.py) and template checker (scripts/template_check.py) as the evaluation pipeline,
copied here by scripts/sync_app_prompts.py. Nothing is stored; the file is built in /tmp and returned in the response."""
import base64, json, os, subprocess, sys, tempfile, hmac
from http.server import BaseHTTPRequestHandler

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from _build_cv import build  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def _send(self, status, obj):
        data = json.dumps(obj).encode('utf8')
        self.send_response(status)
        self.send_header('content-type', 'application/json')
        self.send_header('content-length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        code = os.environ.get('APP_ACCESS_CODE')
        if not code:
            return self._send(503, {'error': 'not_configured', 'message': 'The app owner has not set APP_ACCESS_CODE yet.'})
        if not hmac.compare_digest(self.headers.get('x-access-code', ''), code):
            return self._send(401, {'error': 'access', 'message': 'Wrong or missing access code.'})
        try:
            body = json.loads(self.rfile.read(int(self.headers.get('content-length', 0))) or b'{}')
            spec = body['spec']
            with tempfile.TemporaryDirectory() as d:
                out = os.path.join(d, 'cv.docx')
                build(spec, os.path.join(HERE, 'IENYC_CV_Template.docx'), out, make_pdf=False)
                r = subprocess.run([sys.executable, os.path.join(HERE, '_template_check.py'), out], capture_output=True, text=True, timeout=30)
                report = json.loads(r.stdout) if r.stdout.strip().startswith('{') else {'checks': {}, 'passed': 0, 'total': 0}
                failed = [k for k, v in report.get('checks', {}).items() if not v]
                with open(out, 'rb') as f:
                    b64 = base64.b64encode(f.read()).decode('ascii')
            self._send(200, {'docx_b64': b64, 'template_check': {'passed': report.get('passed'), 'total': report.get('total'), 'failed': failed}})
        except Exception as e:  # never echo the spec back
            self._send(500, {'error': 'docx_failed', 'message': str(e)[:300]})
