#!/usr/bin/env python3
"""Tiny Make.com API helper. Token and zone come from .env.make.local (git-ignored); the token is never printed."""
import json, os, sys, urllib.request, urllib.error
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def env():
    d = {}
    for line in open(os.path.join(ROOT, '.env.make.local'), encoding='utf-8'):
        if '=' in line:
            k, v = line.strip().split('=', 1); d[k] = v.strip().strip('"\'')
    return d

def call(method, path, body=None):
    e = env()
    req = urllib.request.Request(f"https://{e['MAKE_ZONE']}/api/v2{path}", method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={'Authorization': 'Token ' + e['MAKE_API_TOKEN'], 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read() or b'null')
    except urllib.error.HTTPError as ex:
        return ex.code, ex.read().decode()[:600]

if __name__ == '__main__':
    s, d = call(sys.argv[1], sys.argv[2], json.loads(sys.argv[3]) if len(sys.argv) > 3 else None)
    print(s); print(json.dumps(d, ensure_ascii=False, indent=1)[:4000])
