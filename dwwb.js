const Discord = require("discord.js");
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const config = require("./config.json");
const reactsAlphabet = [
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
const voteCommandHelp = "`!vote @[role name] [optional: vote message]`";
const ynCommandHelp = "`!yn [optional: Yes or no question]`";
const voteCommandDesc =
  " -- Start voting poll for all members with mentioned role.";
const ynCommandDesc = " -- Start a Yes/No poll";
const availableCommands = "`vote`, `yn`";

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
      sendImg(receivedMessage, primaryCommand, "💯0% real");
    }
  } else {
    switch (primaryCommand) {
      case "help":
        helpCommand(receivedMessage, arguments);
        break;
      case "vote":
        voteCommand(receivedMessage, arguments, fullCommand);
        break;
      case "yn":
        yesNoCommand(receivedMessage, fullCommand);
        break;
      case "my":
      case "if":
        sendImg(receivedMessage, primaryCommand, "");
        break;
      case "idol":
        sendImg(receivedMessage, primaryCommand, "💯0% real");
        break;
      default:
        receivedMessage.channel.send(
          "I don't understand the command. Try `!help`."
        );
        break;
    }
  }
}

//#region Command functions
function helpCommand(receivedMessage, arguments) {
  if (arguments.length > 0) {
    var command = arguments[0];
    var helpMsg = "How to use **" + command + "**:.\n";
    switch (command) {
      case "vote":
        helpMsg = helpMsg + voteCommandHelp;
        break;
      case "yn":
        helpMsg = helpMsg + ynCommandHelp;
        break;
      default:
        helpMsg = "`" + command + "` not recognized.\nTry " + availableCommands;
        break;
    }

    receivedMessage.channel.send(helpMsg);
  } else {
    receivedMessage.channel.send(
      "Try this:\n" +
        voteCommandHelp +
        voteCommandDesc +
        "\n" +
        ynCommandHelp +
        ynCommandDesc +
        "\n"
    );
  }
}

function voteCommand(receivedMessage, arguments, fullCommand) {
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
      // List all members with corresponding react
      var memberCount = 0;
      membersWithRole.forEach((member) => {
        if (!member.user.bot) {
          voteMessage =
            voteMessage +
            reactsAlphabet[memberCount] +
            ":  " +
            member.displayName +
            "\n";
          memberCount++;
        }
      });
      if (memberCount > 0) {
        sendMsgWithReacts(
          receivedMessage,
          voteMessage,
          reactsAlphabet,
          memberCount,
          "vote"
        );
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
      "Role name required. Try " + voteCommandHelp + "."
    );
  }
}

function yesNoCommand(receivedMessage, fullCommand) {
  let pollMessage = "Yes or No?";
  let customMessage = fullCommand.split("yn ");
  let reactsYN = ["👍", "👎"];
  if (customMessage.length > 1) {
    pollMessage = customMessage[1] + "\n";
  }
  sendMsgWithReacts(receivedMessage, pollMessage, reactsYN, 2, "yn");
}
//#endregion

//#region Helper functions
function sendImg(receivedMessage, imageName, textMessage) {
  if (imageName == "idol") {
    const maxImageNumber = 6;
    let imageNumber = Math.floor(Math.random() * maxImageNumber) + 1;
    imageName = imageName + imageNumber.toString();
  }
  let filePath = "img/" + imageName + ".png";
  receivedMessage.channel.send(textMessage, {
    files: [filePath],
  });
}

async function sendMsgWithReacts(
  receivedMsg,
  sendMsg,
  reacts,
  reactCount,
  primaryCommand
) {
  const msg = await receivedMsg.channel.send(sendMsg);
  if (reactCount > 19) reactCount = 19; // Discord limit of 20 reacts/msg
  for (var i = 0; i < reactCount; i++) {
    await msg.react(reacts[i]);
  }
  if (primaryCommand == "vote") {
    await msg.react("☮️");
  }
  console.log("msg with reacts");
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
//#endregion

client.login(config.token);
