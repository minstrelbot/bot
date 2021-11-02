console.log("Booting bot...")
require("dotenv").config()
const fs = require("fs")
const Discord = require("discord.js")
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
})
const config = require("./config")

client.commands = new Discord.Collection()
fs.readdir("./commands/", (err, files) => {
  files.forEach((file) => {
    let path = `./commands/${file}`
    fs.readdir(path, (err, files) => {
      if (err) console.error(err)
      let jsfile = files.filter((f) => f.split(".").pop() === "js")
      if (jsfile.length <= 0) {
        console.error(`Couldn't find slash commands in the ${file} category.`)
      }
      jsfile.forEach((f, i) => {
        let props = require(`./commands/${file}/${f}`)
        props.category = file
        try {
          client.commands.set(props.command.name, props)
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

client.on("messageCreate", (message) => {
  if (message.author.id != "439223656200273932") return
  if (message.content.split(" ")[1] == "updateslash") { 
    console.log("Updating slash commands...")
    try {
      let done = 0
      client.commands.each((cmd) => {
        client.application.commands.create(cmd.command, message.guild.id)
        // client.application.commands.create(cmd.command).then((command) => {
        //   //if (cmd.permissions) command.permissions.set({ command: command, permissions: cmd.permissions })
        // })
        done += 1
      })
      message.reply({ content: `${done} slash commands created/updated.` })
    } catch (err) {
      console.error(err)
    }
  }
})

client.login(process.env.TOKEN)
