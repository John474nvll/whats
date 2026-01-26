import { Router } from "express";
import crypto from "crypto";

const router = Router();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_API_KEY = process.env.TWILIO_API_KEY || "";
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET || "";
const TWILIO_APP_SID = process.env.TWILIO_APP_SID || "";

function generateAccessToken(identity: string): { token: string; identity: string } | null {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET) {
    return null;
  }

  const header = {
    typ: "JWT",
    alg: "HS256",
    cty: "twilio-fpa;v=1"
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    jti: `${TWILIO_API_KEY}-${now}`,
    iss: TWILIO_API_KEY,
    sub: TWILIO_ACCOUNT_SID,
    exp: now + 3600,
    grants: {
      identity: identity,
      voice: {
        incoming: { allow: true },
        outgoing: { application_sid: TWILIO_APP_SID }
      }
    }
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", TWILIO_API_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest("base64url");

  return {
    token: `${base64Header}.${base64Payload}.${signature}`,
    identity
  };
}

router.get("/token", (req, res) => {
  const identity = (req.query.identity as string) || `user-${Date.now()}`;
  
  const result = generateAccessToken(identity);
  if (!result) {
    return res.status(503).json({
      error: "Twilio credentials not configured",
      configured: false
    });
  }
  
  res.json(result);
});

router.post("/voice", (req, res) => {
  const to = req.body.To || req.body.to;
  const from = req.body.From || req.body.from || process.env.TWILIO_PHONE_NUMBER;
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${from}">
    <Number>${to}</Number>
  </Dial>
</Response>`;

  res.type("text/xml").send(twiml);
});

router.post("/voice/incoming", (req, res) => {
  const from = req.body.From;
  const to = req.body.To;
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="es-MX">Bienvenido a SocialHub. Un momento por favor.</Say>
  <Dial>
    <Client>support-agent</Client>
  </Dial>
</Response>`;

  res.type("text/xml").send(twiml);
});

router.get("/status", (req, res) => {
  res.json({
    configured: !!(TWILIO_ACCOUNT_SID && TWILIO_API_KEY && TWILIO_API_SECRET),
    hasPhoneNumber: !!process.env.TWILIO_PHONE_NUMBER,
    hasAppSid: !!TWILIO_APP_SID
  });
});

export default router;
