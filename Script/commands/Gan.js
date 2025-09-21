const fs = require("fs");
const request = require("request");

let lastPlayed = -1;

module.exports.config = {
 name: "gan",
 version: "1.0.0",
 hasPermission: 0,
 credits: "Shahadat Islam",
 description: "Play random song with prefix command",
 commandCategory: "music",
 usages: "[prefix]gan",
 cooldowns: 5
};

const songLinks = [
 "https://drive.google.com/uc?export=download&id=1O6QyM8DWiI7nUuxFqGTPLmPb0InfBIaV",
 "https://drive.google.com/uc?export=download&id=1x72FcjgSbSYnxkmm-hxNEPsoBPv9oS5a"
];

module.exports.run = async function ({ api, event, args }) {
 const { threadID, messageID } = event;

 if (songLinks.length === 0) {
 return api.sendMessage("❌ No songs available in the list!", threadID, messageID);
 }

 // Set reaction to indicate processing
 api.setMessageReaction("⌛", messageID, () => {}, true);

 // Select a random song (different from last played)
 let index;
 do {
 index = Math.floor(Math.random() * songLinks.length);
 } while (index === lastPlayed && songLinks.length > 1);

 lastPlayed = index;
 const url = songLinks[index];
 const filePath = `${__dirname}/cache/mysong_${index}.mp3`;

 // Download and send the song
 request(encodeURI(url))
 .pipe(fs.createWriteStream(filePath))
 .on("close", () => {
 api.sendMessage({
 body: "🎶 Here's your requested song:",
 attachment: fs.createReadStream(filePath)
 }, threadID, () => {
 // Delete the file after sending
 try {
 fs.unlinkSync(filePath);
 } catch (err) {
 console.error("Error deleting file:", err);
 }
 }, messageID);
 })
 .on("error", (err) => {
 console.error("Download error:", err);
 api.sendMessage("❌ Failed to download the song. Please try again later.", threadID, messageID);
 });
};
