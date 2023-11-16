const {
  GatewayIntentBits,
  Client,
  REST,
  Routes,
  ButtonStyle,
} = require("discord.js");

const Discord = require("discord.js");

const fs = require("fs");

const { QuickDB } = require("quick.db");
const db = new QuickDB();

const config = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
client.commands = new Discord.Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.token =
  "MTAwMzY4NjAyNzU1NjI5ODgyMw.GPkNX4.LZ9ML2H0mKF1rpxRg5pZGncyazxiujmtFS1ZM4";

const PREFIX = "!";

const util = require("minecraft-server-util");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton) return;

  let ip = config.ip;
  let port = config.port;

  if (interaction.customId === "raw") {
    console.log(ip, port);
    util.status(String(ip), parseInt(port) || 25565).then((response) => {
      interaction.reply({
        content: "```" + response.motd.raw + "```",
        ephemeral: true,
      });
    });
  } else if (interaction.customId === "html") {
    util.status(String(ip), parseInt(port) || 25565).then((response) => {
      interaction.reply({
        content: "```html\n" + response.motd.html + "```",
        ephemeral: true,
      });
    });
  } else return;
});

client.handleEvents();
client.handleCommands();

client.login(client.token);
