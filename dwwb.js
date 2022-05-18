const Discord = require("discord.js");
const helperFunc = require("./helperFunctions.js");
require("dotenv").config();
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const constants = require("./constants.json");
const newLine = "\n";
const newLineDouble = "\n\n";
const helpCommands = constants.helpCommands;
const pgSus = constants.pgSus;
const emojiRegex = require("emoji-regex/text.js");
var moment = require("moment-timezone");

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
  let fullArgs = arguments.join(" ");

  //Clean string from mentions - replace mention id with plain string
  let processStringCleaned = receivedMsg.cleanContent;
  let fullCommandCleaned = processStringCleaned.substr(1);
  let splitCommandCleaned = fullCommandCleaned.split(" ");
  let argsCleaned = splitCommandCleaned.slice(1);
  let fullArgsCleaned = argsCleaned.join(" ");

  console.log("Command received:" + primaryCommand);
  console.log("Arguments:" + arguments); // There may not be any arguments
  console.log("Arguments combined:" + fullArgs);

  primaryCommand = String(primaryCommand).toLowerCase();
  if (prefix == "?") {
    if (primaryCommand == "idol") {
      helperFunc.sendImg(receivedMsg, primaryCommand, "💯0% real");
    }
  } else {
    let tazCommandArg = "";
    if (String(primaryCommand).includes("taz")) {
      tazCommandArg = primaryCommand;
      primaryCommand = "taz";
    }
    switch (primaryCommand) {
      case "help":
        helpCommand(receivedMsg, arguments);
        break;
      case "timezones":
        timeCommand(receivedMsg, arguments, fullArgs);
        break;
      case "mytimezone":
      case "mytz":
        myTimezoneCommand(receivedMsg, arguments, fullArgs);
        break;
      case "vote":
        voteCommand(receivedMsg, arguments, primaryCommand, fullArgs);
        break;
      case "voteplayer":
      case "voteplayers":
      case "vp":
        votePlayersCommand(receivedMsg, arguments, "voteplayers");
        break;
      case "wheelplayer":
      case "wheelplayers":
      case "wp":
        wheelPlayersCommand(receivedMsg, arguments, "wheelplayers");
        break;
      case "wheel":
        wheelCommand(receivedMsg, arguments, primaryCommand, fullArgs);
        break;
      case "yn":
        yesNoCommand(receivedMsg, fullArgsCleaned);
        break;
      case "taz":
        tazCommand(receivedMsg, tazCommandArg);
        break;
      case "my":
      case "if":
        helperFunc.sendImg(receivedMsg, primaryCommand, "");
        break;
      case "idol":
        helperFunc.sendImg(receivedMsg, primaryCommand, "💯0% real");
        break;
      case "random":
      case "number":
        randomNumberCommand(receivedMsg, arguments);
        break;
      case "poll":
      case "polltime":
      case "pt":
        pollCommand(receivedMsg, fullArgsCleaned);
        break;
      case "pollreacts":
      case "pr":
        pollReactsCommand(receivedMsg, primaryCommand, fullArgsCleaned);
        break;
      case "pgsus":
        pgSusCommand(receivedMsg);
        break;
      case "howlsend":
        helperFunc.sendMsg(receivedMsg, "Did you mean bowels end?");
        break;
      case "wolfshold":
        helperFunc.sendMsg(receivedMsg, "BEST HOLD");
        break;
      default:
        break;
    }
  }
}

//#region Command functions
//#region Help
function helpCommand(receivedMsg, arguments) {
  if (arguments.length > 0) {
    var command = String(arguments[0]).toLowerCase();
    var helpMsgTitle = "How to use `" + command + "`";
    var helpMsg = "";
    var commandFound = true;

    // Shourcuts/alternate commands
    switch (command) {
      case "number":
        command = "random";
        break;
      case "vp":
        command = "voteplayers";
        break;
      case "wp":
        command = "wheelplayers";
        break;
      case "polltime":
      case "pt":
        command = "poll";
        break;
      case "pr":
        command = "pollreacts";
        break;
    }

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
    fullHelpMsg +=
      "Type `!help command` to get info on a command." +
      newLine +
      "List of commands:" +
      newLine;
    Object.keys(helpCommands).forEach((command) => {
      fullHelpMsg += "`" + command + "`,";
    });

    helperFunc.sendMsgEmbed(receivedMsg, "Commands", fullHelpMsg);
  }
}
//#endregion Help

//#region Role Commands
function voteCommand(receivedMsg, arguments, primaryCommand, fullArgs) {
  roleCommand(
    receivedMsg,
    arguments,
    primaryCommand,
    fullArgs,
    constants.voteMsgTitle
  );
}

function wheelCommand(receivedMsg, arguments, primaryCommand, fullArgs) {
  roleCommand(
    receivedMsg,
    arguments,
    primaryCommand,
    fullArgs,
    constants.wheelMsgTitle
  );
}

function roleCommand(
  receivedMsg,
  arguments,
  primaryCommand,
  fullArgs,
  msgTitle
) {
  const mention = arguments[0];
  const roleMentioned = helperFunc.getRoleFromMention(
    String(mention),
    receivedMsg
  );
  let errMsg = "";

  console.log(receivedMsg);
  console.log("cleaned" + receivedMsg.cleanContent);
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
          fullArgs,
          mention,
          arguments,
          membersRemove,
          msgTitle,
          receivedMsg
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
//#endregion Role Commands

//#region Players Commands
function votePlayersCommand(receivedMsg, arguments, primaryCommand) {
  playersCommand(
    receivedMsg,
    arguments,
    primaryCommand,
    constants.voteMsgTitle
  );
}

function wheelPlayersCommand(receivedMsg, arguments, primaryCommand) {
  playersCommand(
    receivedMsg,
    arguments,
    primaryCommand,
    constants.wheelMsgTitle
  );
}

function playersCommand(receivedMsg, arguments, primaryCommand, msgTitle) {
  let errMsg = "";
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
    msgTitle,
    receivedMsg
  );

  if (membersMentioned.length > 0) {
    let validMembersMentioned = membersMentioned.filter(
      (member) => !member.user.bot
    );

    if (validMembersMentioned.length > 0) {
      switch (primaryCommand) {
        case "wheelplayers":
          let memberIndex =
            helperFunc.getRandomNumber(validMembersMentioned.length) - 1;
          let chosenMember = validMembersMentioned[memberIndex];
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
        case "voteplayers":
          var memberCount = 0;
          var voteMsg = "";

          validMembersMentioned.forEach((member) => {
            voteMsg =
              voteMsg +
              constants.reactsAlphabet[memberCount] +
              " " +
              member.displayName +
              newLineDouble;
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
      errMsg = constants.onlyBotsMentioned;
    }
  } else {
    errMsg =
      constants.noMembersMentioned +
      " Try " +
      helpCommands[primaryCommand]["help"];
  }
  if (errMsg != "") helperFunc.sendMsg(receivedMsg, errMsg);
}
//#endregion Players Commands

//#region Other Commands
function myTimezoneCommand(receivedMsg, args, fullArgs) {
  console.log(receivedMsg);
  const utcTimeString = helperFunc.getUtcTimeString(
    fullArgs,
    "America/New_York"
  );
  const msgMoment = moment(receivedMsg.createdTimestamp);
  const tzName = moment.tz.names().find((timezoneName) => {
    return msgMoment.format("ZZ") === moment.tz(timezoneName).format("ZZ");
  });

  helperFunc.sendMsg(
    receivedMsg,
    helperFunc.convertToTimeString(utcTimeString, tzName, "(beta)")
  );
}

function timeCommand(receivedMsg, args, fullArgs) {
  const utcTimeString = helperFunc.getUtcTimeString(
    fullArgs,
    "America/New_York"
  );

  let returnMsg = "";
  constants.timezones.forEach((tz) => {
    returnMsg += helperFunc.convertToTimeString(
      utcTimeString,
      tz.timeZoneName,
      tz.timeZoneDesc
    );
  });

  helperFunc.sendMsg(receivedMsg, returnMsg);
}

function yesNoCommand(receivedMsg, fullArgs) {
  let pollMsg = "Yes or No?";
  let customMsg = fullArgs;
  let reactsYN = ["👍", "👎"];
  if (customMsg.length > 1) {
    pollMsg = customMsg + "\n";
  }
  helperFunc.sendMsgWithReacts(receivedMsg, "", pollMsg, reactsYN, 2, "yn");
}

function randomNumberCommand(receivedMsg, arguments) {
  let maxNum = 20;
  if (arguments.length > 0) {
    maxNum = arguments[0];
  }
  if (maxNum > 0 && maxNum % 1 === 0) {
    let randomNumTitle = "Random number between 1 and " + maxNum;
    let randomNum = helperFunc.getRandomNumber(maxNum);
    helperFunc.sendMsgEmbed(receivedMsg, randomNumTitle, randomNum);
  } else {
    helperFunc.sendMsg(receivedMsg, "Please enter a positive whole number.");
  }
}

function pgSusCommand(receivedMsg) {
  const msg = pgSus[helperFunc.getRandomNumber(pgSus.length) - 1];
  helperFunc.sendMsg(receivedMsg, msg);
}

function tazCommand(receivedMsg, tazCommandArg) {
  switch (tazCommandArg) {
    case "birthdaytaz":
    case "byetaz":
    case "christmastaz":
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
      helperFunc.sendImg(receivedMsg, tazCommandArg, "");
      break;
    case "celebrationtaz":
    case "celebratetaz":
    case "caketaz":
    case "partytaz":
      helperFunc.sendImg(receivedMsg, "birthdaytaz", "");
      break;
    case "xmastaz":
    case "santataz":
    case "holidaytaz":
      helperFunc.sendImg(receivedMsg, "christmastaz", "");
      break;
    case "questiontaz":
    case "questionmarktaz":
      helperFunc.sendImg(receivedMsg, "confusedtaz", "");
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
    case "hearttaz":
    case "heartstaz":
    case "lovetaz":
      helperFunc.sendImg(receivedMsg, "happytaz", "");
      break;
    case "crytaz":
    case "saddesttaz":
      helperFunc.sendImg(receivedMsg, "sadtaz", "");
      break;
    case "thankstaz":
    case "tytaz":
      helperFunc.sendImg(receivedMsg, "thankyoutaz", "");
      break;
    case "angrytaz":
    case "grumpytaz":
    case "eyerolltaz":
      helperFunc.sendImg(receivedMsg, "unamusedtaz", "");
      break;
    case "oktaz":
      helperFunc.sendImg(receivedMsg, "thumbsuptaz", "");
      break;
  }
}
//#endregion Other Commands

//#region Poll Commands
function pollCommand(receivedMsg, fullArgs) {
  console.log(fullArgs);
  let checkPollArgs = helperFunc.checkPollString(fullArgs);
  if (typeof checkPollArgs === "string") {
    let errMsg = checkPollArgs + " Try " + helpCommands["poll"]["help"];
    helperFunc.sendMsg(receivedMsg, errMsg);
    return;
  }
  let pollArgs = checkPollArgs;

  // Build poll message
  let question = pollArgs[0];
  let choices = pollArgs.slice(1);
  let pollMsg = "";
  choices.forEach((choice, index) => {
    pollMsg =
      pollMsg + constants.reactsAlphabet[index] + " " + choice + newLineDouble;
  });
  console.log("before:" + pollMsg);
  question = helperFunc.restoreSpoilerTag(question);
  pollMsg = helperFunc.restoreSpoilerTag(pollMsg);
  console.log("after:" + pollMsg);
  helperFunc.sendMsgWithReacts(
    receivedMsg,
    pollMsg,
    question,
    constants.reactsAlphabet,
    choices.length,
    "poll"
  );
}

function pollReactsCommand(receivedMsg, primaryCommand, fullArgs) {
  console.log(String(fullArgs));
  let checkPollArgs = helperFunc.checkPollString(fullArgs);
  if (typeof checkPollArgs === "string") {
    let errMsg = checkPollArgs + " Try " + helpCommands["pollreacts"]["help"];
    helperFunc.sendMsg(receivedMsg, errMsg);
    return;
  }
  let pollArgs = checkPollArgs;

  // Build poll message
  let question = pollArgs[0];
  let choices = pollArgs.slice(1);
  let pollMsg = "";
  let customReacts = [];
  var errMsg = "";
  choices.every((choice, index) => {
    // Check formatting
    let choiceArgs = helperFunc.cleanPollString(choice, "=");
    console.log(choiceArgs);
    console.log(choiceArgs.length);
    if (choiceArgs.length != 2) {
      console.log(errMsg);
      errMsg =
        "Sorry, one '=' is required per choice. Try " +
        helpCommands["pollreacts"]["help"];
      return false;
    }

    let choiceMsg = choiceArgs[0];
    let choiceReact = choiceArgs[1];
    // Check if react is valid
    checkReact = helperFunc.checkReact(
      client,
      choiceReact,
      customReacts,
      choiceMsg
    );
    let strReturned =
      typeof checkReact === "string" &&
      Object.prototype.toString.call(checkReact) === "[object String]";
    if (strReturned && checkReact != "" && checkReact.startsWith("Sorry")) {
      errMsg = checkReact;
      return false;
    } else {
      choiceReact = checkReact;
    }

    // Add choice and react to poll message
    pollMsg = pollMsg + choiceReact + " " + choiceMsg + newLineDouble;
    customReacts.push(choiceReact);
    return true;
  });

  // Send poll with reacts
  if (errMsg == "") {
    console.log(pollMsg + " " + question);
    console.log(customReacts);
    question = helperFunc.restoreSpoilerTag(question);
    pollMsg = helperFunc.restoreSpoilerTag(pollMsg);
    helperFunc.sendMsgWithReacts(
      receivedMsg,
      pollMsg,
      question,
      customReacts,
      customReacts.length,
      primaryCommand
    );
  } else {
    helperFunc.sendMsg(receivedMsg, errMsg);
  }
}
//#endregion Poll Commands

//#endregion

client.login();
