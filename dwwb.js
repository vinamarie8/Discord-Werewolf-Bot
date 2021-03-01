const Discord = require("discord.js");
const helperFunc = require("./helperFunctions.js");
require("dotenv").config();
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const constants = require("./constants.json");

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("!help | &help", { type: "PLAYING" });
});

client.on("message", (receivedMsg) => {
  // Prevent bot from responding to its own messages
  if (receivedMsg.author == client.user) {
    return;
  }

  if (
    receivedMsg.content.startsWith("!") ||
    receivedMsg.content.startsWith("?") ||
    receivedMsg.content.startsWith("&") ||
    receivedMsg.content.startsWith("ww")
  ) {
    try {
      processCommand(receivedMsg);
    } catch (error) {
      console.error(error);
      helperFunc.sendMsg(
        receivedMsg,
        "Oops, sorry! There was an error. Please try again."
      );
    }
  }
});

function processCommand(receivedMsg) {
  let processString = receivedMsg.content;
  if (receivedMsg.content.startsWith("ww")) {
    processString = receivedMsg.content.substr(2);
  }

  let prefix = processString.charAt(0);
  let fullCommand = processString.substr(1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  if (prefix == "?") {
    if (primaryCommand == "idol") {
      helperFunc.sendImg(receivedMsg, primaryCommand, "💯0% real");
    }
  } else {
    switch (primaryCommand) {
      case "help":
        helpCommand(receivedMsg, arguments);
        break;
      case "vote":
        voteCommand(receivedMsg, arguments, primaryCommand, fullCommand);
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
        helperFunc.sendImg(receivedMsg, primaryCommand, "");
        break;
      case "angrytaz":
      case "grumpytaz":
        helperFunc.sendImg(receivedMsg, "unamusedtaz", "");
        break;
      case "idol":
        helperFunc.sendImg(receivedMsg, primaryCommand, "💯0% real");
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
        helpMsg = helpMsg + constants.voteCommandHelp;
        break;
      case "wheel":
        helpMsg = helpMsg + constants.wheelCommandHelp;
        break;
      case "yn":
        helpMsg = helpMsg + constants.ynCommandHelp;
        break;
      case "random":
      case "number":
        helpMsg = helpMsg + constants.randomNumberCommandHelp;
        break;
      default:
        helpMsg = "`" + command + "` not recognized. Try " + availableCommands;
        commandFound = false;
        helperFunc.sendMsg(receivedMsg, helpMsg);
        break;
    }

    if (commandFound) {
      helperFunc.sendMsgEmbed(receivedMsg, helpMsgTitle, helpMsg);
    }
  } else {
    let fullHelpMsg =
      constants.helpInfo +
      "\n\n" +
      constants.voteCommandDesc +
      "\n" +
      constants.voteCommandHelp +
      "\n\n" +
      constants.wheelCommandDesc +
      "\n" +
      constants.wheelCommandHelp +
      "\n\n" +
      constants.ynCommandDesc +
      "\n" +
      constants.ynCommandHelp +
      "\n\n" +
      constants.randomNumberCommandDesc +
      "\n" +
      constants.randomNumberCommandHelp;
    helperFunc.sendMsgEmbed(receivedMsg, "Commands", fullHelpMsg);
  }
}

function voteCommand(receivedMsg, arguments, primaryCommand, fullCommand) {
  let voteTitle = "It's time to vote!";
  roleCommand(receivedMsg, arguments, primaryCommand, fullCommand, voteTitle);
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
  const roleMentioned = helperFunc.getRoleFromMention(
    String(mention),
    receivedMsg
  );
  let errMsg = "";

  if (roleMentioned) {
    let membersWithRole = roleMentioned.members;
    if (membersWithRole.size > 0) {
      let members = roleMentioned.members.filter((member) => !member.user.bot);
      if (members.size > 0) {
        let membersArray = members.array();
        // Remove users from members array
        let membersRemove = helperFunc.getMembersRemoveArray(
          receivedMsg,
          arguments,
          errMsg
        );

        // Set message title
        msgTitle = helperFunc.getCustomMsgMembersRemove(
          primaryCommand,
          fullCommand,
          mention,
          arguments,
          membersRemove,
          msgTitle
        );

        // Filter array
        let membersKept = helperFunc.getFilteredMembersArray(
          membersRemove,
          membersArray
        );

        if (!(membersKept.length > 0)) {
          errMsg = `Oops! The ${primaryCommand} is empty now.`;
          helperFunc.sendMsg(receivedMsg, errMsg);
          return;
        }

        switch (primaryCommand) {
          case "wheel":
            let memberIndex =
              helperFunc.getRandomNumber(membersKept.length) - 1;
            let chosenMember = membersKept[memberIndex];
            let msg =
              "**" +
              chosenMember.displayName +
              "** has been chosen by the wheel!";
            helperFunc.sendMsgMemberEmbed(
              receivedMsg,
              msgTitle,
              msg,
              chosenMember
            );
            break;
          case "vote":
            var memberCount = 0;
            var voteMsg = "";

            membersKept.forEach((member) => {
              voteMsg =
                voteMsg +
                constants.reactsAlphabet[memberCount] +
                " " +
                member.displayName +
                "\n\n";
              memberCount++;
            });
            if (memberCount > 0) {
              helperFunc.sendMsgWithReacts(
                receivedMsg,
                voteMsg,
                msgTitle,
                constants.reactsAlphabet,
                memberCount,
                "vote"
              );
            }
            break;
        }
      } else {
        errMsg = `The role group <@&${roleMentioned.id}> has no humans, only bots.`;
      }
    } else {
      errMsg = `There are no members of <@&${roleMentioned.id}>.`;
    }
  } else {
    switch (primaryCommand) {
      case "vote":
        errMsg = "Role name required. Try " + constants.voteCommandHelp + ".";
        break;
      case "wheel":
        errMsg = "Role name required. Try " + constants.wheelCommandHelp + ".";
        break;
      default:
        errMsg = "Role name required.";
        break;
    }
  }

  if (errMsg != "") helperFunc.sendMsg(receivedMsg, errMsg);
}

function yesNoCommand(receivedMsg, fullCommand) {
  let pollMsg = "Yes or No?";
  let customMsg = fullCommand.split("yn ");
  let reactsYN = ["👍", "👎"];
  if (customMsg.length > 1) {
    pollMsg = customMsg[1] + "\n";
  }
  helperFunc.sendMsgWithReacts(receivedMsg, "", pollMsg, reactsYN, 2, "yn");
}

function randomNumberCommand(receivedMsg, arguments) {
  let maxNum = 20;
  if (arguments.length > 0) {
    maxNum = arguments[0];
  }
  let randomNumTitle = "Random number between 1 and " + maxNum;
  let randomNum = helperFunc.getRandomNumber(maxNum);
  helperFunc.sendMsgEmbed(receivedMsg, randomNumTitle, randomNum);
}
//#endregion

client.login();
