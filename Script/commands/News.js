module.exports.run = async ({ event, api }) => {
  try {
    const canvas = global.nodemodule.canvas;
    const superfetch = global.nodemodule["node-superfetch"];
    const fs = global.nodemodule["fs-extra"];

    const outputPath = __dirname + "/cache/news.jpg";

    // mention থাকলে সেটার আইডি, না থাকলে নিজের
    const targetUserId = Object.keys(event.mentions)[0] || event.senderID;

    // ক্যানভাস সাইজ
    const canvasObj = canvas.createCanvas(1366, 768);
    const ctx = canvasObj.getContext("2d");

    // টেমপ্লেট লোড
    const templateImage = await canvas.loadImage("https://i.imgur.com/3f90Zcy.jpeg");
    ctx.drawImage(templateImage, 0, 0, canvasObj.width, canvasObj.height);

    // প্রোফাইল পিক ডাউনলোড
    let profilePicResponse = await superfetch.get(
      "https://graph.facebook.com/" +
        targetUserId +
        "/picture?width=600&height=600&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
    );
    const profilePic = await canvas.loadImage(profilePicResponse.body);
    
    // --- মূল পরিবর্তন এখানে ---
    // ছবির সাইজ কিছুটা ছোট করে এবং অবস্থান একটু সমন্বয় করে দেওয়া হয়েছে
    // যাতে টেমপ্লেটের সাথে সুন্দরভাবে ফিট হয়।
    // আগের মাপ ছিল: (profilePic, 65, 135, 350, 350)
    ctx.drawImage(profilePic, 80, 150, 320, 320);

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
