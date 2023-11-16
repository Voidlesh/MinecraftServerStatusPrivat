const Discord = require("discord.js");
const util = require("minecraft-server-util");
const config = require("../../config.json");

module.exports = {
  name: "ready",
  once: "true",
  async execute(client) {
    console.log("Bot has come online.");

    let ip = config.ip;
    let port = config.port;

    // Server status updates every 30 seconds
    let channel = client.channels.cache.get("951874671626846250");

    setInterval(() => {
      channel.messages.fetch("1003747771284729866").then((message) => {
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
                  name: "<:arrow:956965096444280852> Online Spieler",
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

            const row = new Discord.ActionRowBuilder()
              .addComponents(
                new Discord.ButtonBuilder()
                  .setCustomId("raw")
                  .setLabel("Zeige normale motd")
                  .setStyle(Discord.ButtonStyle.Primary)
                  .setEmoji("<:arrow:956965096444280852>")
              )
              .addComponents(
                new Discord.ButtonBuilder()
                  .setCustomId("html")
                  .setLabel("Zeige motd in html")
                  .setStyle(Discord.ButtonStyle.Primary)
                  .setEmoji("<:arrow:956965096444280852>")
              )
              .addComponents(
                new Discord.ButtonBuilder()
                  .setCustomId("info")
                  .setLabel("Erstellt von Voidleshᵈᵉᵛ")
                  .setStyle(Discord.ButtonStyle.Success)
                  .setEmoji("<:arrow:956965096444280852>")
                  .setDisabled(true)
              );

            message.edit({
              files: [
                {
                  attachment: Buffer.from(
                    response.favicon.split(",")[1],
                    "base64"
                  ),
                  name: "favicon.png",
                },
              ],
              embeds: [Embed],
              components: [row],
            });
          })
          .catch((error) => {
            console.log("offline");
            console.log(error);
          });
      });
    }, 30000);
  },
};
