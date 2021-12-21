console.log("Booting bot...")
require("dotenv").config()
const fs = require("fs")
const Discord = require("discord.js")
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
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
client.voiceConnections = new Discord.Collection()
client.voicePlayers = new Discord.Collection()

//Bot on startup
client.on("ready", async () => {
  console.log("Connected!")
})

const prefix = "."
client.on("messageCreate", async (message) => {
  if (message.author.id != "439223656200273932") return
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).split(/ +/)
  console.log(args)
  let cmd = args.shift().toLowerCase()
  if (cmd == "") cmd = args.shift().toLowerCase()

  console.log(message.content)
  console.log(`command: `, cmd)
  console.log(args)

  if (cmd == "updateslash") {
    const type = args[0] ?? "default"
    console.log("Updating slash commands...")

    try {
      let done = 0
      if (type == "global") {
        client.commands
          .filter((x) => !x.command.adminGuild)
          .each((cmd) => {
            client.application.commands.create(cmd.command)
            done += 1
            console.log(`Loaded global command`, cmd.command.name)
          })
      } else if (type == "admin") {
        client.commands
          .filter((x) => x.command.adminGuild)
          .each((cmd) => {
            if (!cmd.permissions) cmd.permissions = []
            let doPerms = [...cmd.permissions, { id: ids.server, type: "ROLE", permission: false }, { id: ids.admin, type: "ROLE", permission: true }]
            client.application.commands.create(cmd.command, message.guild.id, doPerms).then((command) => command.permissions.set({ command: command, permissions: doPerms }))
            done += 1
            console.log(`Loaded admin command`, cmd.command.name)
          })
      } else {
        client.commands.each((cmd) => {
          //client.application.commands.create(cmd.command, message.guild.id)
          client.application.commands.create(cmd.command, message.guild.id).then((command) => {
            if (!cmd.permissions) cmd.permissions = []
            let doPerms = [...cmd.permissions /*, { id: message.guild.id, type: "ROLE", permission: false }, { id: ids.admin, type: "ROLE", permission: true }*/]
            console.log(`Loaded command`, cmd.command.name, doPerms)
            command.permissions.set({ command: command, permissions: doPerms })
          })
          done += 1
        })
      }
      message.reply({ content: `${done} slash commands queued to be deployed in ${type}. Check console for live updates` })
    } catch (err) {
      console.error(err)
    }
  }

  if (cmd == "eval") {
    try {
      if (!args[0]) return message.channel.send("undefined", { code: "js" })

      let codeArr = args.slice(0).join(" ").split("\n")
      if (!codeArr[codeArr.length - 1].startsWith("return")) codeArr[codeArr.length - 1] = `return ${codeArr[codeArr.length - 1]}`

      const code = `async () => { ${codeArr.join("\n")} }`

      let out = await eval(code)()
      if (typeof out !== "string") out = require("util").inspect(out)
      out = out.replace(process.env.TOKEN, "[TOKEN REDACTED]").replace(process.env.MONGODB, "[DB URI REDACTED]")

      message.channel.send(`Typeof output: **${typeof out}**`)
      message.channel.send({ content: out ? out : "null", split: true, code: "js" })
    } catch (err) {
      message.channel.send("An error occurred when trying to execute this command.")
      console.log(err)
      return message.channel.send(`${err}`, { code: "js" })
    }
  }
})


client.login(process.env.TOKEN)
