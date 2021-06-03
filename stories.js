const matter = require("gray-matter")
const fs = require("fs")
const { Collection } = require("discord.js")
const storyCol = new Collection()
fs.readdir("../stories/", (err, folders) => {
  folders?.forEach((storyFolder) => {
    let story = generateStory(storyFolder)
    if (!story.id || !story.name) return console.log(`Unable to get the story --${storyFolder}-- as it is missing data`)
    console.log(`Loaded the ${story.name} story with an ID of ${story.id}`)
    storyCol.set(story.id, story)
  })
})

const generateStory = (storyFolder) => {
  let story = {}
  let info = matter.read(`../stories/${storyFolder}/MAIN.md`)
  story = info.data
  story.folder = `${__dirname}/../stories/${storyFolder}`
  story.description = info.content
  console.log(story)
  return story
}

module.exports = storyCol