require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// ================== BOTS ==================
const alex = new TelegramBot(process.env.ALEX_TOKEN, { polling: false });
const sidanta = new TelegramBot(process.env.SIDANTA_TOKEN, { polling: false });

const GROUP_ID = process.env.GROUP_ID;

// ================== EXACT USER GIVEN TRENDS ==================
const trendAlex = [
  "S","S","S","B","B","B","S","B","S","B",
  "S","B","B","S","B","S","B","S","B","B","B","S","S","S"
];

const trendSidanta = [
  "S","S","S","B","B","B","S","B","S","B","S","B"
];

// ================== PERIOD SETTINGS ==================
const START_PERIOD = 10001;
const PERIOD_TIME = 60000; // 1 minute

// ================== CORE LOGIC ==================
function getPredictionData() {
  const now = new Date();

  // Game start time = 05:30 AM
  let startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    5, 30, 0
  );

  // Agar abhi 05:30 se pehle hai → previous day
  if (now < startTime) {
    startTime.setDate(startTime.getDate() - 1);
  }

  const elapsed = Math.floor((now - startTime) / PERIOD_TIME);
  const periodNumber = START_PERIOD + elapsed;

  const alexPick = trendAlex[elapsed % trendAlex.length];
  const sidantaPick = trendSidanta[elapsed % trendSidanta.length];

  return {
    period: String(periodNumber).slice(-3),
    alex: alexPick === "B" ? "BIG" : "SMALL",
    sidanta: sidantaPick === "B" ? "BIG" : "SMALL"
  };
}

// ================== MESSAGE SENDER ==================
function sendPredictions() {
  const d = getPredictionData();

  const alexMsg = `
💥💥WinGo 1 Minute 💥💥
    🦸Alex Bhai

🕒 Period: ${d.period}
🔮 Prediction: ${d.alex === "BIG" ? "🔥 BIG 🔥" : "🌈 SMALL 🌈"}
`;

  const sidantaMsg = `
🤹Sidanta Bhai

🕒 Period: ${d.period}
🔮 Prediction: ${d.sidanta === "BIG" ? "🔥 BIG 🔥" : "🌈 SMALL 🌈"}

✅ Alex & Sidanta dono ka result dekho
🎯 Jo sahi aaye — usko FOLLOW karo
`;

  alex.sendMessage(GROUP_ID, alexMsg);
  sidanta.sendMessage(GROUP_ID, sidantaMsg);

  console.log(
    `1MIN | P:${d.period} | Alex:${d.alex} | Sidanta:${d.sidanta}`
  );
}

// ================== AUTO RUN ==================
sendPredictions();          // start hote hi ek baar
setInterval(sendPredictions, PERIOD_TIME);

console.log("🤖 1-Minute Predictor (Correct Trend) Running...");
