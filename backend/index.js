const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const { KJUR } = require("jsrsasign");

const app = express();
const PORT = process.env.PORT || 3000;

// Substitua pelo seu email do calendário
const TARGET_CALENDAR_EMAIL = "matheusmschumacher@gmail.com";

// =============================================
// CORS CONFIG CORRETA PARA VERCEL + RENDER
// =============================================
app.use(cors({
  origin: "https://matheus-schumacher.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(bodyParser.json());

// Carrega credentials.json via variável de ambiente
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Função para gerar JWT e pegar access token
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/calendar.events",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const jwt = KJUR.jws.JWS.sign(
    "RS256",
    JSON.stringify(header),
    JSON.stringify(payload),
    credentials.private_key
  );

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(jwt)}`
  });

  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok) throw new Error("Falha ao obter access_token: " + JSON.stringify(tokenJson));
  return tokenJson.access_token;
}

// =============================================
// Rota para criar evento
// =============================================
app.post("/agendar", async (req, res) => {
  console.log("📅 Requisição recebida em /agendar:", req.body);

  try {
    const { data, hora, mensagem } = req.body;
    if (!data || !hora) {
      return res.status(400).json({ error: "Data e hora são obrigatórios" });
    }

    const start = new Date(`${data}T${hora}:00`);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ error: "Não é possível agendar para datas passadas" });
    }

    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const evento = {
      summary: "Entrevista (Agendamento via Portfólio)",
      description: mensagem || "",
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() }
    };

    const token = await getAccessToken();

    const eventoRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(TARGET_CALENDAR_EMAIL)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(evento)
      }
    );

    const json = await eventoRes.json();
    if (!eventoRes.ok) return res.status(500).json({ error: json });

    res.json({ success: true, evento: json });
  } catch (err) {
    console.error("❌ Erro em /agendar:", err);
    res.status(500).json({ error: err.message || "Erro desconhecido" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend rodando na porta ${PORT}`);
});
app.options("/agendar", cors({
  origin: "https://matheus-schumacher.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
