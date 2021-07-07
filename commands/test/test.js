const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: "test",
  aliases: [],
}

module.exports.run = async (message, args, client) => {
  let connection 
  if (message.member.voice.channel) {
    connection = await joinVoiceChannel({
      channelId: message.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
    if (message.member.voice.channel.type == "stage") connection.voice.setSuppressed(false);
  }
  let dispatcher = connection.play("/home/sd/path/stories/onceuponatest/audio/piano.mp3")

  dispatcher.on("start", () => {
    console.log("audio.mp3 is now playing!")
  })

  dispatcher.on("finish", () => {
    console.log("audio.mp3 has finished playing!")
  })
}
