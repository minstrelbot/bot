const { fn } = require("../../config")
const { profile } = require("../../db.js")
module.exports = {
  name: "profile",
}

module.exports.run = async (message, args, client) => {
  let p = await profile.findOne({user: message.author.id})
  message.channel.send(JSON.stringify(p, null, 2))
}
