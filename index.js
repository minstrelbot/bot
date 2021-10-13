console.log("Booting bot...")
require("dotenv").config()
const fs = require("fs")
const Discord = require("discord.js")
const client = new Discord.Client({
  intents: ["GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"]
})
const config = require("./config")

client.commands = new Discord.Collection()
fs.readdir("./commands/", (err, files) => {
  files?.forEach((file) => {
    let path = `./commands/${file}`
    fs.readdir(path, (err, files) => {
      if (err) console.error(err)
      let jsfile = files.filter((f) => f.split(".").pop() === "js")
      if (jsfile.length <= 0) {
        console.error(`Couldn't find commands in the ${file} category.`)
        return
      }
      jsfile.forEach((f, i) => {
        let props = require(`./commands/${file}/${f}`)
        props.category = file
        try {
          client.commands.set(props.name, props)
          if (props.alias) props.alias.forEach((alias) => client.commands.set(alias, props))
        } catch (err) {
          if (err) console.error(err)
        }
      })
    })
  })
})

const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
  require(`./events/${file}`)(client)
}

client.stories = require("./stories.js")

//Bot on startup
client.on("ready", async () => {
  console.log("Connected!")
})

client.login(process.env.TOKEN)
