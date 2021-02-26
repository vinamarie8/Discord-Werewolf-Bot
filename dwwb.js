const Discord = require("discord.js");
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const config = require("./config.json");
const reacts = [
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

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("!help", { type: "PLAYING" });
});

client.on("message", (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return;
  }

  if (
    receivedMessage.content.startsWith("!") ||
    receivedMessage.content.startsWith("?")
  ) {
    try {
      processCommand(receivedMessage);
    } catch (error) {
      console.error(error);
    }
  }
});

function processCommand(receivedMessage) {
  let prefix = receivedMessage.content.charAt(0);
  let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  if (prefix == "?") {
    if (primaryCommand == "idol") {
      sendImage(receivedMessage, primaryCommand, "💯0% real");
    }
  } else {
    switch (primaryCommand) {
      case "help":
        helpCommand(arguments, receivedMessage);
        break;
      case "vote":
        voteCommand(arguments, fullCommand, receivedMessage);
        break;
      case "my":
      case "if":
        sendImage(receivedMessage, primaryCommand, "");
        break;
      case "idol":
        sendImage(receivedMessage, primaryCommand, "💯0% real");
        break;
      default:
        receivedMessage.channel.send(
          "I don't understand the command. Try `!help`."
        );
        break;
    }
  }
}

function sendImage(receivedMessage, primaryCommand, textMessage) {
  let filePath = "img/" + primaryCommand + ".png";
  receivedMessage.channel.send(textMessage, {
    files: [filePath],
  });
}

function helpCommand(arguments, receivedMessage) {
  if (arguments.length > 0) {
    var helpMsg =
      "It looks like you might need help with **" + arguments + "**.\n";
    if (arguments == "vote") {
      helpMsg =
        helpMsg + "`!vote @[role name] [optional: vote message]` to vote.";
    }
    receivedMessage.channel.send(helpMsg);
  } else {
    receivedMessage.channel.send(
      "Try this:\n`!vote @[role name] [optional: vote message]` -- Start voting poll for all members with mentioned role."
    );
  }
}

function voteCommand(arguments, fullCommand, receivedMessage) {
  const mention = arguments[0];
  const roleMentioned = getRoleFromMention(String(mention), receivedMessage);

  if (roleMentioned) {
    let voteMessage = "It's time to vote!\n";

    // Display custom vote message
    let customVoteMessage = fullCommand.split("vote " + mention + " ");
    if (customVoteMessage.length > 1) {
      voteMessage = customVoteMessage[1] + "\n";
    }

    let membersWithRole = roleMentioned.members;

    console.log("Member Size:" + membersWithRole.size);
    if (membersWithRole.size > 0) {
      var memberCount = 0;
      membersWithRole.forEach((member) => {
        if (!member.user.bot) {
          voteMessage =
            voteMessage +
            reacts[memberCount] +
            ":  " +
            member.displayName +
            "\n";
          memberCount++;
        }
      });
      if (memberCount > 0) {
        sendVoteMessage(receivedMessage, voteMessage, reacts, memberCount);
      } else {
        receivedMessage.channel.send(
          `The role group <@&${roleMentioned.id}> has no humans, only bots.`
        );
      }
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
  if (reactCount > 19) reactCount = 19; // Discord limit of 20 reacts/msg
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
    return receivedMessage.guild.roles.cache.get(mention);
  }
}

client.login(config.token);
