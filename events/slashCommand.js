const Discord = require("discord.js")
const config = require("../config")

const cooldowns = new Discord.Collection()
const prefix = process.env.PREFIX

const { Collection, Util } = require("discord.js")
const { profile } = require("../db")

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return
    let commandFile = client.commands.get(interaction.commandName)

    interaction.dbUser = await profile.findOne({ user: interaction.user.id }).exec()
    if (!interaction.dbUser) interaction.dbUser = await profile.create({ user: interaction.user.id })

    if (!cooldowns.has(commandFile.name)) {
      cooldowns.set(commandFile.name, new Collection())
    }
    const now = Date.now()
    const timestamps = cooldowns.get(commandFile.name)
    const cooldownAmount = (commandFile.cooldown || 0) * 1000
    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        return interaction.reply({ content: `Please wait ${Math.ceil(timeLeft.toFixed(1))} more seconds before reusing the \`${commandFile.command.name}\` command.`, ephemeral: true })
      }
    }
    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

    let args = []
    if (interaction.options.data.length !== 0) {
      interaction.options.data.forEach((arg) => {
        let option = interaction.options.get(arg.name)
        args.push(option.value)
      })
    }
    if (!args[0]) args = ["None"]
    await commandFile.run(interaction, client).catch((error) => {
      console.error(error)
      interaction.reply({ content: "An error has occurred", ephemeral: true })
    })
  })
}

return

module.exports = (client) => {
  //When receiving a message
  client.on("messageCreate", (message) => {
    if (message.author.bot) return //Ignore bots and dms

    //If user mentions bot
    if (message.content.startsWith(`<@!${client.user.id}>`)) return message.reply(`Hey! My prefix is ${prefix}, you can ask for \`${prefix}help\` if you ever need.`)

    if (!message.content.startsWith(prefix)) return
    //if (blacklists.includes(`/${message.author.id}/`)) return message.channel.send("Blacklisted users can't use any command!")

    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()
    const command =
      client.commands.get(commandName) || //DO NOT PUT ;
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
    if (!command) return //If such command doesn't exist, ignore it

    //Check if that command needs arguments
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
      }
      return message.channel.send(reply)
    }

    //Execute command if everything is ok
    try {
      client.channels.cache.get("847766984346435605").send(`Command ran: **${commandName}**\nArguments: **${args.join(" ") || "None"}**\nAuthor: ${message.author.tag} (${message.author.id})`)
      command.run(message, args, client)
    } catch (error) {
      console.error(error)
      message.reply("Something went wrong...")
    }
  })
}
