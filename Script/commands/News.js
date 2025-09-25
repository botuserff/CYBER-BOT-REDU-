module.exports.run = async ({ event, api }) => {
  try {
    const canvas = global.nodemodule.canvas;
    const superfetch = global.nodemodule["node-superfetch"];
    const fs = global.nodemodule["fs-extra"];

    const outputPath = __dirname + "/cache/news.jpg";

    const targetUserId = Object.keys(event.mentions)[0] || event.senderID;

    const canvasObj = canvas.createCanvas(1366, 768);
    const ctx = canvasObj.getContext("2d");

    const templateImage = await canvas.loadImage("https://i.imgur.com/3f90Zcy.jpeg");
    ctx.drawImage(templateImage, 0, 0, canvasObj.width, canvasObj.height);

    let profilePicResponse = await superfetch.get(
      "https://graph.facebook.com/" +
        targetUserId +
        "/picture?width=600&height=600&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
    );
    const profilePic = await canvas.loadImage(profilePicResponse.body);
    
    // --- একদম সঠিক মাপ এখানে ---
    // টেমপ্লেটের রঙিন বক্সটিকে পুরোপুরি পূরণ করার জন্য এই মাপগুলো ব্যবহার করা হয়েছে।
    ctx.drawImage(profilePic, 50, 120, 380, 380);

    const finalImageBuffer = canvasObj.toBuffer();
    fs.writeFileSync(outputPath, finalImageBuffer);

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
