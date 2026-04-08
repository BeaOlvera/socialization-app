"""
Upload check-in schedule from Socialization_Checkin_Schedule.xlsx to Supabase.
Run: python upload_checkins.py
"""
import openpyxl
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
    'Prefer': 'return=minimal',
}

# Get company
r = requests.get(f'{SUPABASE_URL}/rest/v1/companies?select=id,name', headers=headers)
companies = r.json()
if not companies:
    print("ERROR: No companies. Run seed.ts first.")
    exit(1)

company_id = companies[0]['id']
print(f"Company: {companies[0]['name']} ({company_id})")

PHASE_MAP = {
    'Pre-arrival': 'pre_arrival',
    'Arrival': 'arrival',
    'Integration': 'integration',
    'Adjustment': 'adjustment',
    'Stabilization': 'stabilization',
    'Embedding': 'embedding',
}

DIM_MAP = {
    'FIT, ACE, TIE': 'fit',
    'FIT, TIE': 'fit',
    'FIT, ACE': 'fit',
    'FIT': 'fit',
    'ACE': 'ace',
    'ACE, TIE': 'ace',
    'TIE': 'tie',
    'TIE, ACE': 'tie',
}

ASSIGNED_MAP = {
    'Newcomer (self)': 'newcomer',
    'Newcomer': 'newcomer',
    'Manager': 'manager',
    'Buddy': 'buddy',
    'HR Admin': 'hr',
    'HR': 'hr',
}

wb = openpyxl.load_workbook('Socialization_Checkin_Schedule.xlsx')
ws = wb.active

# Delete existing check-in templates
requests.delete(
    f'{SUPABASE_URL}/rest/v1/activity_templates?company_id=eq.{company_id}&type=eq.checkin',
    headers={**headers, 'Prefer': 'return=minimal'}
)
print("Cleared existing check-in templates")

rows = []
for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=1):
    if not row or not row[0]:
        continue

    phase_raw, month, week, days, checkin_type, initiator, participants, fmt, duration, dims_covered, focus, output = row[:12]

    phase = PHASE_MAP.get(phase_raw, phase_raw)
    if phase and isinstance(phase, str):
        phase = phase.lower().replace(' ', '_')

    primary_dim = 'fit'
    if dims_covered:
        primary_dim = DIM_MAP.get(str(dims_covered), 'fit')

    assigned_to = 'newcomer'
    if initiator:
        assigned_to = ASSIGNED_MAP.get(str(initiator), 'newcomer')

    rows.append({
        'company_id': company_id,
        'phase': phase,
        'week': str(week) if week else None,
        'days': str(days) if days else None,
        'dimension': primary_dim,
        'subdimension': str(dims_covered) if dims_covered else None,
        'activity': str(checkin_type) if checkin_type else 'Check-in',
        'who': str(participants) if participants else None,
        'estimated_time': str(duration) if duration else None,
        'builds_on': str(focus) if focus else None,
        'output': str(output) if output else None,
        'type': 'checkin',
        'assigned_to': assigned_to,
        'format': str(fmt) if fmt else None,
        'duration': str(duration) if duration else None,
        'sort_order': 1000 + i,  # After activities
        'active': True,
    })

print(f"Uploading {len(rows)} check-ins...")

batch_size = 50
for start in range(0, len(rows), batch_size):
    batch = rows[start:start + batch_size]
    r = requests.post(
        f'{SUPABASE_URL}/rest/v1/activity_templates',
        headers=headers,
        data=json.dumps(batch)
    )
    if r.status_code in (200, 201):
        print(f"  Batch {start+1}-{start+len(batch)}: OK")
    else:
        print(f"  Batch {start+1}-{start+len(batch)}: FAILED ({r.status_code})")
        print(f"  {r.text}")
        exit(1)

print(f"\nDone! {len(rows)} check-in templates uploaded.")
