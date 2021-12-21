const { createAudioResource, StreamType, entersState, AudioPlayerStatus, VoiceConnectionStatus, joinVoiceChannel } = require("@discordjs/voice")
const { Collection } = require("discord.js")
const { createDiscordJSAdapter } = require("./adapter")

module.exports = {
  voiceConnections: new Collection(),
  voicePlayers: new Collection(),
  playFile: (file, player) => {
    const resource = createAudioResource(file, {
      inputType: StreamType.Arbitrary,
    })

    player.play(resource)

    return entersState(player, AudioPlayerStatus.Playing, 5e3)
  },
  connectToChannel: async (channel) => {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: createDiscordJSAdapter(channel),
    })
  
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30e3)
      return connection
    } catch (error) {
      connection.destroy()
      throw error
    }
  }
}