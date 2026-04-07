/**
 * Pseudonymisation layer for GDPR compliance.
 * Strips PII from text before sending to Claude, maps back after.
 * Direct copy from 360 app — generic PII stripping works for any domain.
 */

export type PseudoMap = {
  text: string
  restore: (aiOutput: string) => string
}

export function pseudonymise(
  text: string,
  names: string[],
  emails: string[],
  companyName?: string
): PseudoMap {
  const map: Record<string, string> = {}
  let result = text

  // Replace emails first (more specific patterns)
  const uniqueEmails = [...new Set(emails.filter(Boolean))]
  uniqueEmails.forEach((email, i) => {
    const token = `[EMAIL_${i + 1}]`
    map[token] = email
    result = result.replace(new RegExp(escapeRegex(email), 'gi'), token)
  })

  // Replace names (longest first to avoid partial replacements)
  const uniqueNames = [...new Set(names.filter(Boolean))].sort((a, b) => b.length - a.length)
  uniqueNames.forEach((name, i) => {
    const token = `[PERSON_${i + 1}]`
    map[token] = name
    result = result.replace(new RegExp(escapeRegex(name), 'gi'), token)
    // Also replace first name if multi-word
    const parts = name.split(/\s+/)
    if (parts.length > 1 && parts[0].length > 2) {
      const firstNameToken = `[PERSON_${i + 1}_FIRST]`
      map[firstNameToken] = parts[0]
      result = result.replace(new RegExp(`\\b${escapeRegex(parts[0])}\\b`, 'gi'), firstNameToken)
    }
  })

  // Replace company name
  if (companyName) {
    const token = '[COMPANY]'
    map[token] = companyName
    result = result.replace(new RegExp(escapeRegex(companyName), 'gi'), token)
  }

  const restore = (aiOutput: string): string => {
    let restored = aiOutput
    for (const [token, original] of Object.entries(map)) {
      restored = restored.replace(new RegExp(escapeRegex(token), 'g'), original)
    }
    return restored
  }

  return { text: result, restore }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
