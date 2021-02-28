const Discord = require("discord.js");
require("dotenv").config();
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
//const config = require("./config.json");
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
const voteCommandDesc =
  "Start voting poll for all members with mentioned role.";
const wheelCommandHelp = "`!wheel @[role name] [optional: wheel message]`";
const wheelCommandDesc = "Randomly chooses a player of mentioned role";
const ynCommandHelp = "`!yn [yes or no question]`";
const ynCommandDesc = "Start a Yes/No poll";
const randomNumberCommandHelp = "`!random [number]` or `!number [number]`";
const randomNumberCommandDesc =
  "Get random number between 1 and number specified";
const availableCommands = "`vote`, `yn`, `random`, `number`";
const embedColor = "#c09edb";
const maxImageNumber = 6;

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
      case "wheel":
        wheelCommand(receivedMsg, arguments, primaryCommand, fullCommand);
        break;
      case "yn":
        yesNoCommand(receivedMsg, fullCommand);
        break;
      case "my":
      case "if":
      case "birthdaytaz":
      case "byetaz":
      case "confusedtaz":
      case "congratstaz":
      case "eatingtaz":
      case "flowertaz":
      case "happytaz":
      case "hitaz":
      case "loltaz":
      case "missyoutaz":
      case "omgtaz":
      case "sadtaz":
      case "sorrytaz":
      case "thankyoutaz":
      case "thumbsuptaz":
      case "unamusedtaz":
        sendImg(receivedMsg, primaryCommand, "");
        break;
      case "idol":
        sendImg(receivedMsg, primaryCommand, "💯0% real");
        break;
      case "random":
      case "number":
        randomNumberCommand(receivedMsg, arguments);
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
      case "wheel":
        helpMsg = helpMsg + wheelCommandHelp;
        break;
      case "yn":
        helpMsg = helpMsg + ynCommandHelp;
        break;
      case "random":
      case "number":
        helpMsg = helpMsg + randomNumberCommandHelp;
        break;
      default:
        helpMsg = "`" + command + "` not recognized. Try " + availableCommands;
        commandFound = false;
        sendMsg(receivedMsg, helpMsg);
        break;
    }

    if (commandFound) {
      sendMsgEmbed(receivedMsg, helpMsgTitle, helpMsg);
    }
  } else {
    let fullHelpMsg =
      voteCommandDesc +
      "\n" +
      voteCommandHelp +
      "\n\n" +
      wheelCommandDesc +
      "\n" +
      wheelCommandHelp +
      "\n\n" +
      ynCommandDesc +
      "\n" +
      ynCommandHelp +
      "\n\n" +
      randomNumberCommandDesc +
      "\n" +
      randomNumberCommandHelp;
    sendMsgEmbed(receivedMsg, "Commands", fullHelpMsg);
  }
}

function voteCommand(receivedMsg, arguments, fullCommand) {
  const mention = arguments[0];
  const roleMentioned = getRoleFromMention(String(mention), receivedMsg);
  let errMsg = "";

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
        errMsg = `The role group <@&${roleMentioned.id}> has no humans, only bots.`;
      }
    } else {
      errMsg = `There are no members of <@&${roleMentioned.id}>.`;
    }
  } else {
    errMsg = "Role name required. Try " + voteCommandHelp + ".";
  }

  if (errMsg != "") sendMsg(receivedMsg, errMsg);
}

function wheelCommand(receivedMsg, arguments, primaryCommand, fullCommand) {
  let wheelTitle = "🎡🎡🎡 WHEEL WHEEL WHEEL 🎡🎡🎡";
  roleCommand(receivedMsg, arguments, primaryCommand, fullCommand, wheelTitle);
}

function roleCommand(
  receivedMsg,
  arguments,
  primaryCommand,
  fullCommand,
  msgTitle
) {
  const mention = arguments[0];
  const roleMentioned = getRoleFromMention(String(mention), receivedMsg);
  let errMsg = "";

  if (roleMentioned) {
    let membersWithRole = roleMentioned.members;
    if (membersWithRole.size > 0) {
      let members = roleMentioned.members.filter((member) => !member.user.bot);
      if (members.size > 0) {
        let membersArray = members.array();
        msgTitle = getCustomMsg(msgTitle, primaryCommand, fullCommand, mention);
        switch (primaryCommand) {
          case "wheel":
            let memberIndex = getRandomNumber(members.size) - 1;
            let chosenMember = membersArray[memberIndex];
            let msg =
              "**" +
              chosenMember.displayName +
              "** has been chosen by the wheel!";
            sendMsgMemberEmbed(receivedMsg, msgTitle, msg, chosenMember);
            break;
        }
      } else {
        errMsg = `The role group <@&${roleMentioned.id}> has no humans, only bots.`;
      }
    } else {
      errMsg = `There are no members of <@&${roleMentioned.id}>.`;
    }
  } else {
    errMsg = "Role name required. Try " + voteCommandHelp + ".";
  }

  if (errMsg != "") sendMsg(receivedMsg, errMsg);
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

function randomNumberCommand(receivedMsg, arguments) {
  let maxNum = 20;
  if (arguments.length > 0) {
    maxNum = arguments[0];
  }
  let randomNumTitle = "Random number between 1 and " + maxNum;
  let randomNum = getRandomNumber(maxNum);
  sendMsgEmbed(receivedMsg, randomNumTitle, randomNum);
}
//#endregion

//#region Helper functions
function sendImg(receivedMsg, imageName, textMsg) {
  if (imageName == "idol") {
    imageNumber = getRandomNumber(maxImageNumber);
    imageName = imageName + imageNumber.toString();
  }
  let filePath = "img/" + imageName + ".png";
  receivedMsg.channel.send(textMsg, {
    files: [filePath],
  });
}

function getRandomNumber(maxNumber) {
  //Returns a number between 1 and maxNumber
  return (randomNumber = Math.floor(Math.random() * maxNumber) + 1);
}

function getCustomMsg(defaultMsg, primaryCommand, fullCommand, mention) {
  let returnMsg = defaultMsg;
  let customMsg = fullCommand.split(primaryCommand + " " + mention + " ");
  if (customMsg.length > 1) {
    returnMsg = customMsg[1];
  }
  return returnMsg;
}

async function sendMsgWithReacts(
  receivedMsg,
  sendMsg,
  sendMsgTitle,
  reacts,
  reactCount,
  primaryCommand
) {
  const msg = await sendMsgEmbed(receivedMsg, sendMsgTitle, sendMsg);
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
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(embedColor)
    .setDescription(sendMsg);
  return receivedMsg.channel.send(embed);
}

function sendMsgMemberEmbed(receivedMsg, title, sendMsg, member) {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(embedColor)
    .setDescription(sendMsg)
    .setImage(member.user.avatarURL());
  return receivedMsg.channel.send(embed);
}

function sendMsg(receivedMsg, sendMsg) {
  receivedMsg.channel.send(sendMsg);
}
//#endregion

client.login();
