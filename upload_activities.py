"""
Upload activities from Socialization_Activity_Calendar.xlsx to Supabase activity_templates table.
Run: python upload_activities.py
"""

import openpyxl
import requests
import json

# Read credentials from .env.local
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

# First get the company ID
r = requests.get(
    f'{SUPABASE_URL}/rest/v1/companies?select=id,name',
    headers=headers
)
companies = r.json()
print(f"Companies found: {companies}")

if not companies:
    print("ERROR: No companies found. Run seed.ts first: npx tsx seed.ts")
    exit(1)

company_id = companies[0]['id']
print(f"Using company: {companies[0]['name']} ({company_id})")

# Phase name mapping (Excel -> DB)
PHASE_MAP = {
    'Pre-arrival': 'pre_arrival',
    'Arrival': 'arrival',
    'Integration': 'integration',
    'Adjustment': 'adjustment',
    'Stabilization': 'stabilization',
    'Embedding': 'embedding',
}

# Dimension mapping
DIM_MAP = {
    'FIT': 'fit',
    'ACE': 'ace',
    'TIE': 'tie',
}

# Read Excel
wb = openpyxl.load_workbook('Socialization_Activity_Calendar.xlsx')
ws = wb.active

rows = []
for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=1):
    phase_raw, week, days, dim_raw, subdim, activity, who, est_time, builds_on, output = row

    phase = PHASE_MAP.get(phase_raw, phase_raw)
    dimension = DIM_MAP.get(dim_raw, dim_raw)

    # Clean builds_on (remove emoji placeholder)
    if builds_on and builds_on.strip() in ('—', '–', '-', '\u2014', '\u2013'):
        builds_on = None

    rows.append({
        'company_id': company_id,
        'phase': phase,
        'week': str(week) if week is not None else None,
        'days': str(days) if days is not None else None,
        'dimension': dimension,
        'subdimension': subdim,
        'activity': activity,
        'who': who,
        'estimated_time': est_time,
        'builds_on': builds_on,
        'output': output,
        'sort_order': i,
        'active': True,
    })

print(f"\nUploading {len(rows)} activities...")

# Upload in batches of 50
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

print(f"\nDone! {len(rows)} activities uploaded to activity_templates.")
