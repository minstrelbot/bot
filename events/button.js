const Discord = require("discord.js")

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
    console.log(interaction.customId)
    //interaction.reply("Success! Proceeding to run trigger " + interaction.customId + " on " + interaction.message.id, { ephemeral: true })
    let data = interaction.customId.split(":")
    let cmd = data[0]
    let args = data[1]
    args = args.split(";")
    console.log(data, args)
    if (cmd == "storyPart") {
      let storyID = args[0]
      let action = args[1]
      client.emit("storyPart", interaction, storyID, action, {voiceDone: false})
    }
  })
}
