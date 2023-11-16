const { SlashCommandBuilder } = require("discord.js");
const util = require("minecraft-server-util");
const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("returns the status of a minecraft server")
    .addStringOption((option) =>
      option
        .setName("serverip")
        .setDescription("The Server IP to connect to the server")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("serverport")
        .setDescription("The Server Port to connect to the server")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    let ip = interaction.options.get("serverip").value;
    let port;
    if (interaction.options.get("serverport")) {
      port = interaction.options.get("serverport").value;
    } else port = 25565;

    util
      .status(ip, parseInt(port))
      .then((response) => {
        const Embed = new Discord.EmbedBuilder()
          .setTitle("Server Status")
          .setColor("#0dff00")
          .setDescription("Server ist online!")
          .setThumbnail("attachment://favicon.png")
          .addFields(
            {
              name: "<:arrow:956965096444280852> Server IP",
              value: String(ip) + ":" + String(port),
              inline: true,
            },
            {
              name: "<:arrow:956965096444280852> Server Version",
              value: String(response.version.name),
              inline: true,
            },
            {
              name: "<:arrow:956965096444280852> Online Players",
              value:
                String(response.players.online) +
                "/" +
                String(response.players.max),
              inline: true,
            },
            {
              name: "<:arrow:956965096444280852> Motd",
              value: "```" + response.motd.clean + "```",
            }
          );

        interaction.reply({
          files: [
            {
              attachment: Buffer.from(response.favicon.split(",")[1], "base64"),
              name: "favicon.png",
            },
          ],
          embeds: [Embed],
          ephemeral: true,
        });
      })
      .catch((error) => {
        console.log("offline");
        console.log(error);
      });
  },
};
