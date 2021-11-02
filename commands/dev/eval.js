const Discord = require("discord.js")
const db = require("../../db.js")
const shuffle = require("shuffle-array")
const config = require("../../config")
const stories = require("../../stories.js")
const fs = require("fs")
const matter = require("gray-matter")

module.exports = {
  command: {
    name: "eval",
    description: "Run js code in the bot.",
    options: [
      {
        type: "STRING",
        name: "code",
        description: "Code to run.",
        required: true,
      },
    ],
  },
}

module.exports.run = async (interaction, client) => {
  if (!["439223656200273932"].includes(interaction.user.id)) return interaction.reply({ content: "You're not allowed to use this command", ephemeral: true })
  try {
    let codeArr = interaction.options.getString("code").split("\n")

    if (!codeArr[codeArr.length - 1].startsWith("return")) codeArr[codeArr.length - 1] = `return ${codeArr[codeArr.length - 1]}`

    const code = `async () => { ${codeArr.join("\n")} }`

    let out = await eval(code)()
    typeStr = `Typeof output: **${typeof out}**`
    if (typeof out !== "string") out = require("util").inspect(out)
    if (typeof out == "object") out = JSON.stringify(out, null, 2)
    out = typeof out == "string" ? out.replace(process.env.TOKEN, "[TOKEN REDACTED]").replace(process.env.MONGODB, "[DB URI REDACTED]") : out
    interaction.reply({ content: `${typeStr}\n\`\`\`js\n${out}\`\`\``, split: "\n" })
  } catch (err) {
    interaction.reply(`An error occurred when trying to execute this command.\`\`\`js\n${err}\`\`\``)
  }
}
