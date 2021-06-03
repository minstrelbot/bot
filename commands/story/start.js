const { fn } = require("../../config.js")
const stories = require("../../stories.js")
module.exports = {
  name: "start",
}

module.exports.run = async (message, args, client) => {
  let story = args.join(" ")
  client.emit("storyStart", message.channel.id, story, {})
}
