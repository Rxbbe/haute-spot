// EmailJS instellingen (emailjs.com). Vul de waarden in na het aanmaken van je account.
// Zolang ze leeg zijn, opent het formulier gewoon het mailprogramma van de bezoeker.
var HS_MAIL = {
  publicKey: "8D7e7L747R3QXIo1y",
  serviceId: "service_w5qnfpa",
  templateIntern: "template_k2imxh4",   // gebruikt assets/email/aanvraag-intern.html (mail naar jou)
  templateKlant: "template_s0sfvnw",    // gebruikt assets/email/bevestiging-klant.html (mail naar de aanvrager)
  recaptchaSiteKey: "6Ld1jvAtAAAAAFcuZ5Mpv4qUltJRFZc_DfW2ZnRl",  // reCAPTCHA v2 (checkbox) site key; de secret key vul je in bij EmailJS
  maxPerUur: 3,          // maximaal aantal aanvragen per bezoeker per uur
  wachttijdSec: 60,      // minimale tijd tussen twee aanvragen
  naarAdres: "robbe.rooijakkers@gmail.com"   // testadres; zet later terug naar lipkenssd1@gmail.com
};
