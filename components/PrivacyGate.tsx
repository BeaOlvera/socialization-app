"use client";
import { useState } from "react";

export function PrivacyGate({ onAccept, language = "en" }: { onAccept: () => void; language?: "en" | "es" }) {
  const [accepted, setAccepted] = useState(false);

  const content = language === "es" ? {
    title: "Aviso de privacidad",
    purpose: "Este check-in incluye una entrevista cualitativa guiada por IA para explorar tu experiencia de integración.",
    ai: "Tus respuestas serán procesadas por un modelo de IA (Anthropic Claude) para generar insights sobre tu socialización.",
    confidential: "Tus respuestas individuales son confidenciales. Solo se comparten insights agregados con tu manager y RRHH.",
    retention: "Los datos se conservan durante 12 meses desde la finalización y luego se eliminan automáticamente.",
    rights: "Tienes derecho a acceder, rectificar o eliminar tus datos en cualquier momento contactando a RRHH.",
    consent: "Acepto participar en esta entrevista guiada por IA y consiento el procesamiento de mis respuestas.",
    button: "Aceptar y continuar",
  } : {
    title: "Privacy Notice",
    purpose: "This check-in includes an AI-guided qualitative interview to explore your socialization experience in depth.",
    ai: "Your responses will be processed by an AI model (Anthropic Claude) to generate insights about your integration journey.",
    confidential: "Your individual responses are confidential. Only aggregated insights are shared with your manager and HR.",
    retention: "Data is retained for 12 months from completion and then automatically deleted.",
    rights: "You have the right to access, rectify, or delete your data at any time by contacting HR.",
    consent: "I agree to participate in this AI-guided interview and consent to the processing of my responses.",
    button: "Accept and continue",
  };

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E0DA", padding: "28px 24px", maxWidth: 520 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{content.title}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {[content.purpose, content.ai, content.confidential, content.retention, content.rights].map((text, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 6, height: 6, borderRadius: 99, background: "#1A1A2E", marginTop: 6, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={e => setAccepted(e.target.checked)}
          style={{ marginTop: 3, width: 16, height: 16, accentColor: "#1A1A2E" }}
        />
        <span style={{ fontSize: 13, color: "#0A0A0A", lineHeight: 1.5 }}>{content.consent}</span>
      </label>

      <button
        onClick={() => accepted && onAccept()}
        disabled={!accepted}
        style={{
          width: "100%", padding: "12px", borderRadius: 10, border: "none",
          cursor: accepted ? "pointer" : "not-allowed",
          background: accepted ? "#0A0A0A" : "#E2E0DA",
          color: accepted ? "#FFFFFF" : "#AEABA3",
          fontSize: 14, fontWeight: 600,
        }}
      >
        {content.button}
      </button>
    </div>
  );
}
