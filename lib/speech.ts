"use client";

/**
 * Vorlesefunktion für den Kinder-Modus. Kinder, die noch nicht lesen können,
 * sollen die App ohne Erwachsene bedienen können.
 */

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string): void {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.92;
    utterance.pitch = 1.15;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Sprachausgabe ist ein Extra – ohne sie bleibt die App voll bedienbar.
  }
}

export function stopSpeaking(): void {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignorieren
  }
}
