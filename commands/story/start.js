// const { fn } = require("../../config.js")
// const stories = require("../../stories.js")
// module.exports = {
//   name: "start",
// }

// module.exports.run = async (message, args, client) => {
//   if (!message.member.voice.channel?.type == "stage") return message.reply("Please join a stage channel to start a story!")

//     connection = await message.member.voice.channel.join()
//     if (message.member.voice.channel.type == "stage") connection.voice.setSuppressed(false);
//   }
//   let story = args.join(" ")
//   client.emit("storyStart", message.channel.id, story, {})
// }
