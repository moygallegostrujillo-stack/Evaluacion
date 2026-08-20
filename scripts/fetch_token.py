import urllib.request
import json

url = 'https://evaluacion-murex.vercel.app/api/auth'
data = json.dumps({'action': 'login', 'email': 'admin@evaluhr.com', 'password': 'admin123'})
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, timeout=120)
try:
    resp = req.read()
    d = json.loads(resp.read().decode('utf-8'))
    print(json.dumps(d, indent=2))
except Exception as e:
    print(f'Error: {e}')
