const ffmpeg = require("fluent-ffmpeg");
const request = require("node-superfetch");
const fs = require("fs");
const jimp = require("jimp");

module.exports.config = {
  name: "chor2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mohammad Akash",
  description: "Overlay mention DP on breaking news video",
  commandCategory: "Video",
  usages: "/chor2 [@mention]",
  cooldowns: 10,
  dependencies: {
    "fluent-ffmpeg": "",
    "node-superfetch": "",
    "jimp": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ event, api }) => {
  try {
    let id = Object.keys(event.mentions)[0] || event.senderID;

    // ইউজারের DP ডাউনলোড
    let avatar = await request.get(
      `https://graph.facebook.com/${id}/picture?width=400&height=400&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
    );
    fs.writeFileSync(__dirname + "/cache/avatar.png", avatar.body);

    // Circle crop
    let img = await jimp.read(__dirname + "/cache/avatar.png");
    img.circle();
    await img.resize(220, 220);
    await img.writeAsync(__dirname + "/cache/avatar.png");

    // ভিডিও লিংক
    let inputVideo = "https://drive.google.com/uc?export=download&id=16Jab4C7EGSJJTmhPZkGqocxumit15aKf";
    let outputVideo = __dirname + "/cache/output.mp4";

    ffmpeg(inputVideo)
      .input(__dirname + "/cache/avatar.png")
      .complexFilter([
        {
          filter: "overlay",
          options: { x: 35, y: 95 } // এখানে DP বসবে
        }
      ])
      .outputOptions(["-c:v libx264", "-preset ultrafast", "-crf 23"])
      .save(outputVideo)
      .on("end", () => {
        api.sendMessage(
          {
            body: "📰 Breaking News! 🤣",
            attachment: fs.createReadStream(outputVideo)
          },
          event.threadID,
          () => {
            fs.unlinkSync(outputVideo);
            fs.unlinkSync(__dirname + "/cache/avatar.png");
          }
        );
      })
      .on("error", (err) => {
        api.sendMessage("❌ ভিডিও প্রসেসে সমস্যা: " + err.message, event.threadID);
      });
  } catch (e) {
    api.sendMessage("Error: " + e.toString(), event.threadID);
  }
};
