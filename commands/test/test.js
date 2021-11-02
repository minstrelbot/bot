const { createAudioPlayer, createAudioResource, NoSubscriberBehavior, joinVoiceChannel, AudioPlayerStatus } = require("@discordjs/voice")

module.exports = {
  command: {
    name: "test",
    description: "Test voice",
    defaultPermission: true,
  },
  permissions: [],
}

module.exports.run = async (interaction, client) => {
  interaction.reply("Queued")
  let connection
  if (!interaction.member.voice.channel) return
  connection = await joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  })
  if (interaction.member.voice.channel.type == "stage") guild.me.voice.setSuppressed(false)

  const player = await createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  })

  await connection.subscribe(player)

  const resource = createAudioResource("./piano.mp3")
  player.play(resource)

  player.on(AudioPlayerStatus.Playing, () => {
    console.log("The audio player has started playing!")
  })

  player.on(AudioPlayerStatus.AutoPaused, () => {
    console.log("The audio player has stopped playing!")
  })
}
