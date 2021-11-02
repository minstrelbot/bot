const { profile } = require("../../db.js")

module.exports = {
  command: {
    name: "profile",
    description: "View your profile.",
    defaultPermission: true,
  },
  permissions: [],
}

module.exports.run = async (interaction, client) => {
  let p = await profile.findOne({ user: interaction.user.id })
  interaction.reply(JSON.stringify(p, null, 2))
}
