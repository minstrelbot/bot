const { fn } = require("../../config.js")
const stories = require("../../stories.js")
module.exports = {
  name: "start",
}

module.exports.run = async (message, args, client) => {
  let cancel = false
  if (!message.member.voice.channel?.type == "stage") return message.reply("Please join a stage channel before you start a story!")
  let connection = await message.member.voice.channel.join()
  if (message.member.voice.channel.type == "stage")
    await connection.voice.setSuppressed(false).catch(() => {
      cancel = true
      message.channel.send("I am not a Stage Moderator! I am not able to speak in this stage channel")
    })
  if (cancel) return
  let story = args.join(" ")
  client.emit("storyStart", message.channel.id, story, {})
}
