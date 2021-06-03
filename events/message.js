const Discord = require("discord.js")
const config = require("../config.js")

const cooldowns = new Discord.Collection()
const prefix = process.env.PREFIX

module.exports = (client) => {
  //When receiving a message
  client.on("message", (message) => {
    
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
