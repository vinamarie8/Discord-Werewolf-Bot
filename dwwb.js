const Discord = require("discord.js");
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
});

client.on("message", (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return;
  }

  if (receivedMessage.content.startsWith("!")) {
    processCommand(receivedMessage);
  }

  if (receivedMessage.content.startsWith("?")) {
    processCommandQuestion(receivedMessage);
  }
});

function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  if (primaryCommand == "help") {
    helpCommand(arguments, receivedMessage);
  } else if (primaryCommand == "vote") {
    voteCommand(arguments, receivedMessage);
  } else {
    receivedMessage.channel.send(
      "I don't understand the command. Try `!help`."
    );
  }
}

function processCommandQuestion(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  if (primaryCommand == "idol") {
    receivedMessage.channel.send("💯0% real", {
      files: ["img/itsaneffingstick.jpg"],
    });
  } else {
    receivedMessage.channel.send("I don't understand the command.");
  }
}

function helpCommand(arguments, receivedMessage) {
  if (arguments.length > 0) {
    var helpMsg =
      "It looks like you might need help with **" + arguments + "**.\n";
    if (arguments == "vote") {
      helpMsg = helpMsg + "`!vote @[role name]` to vote.";
    }
    receivedMessage.channel.send(helpMsg);
  } else {
    receivedMessage.channel.send(
      "DWWVD/Z Bot Commands:\n`!vote @[role name]` -- Start voting poll for all members with mentioned role."
    );
  }
}

function voteCommand(mention, receivedMessage) {
  const roleMentioned = getRoleFromMention(String(mention), receivedMessage);

  if (roleMentioned) {
    let membersWithRole = roleMentioned.members;
    let voteMessage = "It's time to vote!\n"; // TODO: allow custom message
    let reacts = [
      "🇦",
      "🇧",
      "🇨",
      "🇩",
      "🇪",
      "🇫",
      "🇬",
      "🇭",
      "🇮",
      "🇯",
      "🇰",
      "🇱",
      "🇲",
      "🇳",
      "🇴",
      "🇵",
      "🇶",
      "🇷",
      "🇸",
      "🇹",
      "🇺",
      "🇻",
      "🇼",
      "🇽",
      "🇾",
      "🇿",
    ];
    console.log("Member Size:" + membersWithRole.size);
    if (membersWithRole.size > 0) {
      var i = 0;
      membersWithRole.forEach((member) => {
        voteMessage =
          voteMessage + reacts[i] + ":  " + member.displayName + "\n";
        i++;
      });
      sendVoteMessage(receivedMessage, voteMessage, reacts, i);
    } else {
      receivedMessage.channel.send(
        `There are no members of <@&${roleMentioned.id}>.`
      );
    }
  } else {
    receivedMessage.channel.send(
      "Role name required. Try `!vote @[role name]`."
    );
  }
}

async function sendVoteMessage(
  receivedMessage,
  voteMessage,
  reacts,
  reactCount
) {
  const msg = await receivedMessage.channel.send(voteMessage);
  for (var i = 0; i < reactCount; i++) {
    await msg.react(reacts[i]);
  }
  await msg.react("☮️");
}

function getRoleFromMention(mention, receivedMessage) {
  if (!mention) return;
  if (mention.startsWith("<@&") && mention.endsWith(">")) {
    mention = mention.slice(3, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }
    console.log(mention);

    return receivedMessage.guild.roles.cache.get(mention);
  }
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token =
  "ODE0MzY2MTE1MzkxNDcxNjE2.YDczjA.tNpsA2SMUUhmqUKk74yxzy9QjMg";

client.login(bot_secret_token);
