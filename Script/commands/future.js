const futureList = [
  // সিরিয়াস / মোটিভেশনাল 🔥
  "তুমি একদিন অনেক বড় ব্যবসায়ী হবে 💼✨",
  "তোমার প্রেম হবে খুব তাড়াতাড়ি 🥰",
  "ভবিষ্যতে তুমি বিদেশ ভ্রমণ করবে ✈️🌍",
  "তুমি একদিন অনেক টাকা ইনকাম করবে 💸🔥",
  "একদিন তুমি খুব ফেমাস হবে 📸✨",
  "একদিন তুমি নিজের গাড়ি কিনবে 🚗💨",
  "তুমি একদিন সুখী পরিবার পাবে 👨‍👩‍👧‍👦",
  "তোমার জন্য দারুণ সারপ্রাইজ আসছে 🎁",
  "ভবিষ্যতে তুমি অসাধারণ কিছু অর্জন করবে 🏆",
  "তুমি তোমার স্বপ্ন পূরণ করবে 🌟",
  "একদিন তোমাকে নিয়ে সবাই গর্ব করবে 😎",
  "তুমি নামাজে অনেক নিয়মিত হয়ে যাবে 🕌✨",

  // ফানি / মজার 😂
  "ভবিষ্যতে তুমি ভাতের সাথে কোক খাবে 🥤🍚",
  "তুমি একদিন পায়জামা পরে বিয়ে করতে যাবে 🤵🤣",
  "ভবিষ্যতে তুমি ফ্রি ফায়ার খেলতে খেলতে বুড়ো হবে 🎮👴",
  "একদিন তুমি বাজারে গিয়ে টমেটো কিনতে ভুলে যাবে 🍅🙈",
  "তুমি একদিন TikTok এ ভাইরাল হবে 🕺😂",
  "ভবিষ্যতে তোমার WiFi হঠাৎ ফ্রি হয়ে যাবে 📶🤯",
  "তুমি একদিন প্রেম করতে গিয়ে ধরা খাবা 😹💔",
  "তুমি একদিন ১০ টা জিএফ বানাতে চাও, শেষে সিঙ্গেলই থাকবে 😭",
  "ভবিষ্যতে তুমি মিষ্টি খেয়ে ডায়াবেটিস ধরবে 🍬😅",
  "একদিন তুমি ভুল করে বস আকাশ কে ব্লক দিয়ে দিবে 🚫🤣",
  "ভবিষ্যতে তুমি হাওয়া খেতে খেতে হারিয়ে যাবে 🌪️😂",
  "তুমি একদিন বান্ধবীর বাসায় গিয়ে জুতো হারাবে 👟😭",
  "ভবিষ্যতে তোমাকে দেখে সবাই বলবে— 'ওই যে ফেসবুক ফানি ভাইটা' 🤣",
  "একদিন তুমি WhatsApp এ নিজেকে মেসেজ পাঠাবে 📱🙊",
  "তুমি একদিন বিয়েতে গিয়ে শুধু বিরিয়ানি খেয়ে চলে আসবে 🍗🍛",
  "ভবিষ্যতে তুমি দুপুরে ঘুমাতে গিয়ে রাত পর্যন্ত ঘুমাবা 🛌😂",
  "একদিন তুমি এমন মেসেজ পাবে— 'দাদা, লোন ক্লিয়ার করেন' 🏦🤭",
  "তুমি একদিন হেলমেট ছাড়া বাইক চালাতে গিয়ে পুলিশ মামা ধরবে 🚔😂",
  "ভবিষ্যতে তুমি মশা মারতে গিয়ে মোবাইল ফেলে দিবা 🦟📱",
  "একদিন তুমি বস আকাশ এর জায়গায় বট চালু করে দিবে 🤖🔥",
];

module.exports.config = {
  name: "future",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Akash",
  description: "ভবিষ্যতের মজা দেখাবে 😍",
  commandCategory: "fun",
  usages: "/future me অথবা /future @mention",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
  try {
    let name, targetID;

    if (args[0]?.toLowerCase() === "me") {
      name = event.senderID;
      targetID = event.senderID;
    } 
    else if (Object.keys(event.mentions).length > 0) {
      const mention = Object.keys(event.mentions)[0];
      name = event.mentions[mention];
      targetID = mention;
    } 
    else {
      return api.sendMessage("✅ ব্যবহার: /future me অথবা /future @mention", event.threadID, event.messageID);
    }

    const randomFuture = futureList[Math.floor(Math.random() * futureList.length)];
    
    api.sendMessage({
      body: `🔮 ভবিষ্যদ্বাণী @${name}:\n${randomFuture}`,
      mentions: [{ tag: `@${name}`, id: targetID }]
    }, event.threadID, event.messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
  }
};
