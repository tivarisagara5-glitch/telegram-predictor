require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const alex = new TelegramBot(process.env.ALEX_TOKEN);
const sidanta = new TelegramBot(process.env.SIDANTA_TOKEN);

const GROUP_ID = process.env.GROUP_ID;

const trend1 = ["S","S","S","B","B","B","S","B","S","B","S","B","B","S","B","S","B","S","B","B","B","S","S","S"];
const trend2 = ["S","S","S","B","B","B","S","B","S","B","S","B"];

const START_PERIOD = 50001;

function getData() {
  const now = new Date();
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 30, 0);
  if (now < start) start.setDate(start.getDate() - 1);

  const elapsed = Math.floor((now - start) / 30000);
  const period = START_PERIOD + elapsed;

  return {
    period: String(period).slice(-3),
    alex: trend1[elapsed % trend1.length] === "B" ? "BIG" : "SMALL",
    sidanta: trend2[elapsed % trend2.length] === "B" ? "BIG" : "SMALL"
  };
}

setInterval(() => {
  const d = getData();
  alex.sendMessage(GROUP_ID, `🧠 Alex\nP: ${d.period}\n🎯 ${d.alex}`);
  sidanta.sendMessage(GROUP_ID, `🧠 Sidanta\nP: ${d.period}\n🎯 ${d.sidanta}`);
}, 30000);

console.log("Bots running...");
  
