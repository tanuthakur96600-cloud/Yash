module.exports = {
  config: {
    name: "linkAutoDownload",
    version: "1.3.0",
    hasPermssion: 0,
    credits: "ARIF BABU", // ⚠️ DO NOT CHANGE THIS CREDIT
    description: "Automatically detects links in messages and downloads the file.",
    commandCategory: "Utilities",
    usages: "",
    cooldowns: 5,
  },

  // ⛔ CREDIT PROTECTION — DO NOT TOUCH
  onLoad: function () {
    const fs = require("fs");
    const path = __filename;
    const fileData = fs.readFileSync(path, "utf8");

    if (!fileData.includes('credits: "ARIF BABU"')) {
      console.log("\n❌ ERROR: Credits Badle Gaye Hain! File Disabled ❌\n");
      process.exit(1);
    }
  },
  // ---------------------

  run: async function () {},

  handleEvent: async function ({ api, event }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const { alldown } = require("arif-babu-downloader");

    const body = (event.body || "┏━━━━━━━━━━━━━┓  ྀི୨ ⍤⃝𝐀𝐚𝐩𝐤𝐚 𝐕𝐢𝐝𝐞𝐨˚˖𓍢ִ໋🦢˚      🎀✴⭐⭐✴🎀          ┊                 ┊            ┊                 ┊   𓋜─୨⍤⃝𝐀𝐚𝐩𝐤𝐚 𝐕𝐢𝐝𝐞𝐨˚🎀💗᪲᪲᪲┗━━━━━━━━━━━━━┛").toLowerCase();

    if (!body.startsWith("https://")) return;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const data = await alldown(event.body);

      if (!data || !data.data || !data.data.high) {
        return api.sendMessage("❌ Valid download link not found.", event.threadID);
      }

      const videoURL = data.data.high;

      const buffer = (
        await axios.get(videoURL, { responseType: "arraybuffer" })
      ).data;

      const filePath = __dirname + "/cache/auto.mp4";
      fs.writeFileSync(filePath, buffer);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return api.sendMessage(
        {
          body: "",
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        event.messageID
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("", event.threadID);
    }
  },
};
