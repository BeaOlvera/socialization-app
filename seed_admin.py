"""
Seed an admin user for the platform.
Run: python seed_admin.py
"""
import requests
import json
import bcrypt

env = {}
with open('.env.local') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()

SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
SERVICE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']

headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
}

# Check if admin already exists
r = requests.get(
    f'{SUPABASE_URL}/rest/v1/users?role=eq.admin&select=id,email',
    headers=headers
)
existing = r.json()
if existing:
    print(f"Admin already exists: {existing[0]['email']}")
    exit(0)

# Create admin user (no company_id)
password = 'admin123'
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12)).decode()

r = requests.post(
    f'{SUPABASE_URL}/rest/v1/users',
    headers=headers,
    data=json.dumps({
        'email': 'admin@onboard.app',
        'name': 'Platform Admin',
        'role': 'admin',
        'password_hash': password_hash,
    })
)

if r.status_code in (200, 201):
    user = r.json()
    print(f"Admin created!")
    print(f"  Email: admin@onboard.app")
    print(f"  Password: {password}")
    if isinstance(user, list):
        print(f"  ID: {user[0].get('id', 'unknown')}")
    else:
        print(f"  ID: {user.get('id', 'unknown')}")
else:
    print(f"Error: {r.status_code}")
    print(r.text)
