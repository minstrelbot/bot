const Discord = require("discord.js")
const db = require("../../db.js")
const shuffle = require("shuffle-array")
const config = require("../../config")
const stories = require("../../stories.js")
const fs = require("fs")
const matter = require("gray-matter")

module.exports = {
  command: {
    name: "info",
    description: "Get information for a story.",
    options: [
      {
        type: "STRING",
        name: "story",
        description: "The story you want information for",
        required: true,
        autocomplete: true
      },
    ],
  },
}

module.exports.run = async (interaction, client) => {
  let story = stories.get(interaction.options.getString("story"))
  let embed = new Discord.MessageEmbed().setTitle(story.name).setDescription(story.description).setColor(0xa7dca7).setThumbnail(story.image ?? client.user.avatarURL())
  if(story.author) embed.setFooter("Written by " + story.author)
  interaction.reply({embeds: [embed]})
}
