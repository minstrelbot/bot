const Discord = require("discord.js")
const stories = require("../stories")

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isAutocomplete()) return
    console.log(interaction.options.getString("story"))
    if (interaction.commandName === "info" || interaction.commandName === "start") {
      let query = interaction.options.getString("story").toLowerCase()
      let response = []
      stories.forEach((x) => {
        if (!x.name.toLowerCase().startsWith(query)) return
        response.push({ name: x.name, value: x.id })
      })
      console.log(response)
      interaction.respond(response)
    }
  })
}
