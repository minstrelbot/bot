const Discord = require("discord.js")
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const stories = require("../stories.js")
const matter = require("gray-matter")

module.exports = (client) => {
  client.on("storyStart", async (channel, storyID, options) => {
    if (!storyID) return client.channels.cache.get(channel).send("No story given!")
    let embed = new MessageEmbed().setColor(0xa7dca7)
    let story = stories.get(storyID)
    if(!story) return client.channels.cache.get(channel).send("Story not found!")
    embed.setDescription(story.description)
    embed.setThumbnail(story.icon ? story.icon : client.user.avatarURL())
    let buttons = new MessageActionRow()
    buttons.addComponents(new MessageButton().setStyle("PRIMARY").setLabel("Begin").setCustomID(`storyPart:${story.id};intro`))
    client.channels.cache.get(channel).send(`Story: **${story.name}**`, { embed, components: [buttons] })
  })
  // client.on("storyIntro", async (interaction, storyID, options) => {
  //   if (!storyID) throw new Error("No story given!")
  //   let embed = new MessageEmbed().setColor(0xa7dca7)
  //   let story = stories.get(storyID)
  //   let intro = matter.read(story.folder + "/intro.md")
  //   console.log(intro)
  //   embed.setDescription(intro.content)
  //   embed.setThumbnail(story.icon ? story.icon : client.user.avatarURL())
  //   let buttons = generateButtons(intro, story)
  //   interaction.update(`Story: **${story.name}**`, { embed, components: buttons })
  // })
  client.on("storyPart", async (interaction, storyID, part) => {
    let embed = new MessageEmbed().setColor(0xa7dca7)
    let story = stories.get(storyID)
    if (!story) return interaction.update(`Story ${storyID} not found! Contact the developers for assistance`)
    console.log(story, storyID)
    let section = matter.read(story.folder + "/" + part + ".md")
    console.log(section)
    embed.setDescription(section.content)
    embed.setThumbnail(story.icon ? story.icon : client.user.avatarURL())
    let buttons = generateButtons(section, story)
    interaction.update(`Story: **${story.name}**`, { embeds: [embed], components: buttons })
  })
}

const generateButtons = (section, story) => {
  let buttons = []
  section.data["Links"]?.forEach(x => {
    let butt = new MessageButton().setStyle("SUCCESS").setLabel(x.name).setCustomID(`storyPart:${story.id};${x.id}`)
    buttons.push(butt)
  })
  if(section.data["Flee"]) buttons.push(new MessageButton().setStyle("DANGER").setLabel("Flee").setCustomID(`storyPart:${story.id};flee`))
  if(section.data["End"]) buttons.push(new MessageButton().setStyle("SECONDARY").setLabel("Continue").setCustomID(`storyPart:${story.id};end`))
  const row = new MessageActionRow()
  buttons.forEach(x => row.addComponents(x))
  return buttons.length > 0 ? [row] : []
}
