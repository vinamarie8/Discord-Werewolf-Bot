const Discord = require("discord.js");
const helperFunc = require("./helperFunctions.js");
require("dotenv").config();
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const constants = require("./constants.json");
const newLine = "\n";
const newLineDouble = "\n\n";
const helpCommands = constants.helpCommands;

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
  processString = processString.replace(/\s\s+/g, " "); // Remove extra spaces
  processString = processString.replace("><", "> <"); // Add space between mentions
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

  primaryCommand = String(primaryCommand).toLowerCase();
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
      case "voteplayer":
      case "voteplayers":
        votePlayersCommand(receivedMsg, arguments);
        break;
      case "wheelplayer":
      case "wheelplayers":
        wheelPlayersCommand(receivedMsg, arguments);
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
      case "celebrationtaz":
      case "celebratetaz":
      case "caketaz":
      case "partytaz":
        helperFunc.sendImg(receivedMsg, "birthdaytaz", "");
        break;
      case "chickentaz":
      case "chickenlegtaz":
      case "turkeytaz":
      case "turkeylegtaz":
        helperFunc.sendImg(receivedMsg, "eatingtaz", "");
        break;
      case "flowerstaz":
        helperFunc.sendImg(receivedMsg, "flowertaz", "");
        break;
      case "heartstaz":
        helperFunc.sendImg(receivedMsg, "happytaz", "");
        break;
      case "crytaz":
      case "saddesttaz":
        helperFunc.sendImg(receivedMsg, "sadtaz", "");
        break;
      case "angrytaz":
      case "grumpytaz":
      case "eyerolltaz":
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
    var command = String(arguments[0]).toLowerCase();
    var helpMsgTitle = "How to use `" + command + "`";
    var helpMsg = "";
    var commandFound = true;

    if (command == "number") command = "random";
    // Help for individual command
    if (helpCommands[command]) {
      helpMsg =
        helpMsg +
        helpCommands[command]["desc"] +
        newLine +
        helpCommands[command]["help"];
    } else {
      helpMsg =
        "`" + command + "` not recognized. Try " + constants.availableCommands;
      commandFound = false;
      helperFunc.sendMsg(receivedMsg, helpMsg);
    }

    if (commandFound) {
      helperFunc.sendMsgEmbed(receivedMsg, helpMsgTitle, helpMsg);
    }
  } else {
    // Full help message
    let fullHelpMsg = constants.helpInfo + newLineDouble;
    for (var i in helpCommands) {
      if (helpCommands[i] instanceof Object) {
        fullHelpMsg =
          fullHelpMsg +
          helpCommands[i]["desc"] +
          newLine +
          helpCommands[i]["help"] +
          newLineDouble;
      }
    }

    helperFunc.sendMsgEmbed(receivedMsg, "Commands", fullHelpMsg);
  }
}

function voteCommand(receivedMsg, arguments, primaryCommand, fullCommand) {
  let voteTitle = constants.voteMsgTitle;
  roleCommand(receivedMsg, arguments, primaryCommand, fullCommand, voteTitle);
}

function wheelCommand(receivedMsg, arguments, primaryCommand, fullCommand) {
  let wheelTitle = constants.wheelMsgTitle;
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
      console.log("members " + members.size);
      if (members.size > 0) {
        let membersArray = members.array();
        // Remove users from members array
        let membersRemove = helperFunc.getMembersMentionedArray(
          receivedMsg,
          arguments,
          1
        );

        console.log("members " + membersRemove.length);
        errMsg = helperFunc.checkMembersArrayForError(membersRemove);
        if (errMsg != "") {
          helperFunc.sendMsg(receivedMsg, errMsg);
          return;
        }

        console.log("msgTitle: " + msgTitle);
        // Set message title
        msgTitle = helperFunc.getCustomMsgMembersRemove(
          primaryCommand,
          fullCommand,
          mention,
          arguments,
          membersRemove,
          msgTitle
        );

        console.log("msg: " + msgTitle);
        console.log("membersArray.length: " + membersArray.length);
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
    errMsg = "Role name required. Try " + helpCommands[primaryCommand]["help"];
  }

  if (errMsg != "") helperFunc.sendMsg(receivedMsg, errMsg);
}

function votePlayersCommand(receivedMsg, arguments) {
  let errMsg = "";
  var msgTitle = constants.voteMsgTitle;
  let membersMentioned = helperFunc.getMembersMentionedArray(
    receivedMsg,
    arguments,
    0
  );

  errMsg = helperFunc.checkMembersArrayForError(membersMentioned);
  if (errMsg != "") {
    helperFunc.sendMsg(receivedMsg, errMsg);
    return;
  }

  msgTitle = helperFunc.getCustomMsgPlayers(
    arguments,
    membersMentioned,
    msgTitle
  );

  if (membersMentioned.length > 0) {
    let validMembersMentioned = membersMentioned.filter(
      (member) => !member.user.bot
    );

    if (validMembersMentioned.length > 0) {
      var memberCount = 0;
      var voteMsg = "";

      validMembersMentioned.forEach((member) => {
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
    } else {
      errMsg = constants.onlyBotsMentioned;
    }
  } else {
    errMsg =
      constants.noMembersMentioned +
      " Try " +
      helpCommands["voteplayers"]["help"];
  }
  if (errMsg != "") helperFunc.sendMsg(receivedMsg, errMsg);
}

function wheelPlayersCommand(receivedMsg, arguments) {
  let errMsg = "";
  var msgTitle = constants.wheelMsgTitle;
  let membersMentioned = helperFunc.getMembersMentionedArray(
    receivedMsg,
    arguments,
    0
  );

  errMsg = helperFunc.checkMembersArrayForError(membersMentioned);
  if (errMsg != "") {
    helperFunc.sendMsg(receivedMsg, errMsg);
    return;
  }

  msgTitle = helperFunc.getCustomMsgPlayers(
    arguments,
    membersMentioned,
    msgTitle
  );

  if (membersMentioned.length > 0) {
    let validMembersMentioned = membersMentioned.filter(
      (member) => !member.user.bot
    );

    if (validMembersMentioned.length > 0) {
      let memberIndex =
        helperFunc.getRandomNumber(validMembersMentioned.length) - 1;
      let chosenMember = validMembersMentioned[memberIndex];
      let msg =
        "**" + chosenMember.displayName + "** has been chosen by the wheel!";
      helperFunc.sendMsgMemberEmbed(receivedMsg, msgTitle, msg, chosenMember);
    } else {
      errMsg = constants.onlyBotsMentioned;
    }
  } else {
    errMsg =
      constants.noMembersMentioned +
      " Try " +
      helpCommands["wheelplayers"]["help"];
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
