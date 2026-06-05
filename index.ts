import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

interface MatchData {
  matchType: string;
  player1: string;
  score1: number;
  player2: string;
  score2: number;
  map: string;
}

function parseMatch(input: string): MatchData | null {
  const parts = input.trim().split(/\s+/);

  if (parts.length < 6) {
    return null;
  }

  const matchType = parts[0];
  const player1 = parts[1];
  const score1 = Number(parts[2]);
  const player2 = parts[3];
  const score2 = Number(parts[4]);
  const map = parts.slice(5).join(" ");

  if (Number.isNaN(score1) || Number.isNaN(score2)) {
    return null;
  }

  return {
    matchType,
    player1,
    score1,
    player2,
    score2,
    map,
  };
}

function buildMessage(game: string, data: MatchData): string {
  const player1Won = data.score1 >= data.score2;

  const winner = player1Won
    ? `${data.player1} ${data.score1}`
    : `${data.player2} ${data.score2}`;

  const loser = player1Won
    ? `${data.player2} ${data.score2}`
    : `${data.player1} ${data.score1}`;

  return `
═══════════════
🎮 ${game}
═══════════════

⚔️ ${data.matchType}

🥇 ${winner}
🥈 ${loser}

🗺️ ${data.map}

═══════════════
`.trim();
}

bot.command("cs1", async (ctx) => {
  const args = ctx.message.text.replace(/^\/cs1(@\w+)?\s*/, "");

  const data = parseMatch(args);

  if (!data) {
    await ctx.reply(
      "Usage:\n/cs1 1v1 melodyxpot 36 jacky 16 $2000$"
    );
    return;
  }

  await ctx.reply(buildMessage("Counter-Strike 1", data));
});

bot.command("cs2", async (ctx) => {
  const args = ctx.message.text.replace(/^\/cs2(@\w+)?\s*/, "");

  const data = parseMatch(args);

  if (!data) {
    await ctx.reply(
      "Usage:\n/cs2 1v1 melodyxpot 13 jacky 8 Mirage"
    );
    return;
  }

  await ctx.reply(buildMessage("Counter-Strike 2", data));
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

console.log("Bot started");