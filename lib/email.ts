import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const FROM_EMAIL = 'onboarding@resend.dev' // Change to verified domain in production

/**
 * Send a newcomer invite email with their unique token link.
 */
export async function sendNewcomerInvite(
  to: string,
  newcomerName: string,
  companyName: string,
  managerName: string,
  token: string,
  language: 'en' | 'es' = 'en'
): Promise<void> {
  const inviteUrl = `${APP_URL}/invite/${token}`

  const subject = language === 'es'
    ? `Bienvenido/a a ${companyName} — Tu viaje de integración comienza aquí`
    : `Welcome to ${companyName} — Your socialization journey starts here`

  const html = language === 'es'
    ? getSpanishTemplate(newcomerName, companyName, managerName, inviteUrl)
    : getEnglishTemplate(newcomerName, companyName, managerName, inviteUrl)

  if (!resend) {
    console.log(`[Email] Would send to ${to}:`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Invite URL: ${inviteUrl}`)
    return
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  })
}

/**
 * Send a manager notification when a newcomer completes a check-in.
 */
export async function sendManagerNotification(
  to: string,
  managerName: string,
  newcomerName: string,
  monthNumber: number,
  language: 'en' | 'es' = 'en'
): Promise<void> {
  const subject = language === 'es'
    ? `${newcomerName} ha completado su check-in mensual`
    : `${newcomerName} completed their monthly check-in`

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
      <div style="background: #0A0A0A; border-radius: 12px 12px 0 0; padding: 20px 24px; display: flex; align-items: center; gap: 10px;">
        <div style="width: 28px; height: 28px; border-radius: 8px; background: #1A1A2E; display: flex; align-items: center; justify-content: center;">
          <span style="color: #FFF; font-weight: 800; font-size: 11px;">ob</span>
        </div>
        <span style="font-weight: 700; font-size: 16px; color: #FFFFFF;">onboard</span>
      </div>
      <div style="background: #FFFFFF; border: 1px solid #E2E0DA; border-top: none; border-radius: 0 0 12px 12px; padding: 28px 24px;">
        <p style="font-size: 14px; color: #0A0A0A;">Hi ${managerName},</p>
        <p style="font-size: 14px; color: #6B6B6B; line-height: 1.7;">
          <strong>${newcomerName}</strong> has completed their Month ${monthNumber} socialization check-in (both quantitative ratings and qualitative interview).
        </p>
        <p style="font-size: 14px; color: #6B6B6B; line-height: 1.7;">
          Review their scores and interview insights in your dashboard to check for divergence.
        </p>
        <a href="${APP_URL}/manager" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #0A0A0A; color: #FFFFFF; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px;">
          Go to dashboard
        </a>
      </div>
    </div>`

  if (!resend) {
    console.log(`[Email] Manager notification to ${to}: ${subject}`)
    return
  }

  await resend.emails.send({ from: FROM_EMAIL, to, subject, html })
}

// ─── Email templates ────────────────────────────────────────

function getEnglishTemplate(name: string, company: string, manager: string, url: string): string {
  return `
  <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: #0A0A0A; border-radius: 16px 16px 0 0; padding: 28px 32px; text-align: center;">
      <div style="display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <div style="width: 32px; height: 32px; border-radius: 9px; background: #1A1A2E; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: #FFF; font-weight: 800; font-size: 12px;">ob</span>
        </div>
        <span style="font-weight: 700; font-size: 18px; color: #FFFFFF;">onboard</span>
      </div>
      <h1 style="font-size: 22px; font-weight: 700; color: #FFFFFF; margin: 0;">Welcome, ${name}!</h1>
    </div>
    <div style="background: #FFFFFF; border: 1px solid #E2E0DA; border-top: none; border-radius: 0 0 16px 16px; padding: 32px;">
      <p style="font-size: 15px; color: #0A0A0A; line-height: 1.7; margin-bottom: 16px;">
        You've been invited to join <strong>${company}'s</strong> newcomer socialization program, managed by <strong>${manager}</strong>.
      </p>
      <p style="font-size: 14px; color: #6B6B6B; line-height: 1.7; margin-bottom: 24px;">
        Over the next 12 months, we'll track your journey using the FACET model — three facets of successful socialization: <strong>FIT</strong> (Role Clarity), <strong>ACE</strong> (Task Mastery), and <strong>TIE</strong> (Social Acceptance) — with monthly check-ins combining ratings and AI-guided interviews.
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${url}" style="display: inline-block; padding: 14px 32px; background: #0A0A0A; color: #FFFFFF; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
          Start my journey
        </a>
      </div>
      <p style="font-size: 11px; color: #AEABA3; text-align: center;">
        Or copy this link: ${url}
      </p>
      <hr style="border: none; border-top: 1px solid #F5F4F0; margin: 24px 0;" />
      <p style="font-size: 10px; color: #AEABA3; line-height: 1.6;">
        <strong>Privacy notice:</strong> Your data is processed by ${company} (controller) and Zephyron Consulting (processor).
        AI-powered interviews use Anthropic Claude. Data retained for 12 months.
        You may request access, correction, or deletion of your data at any time.
        By clicking the link above, you consent to participate in this program.
      </p>
    </div>
  </div>`
}

function getSpanishTemplate(name: string, company: string, manager: string, url: string): string {
  return `
  <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: #0A0A0A; border-radius: 16px 16px 0 0; padding: 28px 32px; text-align: center;">
      <div style="display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <div style="width: 32px; height: 32px; border-radius: 9px; background: #1A1A2E; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: #FFF; font-weight: 800; font-size: 12px;">ob</span>
        </div>
        <span style="font-weight: 700; font-size: 18px; color: #FFFFFF;">onboard</span>
      </div>
      <h1 style="font-size: 22px; font-weight: 700; color: #FFFFFF; margin: 0;">Bienvenido/a, ${name}!</h1>
    </div>
    <div style="background: #FFFFFF; border: 1px solid #E2E0DA; border-top: none; border-radius: 0 0 16px 16px; padding: 32px;">
      <p style="font-size: 15px; color: #0A0A0A; line-height: 1.7; margin-bottom: 16px;">
        Has sido invitado/a al programa de socialización de <strong>${company}</strong>, gestionado por <strong>${manager}</strong>.
      </p>
      <p style="font-size: 14px; color: #6B6B6B; line-height: 1.7; margin-bottom: 24px;">
        Durante los próximos 12 meses, seguiremos tu trayectoria en tres dimensiones — <strong>FIT</strong> (Claridad de Rol), <strong>ACE</strong> (Dominio de Tareas) y <strong>TIE</strong> (Aceptación Social) — con check-ins mensuales que combinan cuestionarios y entrevistas guiadas por IA.
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${url}" style="display: inline-block; padding: 14px 32px; background: #0A0A0A; color: #FFFFFF; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
          Comenzar mi viaje
        </a>
      </div>
      <p style="font-size: 11px; color: #AEABA3; text-align: center;">
        O copia este enlace: ${url}
      </p>
      <hr style="border: none; border-top: 1px solid #F5F4F0; margin: 24px 0;" />
      <p style="font-size: 10px; color: #AEABA3; line-height: 1.6;">
        <strong>Aviso de privacidad:</strong> Tus datos son tratados por ${company} (responsable) y Zephyron Consulting (encargado).
        Las entrevistas con IA utilizan Anthropic Claude. Datos conservados durante 12 meses.
        Puedes solicitar acceso, rectificación o supresión de tus datos en cualquier momento.
        Al hacer clic en el enlace, consientes participar en este programa.
      </p>
    </div>
  </div>`
}
