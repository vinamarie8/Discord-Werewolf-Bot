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
const ynCommandHelp = "`!yn [yes or no question]`";
const voteCommandDesc =
  "Start voting poll for all members with mentioned role.";
const ynCommandDesc = "Start a Yes/No poll";
const availableCommands = "`vote`, `yn`";
const embedColor = "#c09edb";

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("!help", { type: "PLAYING" });
});

client.on("message", (receivedMsg) => {
  // Prevent bot from responding to its own messages
  if (receivedMsg.author == client.user) {
    return;
  }

  if (
    receivedMsg.content.startsWith("!") ||
    receivedMsg.content.startsWith("?")
  ) {
    try {
      processCommand(receivedMsg);
    } catch (error) {
      console.error(error);
    }
  }
});

function processCommand(receivedMsg) {
  let prefix = receivedMsg.content.charAt(0);
  let fullCommand = receivedMsg.content.substr(1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  if (prefix == "?") {
    if (primaryCommand == "idol") {
      sendImg(receivedMsg, primaryCommand, "💯0% real");
    }
  } else {
    switch (primaryCommand) {
      case "help":
        helpCommand(receivedMsg, arguments);
        break;
      case "vote":
        voteCommand(receivedMsg, arguments, fullCommand);
        break;
      case "yn":
        yesNoCommand(receivedMsg, fullCommand);
        break;
      case "my":
      case "if":
        sendImg(receivedMsg, primaryCommand, "");
        break;
      case "idol":
        sendImg(receivedMsg, primaryCommand, "💯0% real");
        break;
      default:
        break;
    }
  }
}

//#region Command functions
function helpCommand(receivedMsg, arguments) {
  if (arguments.length > 0) {
    var command = arguments[0];
    var helpMsgTitle = "How to use `" + command + "`";
    var helpMsg = "";
    var commandFound = true;
    switch (command) {
      case "vote":
        helpMsg = helpMsg + voteCommandHelp;
        break;
      case "yn":
        helpMsg = helpMsg + ynCommandHelp;
        break;
      default:
        helpMsg = "`" + command + "` not recognized. Try " + availableCommands;
        commandFound = false;
        receivedMsg.channel.send(helpMsg);
        break;
    }

    if (commandFound) {
      const embed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setTitle(helpMsgTitle)
        .setDescription(helpMsg);
      receivedMsg.channel.send(embed);
    }
  } else {
    const embed = new Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle("Commands")
      .setDescription(
        voteCommandDesc +
          "\n" +
          voteCommandHelp +
          "\n\n" +
          ynCommandDesc +
          "\n" +
          ynCommandHelp
      );
    receivedMsg.channel.send(embed);
  }
}

function voteCommand(receivedMsg, arguments, fullCommand) {
  const mention = arguments[0];
  const roleMentioned = getRoleFromMention(String(mention), receivedMsg);

  if (roleMentioned) {
    let voteMsgTitle = "It's time to vote!";
    // Display custom vote message
    let customVoteMsg = fullCommand.split("vote " + mention + " ");
    if (customVoteMsg.length > 1) {
      voteMsgTitle = customVoteMsg[1];
    }

    let membersWithRole = roleMentioned.members;

    console.log("Member Size:" + membersWithRole.size);
    if (membersWithRole.size > 0) {
      // List all members with corresponding react
      var memberCount = 0;
      var voteMsg = "";
      membersWithRole.forEach((member) => {
        if (!member.user.bot) {
          voteMsg =
            voteMsg +
            reactsAlphabet[memberCount] +
            " " +
            member.displayName +
            "\n\n";
          memberCount++;
        }
      });
      if (memberCount > 0) {
        sendMsgWithReacts(
          receivedMsg,
          voteMsg,
          voteMsgTitle,
          reactsAlphabet,
          memberCount,
          "vote"
        );
      } else {
        receivedMsg.channel.send(
          `The role group <@&${roleMentioned.id}> has no humans, only bots.`
        );
      }
    } else {
      receivedMsg.channel.send(
        `There are no members of <@&${roleMentioned.id}>.`
      );
    }
  } else {
    receivedMsg.channel.send(
      "Role name required. Try " + voteCommandHelp + "."
    );
  }
}

function yesNoCommand(receivedMsg, fullCommand) {
  let pollMsg = "Yes or No?";
  let customMsg = fullCommand.split("yn ");
  let reactsYN = ["👍", "👎"];
  if (customMsg.length > 1) {
    pollMsg = customMsg[1] + "\n";
  }
  sendMsgWithReacts(receivedMsg, "", pollMsg, reactsYN, 2, "yn");
}
//#endregion

//#region Helper functions
function sendImg(receivedMsg, imageName, textMsg) {
  if (imageName == "idol") {
    const maxImageNumber = 6;
    let imageNumber = Math.floor(Math.random() * maxImageNumber) + 1;
    imageName = imageName + imageNumber.toString();
  }
  let filePath = "img/" + imageName + ".png";
  receivedMsg.channel.send(textMsg, {
    files: [filePath],
  });
  /*const embed = new Discord.MessageEmbed()
    .setColor(embedColor)
    .attachFiles([filePath])
    .setImage("attachment://" + imageName + ".png")
    .setDescription(textMsg);
  receivedMsg.channel.send(embed);*/
}

async function sendMsgWithReacts(
  receivedMsg,
  sendMsg,
  sendMsgTitle,
  reacts,
  reactCount,
  primaryCommand
) {
  const embed = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setTitle(sendMsgTitle)
    .setDescription(sendMsg);

  const msg = await receivedMsg.channel.send(embed);
  if (reactCount > 19) reactCount = 19; // Discord limit of 20 reacts/msg
  for (var i = 0; i < reactCount; i++) {
    await msg.react(reacts[i]);
  }
  if (primaryCommand == "vote") {
    await msg.react("☮️");
  }
}

function getRoleFromMention(mention, receivedMsg) {
  if (!mention) return;
  if (mention.startsWith("<@&") && mention.endsWith(">")) {
    mention = mention.slice(3, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }
    return receivedMsg.guild.roles.cache.get(mention);
  }
}

function sendMsgEmbed(receivedMsg, title, sendMsg) {
  // TODO use this function for embed messages
  const embed = new MessageEmbed()
    .setTitle(title)
    .setColor(embedColor)
    .setDescription(sendMsg);
  receivedMsg.channel.send(embed);
}
//#endregion

client.login(config.token);
