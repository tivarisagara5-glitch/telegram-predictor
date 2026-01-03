require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// ================== BOTS ==================
const alex = new TelegramBot(process.env.ALEX_TOKEN, { polling: false });
const sidanta = new TelegramBot(process.env.SIDANTA_TOKEN, { polling: false });

const GROUP_ID = process.env.GROUP_ID;

// ================== TRENDS ==================
const trend1 = [
  "S","S","S","B","B","B","S","B","S","B",
  "S","B","B","S","B","S","B","S","B","B","B","S","S","S"
];

const trend2 = [
  "S","S","S","B","B","B","S","B","S","B","S","B"
];

// ================== PERIOD SETTINGS ==================
const START_PERIOD = 50001;
const PERIOD_TIME = 30000; // 30 sec

// ================== CORE LOGIC ==================
function getPredictionData() {
  const now = new Date();

  // Game start time 05:30 AM
  let startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    5, 30, 0
  );

  // If current time < 05:30, go to previous day
  if (now < startTime) {
    startTime.setDate(startTime.getDate() - 1);
  }

  const elapsedPeriods = Math.floor((now - startTime) / PERIOD_TIME);
  const periodNumber = START_PERIOD + elapsedPeriods;

  const alexRaw = trend1[elapsedPeriods % trend1.length];
  const sidantaRaw = trend2[elapsedPeriods % trend2.length];

  return {
    period: String(periodNumber).slice(-3),
    alex: alexRaw === "B" ? "BIG" : "SMALL",
    sidanta: sidantaRaw === "B" ? "BIG" : "SMALL"
  };
}

// ================== MESSAGE SENDER ==================
function sendPredictions() {
  const d = getPredictionData();

  const alexMessage = `
  💫 WinGo 30 Second 💥
  🧛Alex
👋 Hello Users

🕒 Period: ${d.period}
🔮 Prediction: ${d.alex === "BIG" ? "🔥 BIG 🔥" : "🌈 SMALL 🌈"}

✅ Alex & Sidanta dono ke prediction dekho
🎯 Jiska sahi aaye — usko FOLLOW karo
`;

  const sidantaMessage = `
  🤹 Sidanta
👋 Hello Users

🕒 Period: ${d.period}
🔮 Prediction: ${d.sidanta === "BIG" ? "🔥 BIG 🔥" : "🌈 SMALL 🌈"}

✅ Alex & Sidanta dono ke prediction dekho
🎯 Jiska sahi aaye — usko FOLLOW karo
`;

  alex.sendMessage(GROUP_ID, alexMessage);
  sidanta.sendMessage(GROUP_ID, sidantaMessage);

  console.log(
    `Sent | Period ${d.period} | Alex: ${d.alex} | Sidanta: ${d.sidanta}`
  );
}

// ================== AUTO RUN ==================
sendPredictions(); // run once on start
setInterval(sendPredictions, PERIOD_TIME);

console.log("🤖 Alex & Sidanta bots running successfully...");
