module.exports.config = {
  name: "news",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mohammad Akash",
  description: "Breaking News meme generator",
  commandCategory: "Picture",
  usages: "/news [tag/mention]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "canvas": "",
    "jimp": "",
    "node-superfetch": ""
  }
};

module.exports.circle = async (imageBuffer) => {
  const jimp = global.nodemodule.jimp;
  imageBuffer = await jimp.read(imageBuffer);
  imageBuffer.circle(); // DP গোল করা
  return await imageBuffer.getBufferAsync("image/png");
};

module.exports.run = async ({ event, api }) => {
  try {
    const canvas = global.nodemodule.canvas;
    const superfetch = global.nodemodule["node-superfetch"];
    const fs = global.nodemodule["fs-extra"];

    const outputPath = __dirname + "/cache/news.jpg";

    // mention থাকলে সেটার আইডি, না থাকলে নিজের
    const targetUserId = Object.keys(event.mentions)[0] || event.senderID;

    // ক্যানভাস সাইজ (টেমপ্লেটের আসল সাইজ অনুযায়ী)
    const canvasObj = canvas.createCanvas(1366, 768);
    const ctx = canvasObj.getContext("2d");

    // টেমপ্লেট লোড (তোমার দেওয়া লিংক)
    const templateImage = await canvas.loadImage("https://i.imgur.com/3f90Zcy.jpeg");
    ctx.drawImage(templateImage, 0, 0, canvasObj.width, canvasObj.height);

    // প্রোফাইল পিক ডাউনলোড
    let profilePicResponse = await superfetch.get(
      "https://graph.facebook.com/" +
        targetUserId +
        "/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
    );

    // DP গোল করা
    profilePicResponse = await this.circle(profilePicResponse.body);

    // DP বাম পাশে বসানো (x=50, y=120, size=400x400)
    ctx.drawImage(await canvas.loadImage(profilePicResponse), 50, 120, 400, 400);

    // ফাইনাল ইমেজ আউটপুট
    const finalImageBuffer = canvasObj.toBuffer();
    fs.writeFileSync(outputPath, finalImageBuffer);

    // গ্রুপে পাঠানো
    api.sendMessage(
      {
        attachment: fs.createReadStream(outputPath),
        body: "📰 ব্রেকিং নিউজ 📰\nআজকের খবর তুই 😹"
      },
      event.threadID,
      () => fs.unlinkSync(outputPath),
      event.messageID
    );
  } catch (error) {
    api.sendMessage(error.stack, event.threadID);
  }
};
