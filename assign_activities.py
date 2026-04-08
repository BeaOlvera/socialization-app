"""
Assign all activity templates to the demo newcomer (Sofia).
Run: python assign_activities.py
"""
import requests
import json

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

# Get the newcomer record (Sofia)
r = requests.get(f'{SUPABASE_URL}/rest/v1/newcomers?select=id,user_id,company_id', headers=headers)
newcomers = r.json()
print(f"Newcomers: {newcomers}")

if not newcomers:
    print("ERROR: No newcomers found. Run seed.ts first.")
    exit(1)

newcomer = newcomers[0]
print(f"Assigning activities to newcomer: {newcomer['id']}")

# Get active templates
r = requests.get(
    f'{SUPABASE_URL}/rest/v1/activity_templates?company_id=eq.{newcomer["company_id"]}&active=eq.true&order=sort_order',
    headers=headers
)
templates = r.json()
print(f"Found {len(templates)} active templates")

# Delete existing phase_tasks for this newcomer
requests.delete(
    f'{SUPABASE_URL}/rest/v1/phase_tasks?newcomer_id=eq.{newcomer["id"]}',
    headers={**headers, 'Prefer': 'return=minimal'}
)
print("Cleared existing tasks")

# Create phase_tasks from templates
tasks = []
for i, t in enumerate(templates):
    phase = 'arrival' if t['phase'] == 'pre_arrival' else t['phase']
    tasks.append({
        'newcomer_id': newcomer['id'],
        'phase': phase,
        'dimension': t['dimension'],
        'task_index': i,
        'label': t['activity'],
        'week': t.get('week'),
        'days': t.get('days'),
        'subdimension': t.get('subdimension'),
        'activity': t['activity'],
        'who': t.get('who'),
        'estimated_time': t.get('estimated_time'),
        'builds_on': t.get('builds_on'),
        'output': t.get('output'),
        'done': False,
    })

# Insert in batches
batch_size = 50
for start in range(0, len(tasks), batch_size):
    batch = tasks[start:start + batch_size]
    r = requests.post(
        f'{SUPABASE_URL}/rest/v1/phase_tasks',
        headers={**headers, 'Prefer': 'return=minimal'},
        data=json.dumps(batch)
    )
    if r.status_code in (200, 201):
        print(f"  Batch {start+1}-{start+len(batch)}: OK")
    else:
        print(f"  Batch {start+1}-{start+len(batch)}: FAILED ({r.status_code})")
        print(f"  {r.text}")
        exit(1)

print(f"\nDone! {len(tasks)} activities assigned to Sofia.")
