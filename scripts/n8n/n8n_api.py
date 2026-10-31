#!/usr/bin/env python3
"""Small n8n API helper for the "紫微策展週刊 1.0" workflow (Railway: tu-n8n.up.railway.app).

The API key is read from the N8N_API_KEY environment variable, or from .env.n8n.local in the repo
root (git-ignored by the `.env*.local` rule, and not touched by `vercel env pull`). It is never printed.

  python3 scripts/n8n/n8n_api.py status             # active flag, node count, last update
  python3 scripts/n8n/n8n_api.py backup             # save the live workflow to .n8n-backups/
  python3 scripts/n8n/n8n_api.py put <workflow.json>  # back up the live version, then PUT the file

`put` refuses to run unless the live workflow is still active afterwards, and it never edits the file
you give it. n8n's UI can overwrite API edits with a stale browser copy, so re-run `status` or
`backup` after anyone has had the workflow open in the editor.
"""
import json, os, sys, time, urllib.request, urllib.error

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
BASE = os.environ.get('N8N_BASE_URL', 'https://tu-n8n.up.railway.app') + '/api/v1'
WORKFLOW_ID = 'yB4iSShTrS2jPGZV'
BACKUPS = os.path.join(ROOT, '.n8n-backups')


def api_key():
    k = os.environ.get('N8N_API_KEY', '').strip()
    if not k:
        f = os.path.join(ROOT, '.env.n8n.local')
        if os.path.exists(f):
            for line in open(f, encoding='utf-8'):
                if line.startswith('N8N_API_KEY='):
                    k = line.split('=', 1)[1].strip().strip('"\'')
    if not k:
        sys.exit('No N8N_API_KEY found. Put N8N_API_KEY=... in .env.n8n.local (repo root) or export it.')
    return k


def call(method, path, body=None):
    req = urllib.request.Request(
        BASE + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={'X-N8N-API-KEY': api_key(), 'Content-Type': 'application/json', 'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read() or b'null')
    except urllib.error.HTTPError as e:
        return e.code, {'error': e.read().decode()[:400]}


def get_live():
    status, w = call('GET', f'/workflows/{WORKFLOW_ID}')
    if status == 401:
        sys.exit('n8n says 401: the API key is missing, wrong or expired. Create a new one in n8n (Settings > n8n API).')
    if status != 200:
        sys.exit(f'GET failed: {status} {w}')
    return w


def backup(w):
    os.makedirs(BACKUPS, exist_ok=True)
    path = os.path.join(BACKUPS, time.strftime('workflow-%Y%m%d-%H%M%S.json'))
    json.dump(w, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    return path


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    w = get_live()
    if cmd == 'status':
        print(f"active={w['active']} nodes={len(w['nodes'])} updatedAt={w['updatedAt']}")
    elif cmd == 'backup':
        print('saved', backup(w))
    elif cmd == 'put':
        new = json.load(open(sys.argv[2], encoding='utf-8'))
        print('backup of live version:', backup(w))
        body = {k: new[k] for k in ('name', 'nodes', 'connections', 'settings')}
        status, r = call('PUT', f'/workflows/{WORKFLOW_ID}', body)
        if status != 200:
            sys.exit(f'PUT failed: {status} {r}')
        after = get_live()
        if not after['active']:
            sys.exit('Workflow is no longer active after the update. Re-activate it in n8n and check the editor.')
        print(f"updated: active={after['active']} nodes={len(after['nodes'])} updatedAt={after['updatedAt']}")
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()
