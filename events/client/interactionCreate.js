module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);

      if (!command) return console.log("no command");

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: "Etwas ist schief gelaufen. Versuche es später erneut!",
          ephemeral: true,
        });
      }
    }
  },
};
