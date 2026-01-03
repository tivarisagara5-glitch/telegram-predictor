require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// ================== BOTS ==================
const alex = new TelegramBot(process.env.ALEX_TOKEN, { polling: false });
const sidanta = new TelegramBot(process.env.SIDANTA_TOKEN, { polling: false });
const GROUP_ID = process.env.GROUP_ID;

// ================== EXACT USER TRENDS ==================
const trendAlex = [
  "S","S","S","B","B","B","S","B","S","B",
  "S","B","B","S","B","S","B","S","B","B","B","S","S","S"
];

const trendSidanta = [
  "S","S","S","B","B","B","S","B","S","B","S","B"
];

// ================== SETTINGS ==================
const START_PERIOD = 10001;
const PERIOD_MS = 60000;

// ================== IST TIME HELPERS ==================
function getISTNow() {
  const now = new Date();
  return new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
}

// ================== CORE LOGIC ==================
function getPredictionData() {
  const nowIST = getISTNow();

  let startTime = new Date(
    nowIST.getFullYear(),
    nowIST.getMonth(),
    nowIST.getDate(),
    5, 30, 0, 0
  );

  // Agar abhi 05:30 se pehle hai → previous day
  if (nowIST < startTime) {
    startTime.setDate(startTime.getDate() - 1);
  }

  const elapsedMinutes = Math.floor(
    (nowIST - startTime) / PERIOD_MS
  );

  const periodNumber = START_PERIOD + elapsedMinutes;

  const alexPick = trendAlex[elapsedMinutes % trendAlex.length];
  const sidantaPick = trendSidanta[elapsedMinutes % trendSidanta.length];

  return {
    period: periodNumber,
    alex: alexPick === "B" ? "BIG" : "SMALL",
    sidanta: sidantaPick === "B" ? "BIG" : "SMALL"
  };
}

// ================== MESSAGE ==================
function sendPredictions() {
  const d = getPredictionData();

  alex.sendMessage(
    GROUP_ID,
    `👋 Hello Users\n\n⏱ 1 Minute Predictor\n👤 Alex\n\n🕒 Period: ${d.period}\n🔮 Prediction: ${d.alex === "BIG" ? "🔥 BIG 🔥" : "🌈 SMALL 🌈"}`
  );

  sidanta.sendMessage(
    GROUP_ID,
    `👋 Hello Users\n\n⏱ 1 Minute Predictor\n👤 Sidanta\n\n🕒 Period: ${d.period}\n🔮 Prediction: ${d.sidanta === "BIG" ? "🔥 BIG 🔥" : "🌈 SMALL 🌈"}`
  );

  console.log(`SENT | P:${d.period} | Alex:${d.alex} | Sidanta:${d.sidanta}`);
}

// ================== EXACT MINUTE SYNC ==================
function startScheduler() {
  const now = getISTNow();
  const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

  setTimeout(() => {
    sendPredictions();                 // exact minute hit
    setInterval(sendPredictions, PERIOD_MS);
  }, delay);
}

// ================== START ==================
startScheduler();
console.log("🤖 Predictor synced to IST minute boundary");
