const { createAudioPlayer } = require("@discordjs/voice")
const storyCol = require("../../stories")
const { connectToChannel, voicePlayers, voiceConnections } = require("../../voice")
module.exports = {
  command: {
    name: "start",
    description: "Start a story.",
    options: [
      {
        type: "STRING",
        name: "story",
        description: "The story you want to play",
        required: true,
        autocomplete: true,
      },
    ],
  },
}

module.exports.run = async (interaction, client) => {
  await interaction.deferReply()

  if(interaction.guild.me.voice.channel) return interaction.editReply(`I'm already in a running story.`)
  const story = storyCol.get(interaction.options.getString("story"))
  
  if (interaction.member.voice.channel?.type != "GUILD_STAGE_VOICE") return interaction.editReply("Please join a stage channel before you start a story!")
  let connection = await connectToChannel(interaction.member.voice.channel)
  if (!connection) return interaction.editReply("I couldn't join the stage channel!")
  await interaction.guild.me.voice.setSuppressed(false).catch(() => {
    return interaction.editReply("I am not a Stage Moderator! I am not able to speak in this stage channel")
  })

  console.log(interaction.guild.me.voice.channel.id)

  const player = voicePlayers.get(interaction.guild.id)
  if(!player) player = createAudioPlayer()

  connection.subscribe(player)

  voicePlayers.set(interaction.guild.id, player)
  voiceConnections.set(interaction.guild.id, connection)
  interaction.editReply("Starting story...")

  client.emit("storyStart", interaction.channel.id, story.id, {})
}
