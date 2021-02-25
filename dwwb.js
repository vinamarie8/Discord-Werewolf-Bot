const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
});

client.on("message", (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return;
  }

  receivedMessage.channel.send("Message received: " + receivedMessage.content);
});

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token =
  "ODE0MzY2MTE1MzkxNDcxNjE2.YDczjA.o7GVm-T0KczzeL2mfYqmAa0JKEs";

client.login(bot_secret_token);
