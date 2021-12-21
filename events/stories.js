const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const stories = require("../stories.js")
const matter = require("gray-matter")
const { playFile, voiceConnections, voicePlayers } = require("../voice.js")
const { AudioPlayerStatus } = require("@discordjs/voice")

module.exports = (client) => {
  client.on("storyStart", async (channel, storyID, options) => {
    if (!storyID) return client.channels.cache.get(channel).send("No story given!")
    let embed = new MessageEmbed().setColor(0xa7dca7)
    let story = stories.get(storyID)
    if (!story) return client.channels.cache.get(channel).send("Story not found!")
    embed.setDescription(story.description)
    embed.setThumbnail(story.icon ? story.icon : client.user.avatarURL())
    let buttons = new MessageActionRow()
    buttons.addComponents(new MessageButton().setStyle("PRIMARY").setLabel("Begin").setCustomId(`storyPart:${story.id};intro`))
    client.channels.cache.get(channel).send({ embeds: [embed], components: [buttons] })
  })

  client.on("storyPart", async (interaction, storyID, part, options) => {
    let story = stories.get(storyID)
    if (!story) return interaction.update(`Story ${storyID} not found! Contact the developers for assistance`)
    console.log(story, storyID)
    let section = matter.read(story.folder + "/" + part + ".md")
    console.log(section)
    //interaction.message.delete()
    if (section.data["Audio"] && section.data["Audio"] == options?.voiceDone) {
      console.log(options, section.data)
      let embed = new MessageEmbed().setColor(0xa7dca7)
      embed.setDescription(section.content)
      embed.setThumbnail(story.icon ? story.icon : client.user.avatarURL())
      let buttons = generateButtons(section, story)
      interaction.editReply({ embeds: [embed], content: `<@${interaction.member.id}>`, components: buttons })
    } else {
      interaction.deferReply()
      client.emit("storyVoice", interaction, storyID, part, {})
      console.log("Running voice")
    }

    if(section.data["End"]) {
        let connection = voiceConnections.get(interaction.guild.id)
        connection.destroy()
        voiceConnections.delete(interaction.guild.id)
    }
  })

  client.on("storyVoice", async (interaction, storyID, part, options) => {
    let story = stories.get(storyID)
    let section = matter.read(story.folder + "/" + part + ".md")
    let connection = voiceConnections.get(interaction.guild.id)
    let player = voicePlayers.get(interaction.guild.id)
    if (!connection) return interaction.channel.send("I couldn't find a voice connection! Please restart the story.")
    if (!player) return interaction.channel.send("I couldn't find a voice player! Please restart the story.")

    playFile(story.folder + "/audio/" + section.data["Audio"] + ".mp3", player)
    const storyVoiceWatch = (oldState, newState) => {
      console.log(oldState, newState)
      if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
        console.log("Starting next part")
        player.off("stateChange", storyVoiceWatch)
        client.emit("storyPart", interaction, storyID, part, { voiceDone: section.data["Audio"] })
      } else if (newState.status === AudioPlayerStatus.Playing) {
        console.log(story.folder + "/audio/" + part + ".mp3 is now playing!")
      }
    }
    player.on("stateChange", storyVoiceWatch)
  })
}

const generateButtons = (section, story) => {
  let buttons = []
  section.data["Links"]?.forEach((x) => {
    let butt = new MessageButton().setStyle("SUCCESS").setLabel(x.name).setCustomId(`storyPart:${story.id};${x.id}`)
    buttons.push(butt)
  })
  if (section.data["Flee"]) buttons.push(new MessageButton().setStyle("DANGER").setLabel("Flee").setCustomId(`storyPart:${story.id};flee`))
  if (section.data["End"]) buttons.push(new MessageButton().setStyle("SECONDARY").setLabel("Continue").setCustomId(`storyPart:${story.id};end`))
  const row = new MessageActionRow()
  buttons.forEach((x) => row.addComponents(x))
  return buttons.length > 0 ? [row] : []
}
