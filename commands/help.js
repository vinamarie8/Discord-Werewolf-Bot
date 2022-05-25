const constants = require("../constants.json");
const helperFunc = require("../helperFunctions.js");

const newLine = "\n";
const newLineDouble = "\n\n";
const helpCommands = constants.helpCommands;

function getTrueCommand(commandString) {
  // Shourcuts/alternate commands
  let command = commandString;
  switch (commandString) {
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
  return command;
}

function sendSingleCommandMsg(receivedMsg, arguments) {
  var command = String(arguments[0]).toLowerCase();
  var helpMsgTitle = "How to use `" + command + "`";
  var helpMsg = "";

  command = getTrueCommand(command);

  // Help for individual command
  if (helpCommands[command]) {
    helpMsg =
      helpMsg +
      helpCommands[command]["desc"] +
      newLine +
      helpCommands[command]["help"];
    helperFunc.sendMsgEmbed(receivedMsg, helpMsgTitle, helpMsg);
  } else {
    helpMsg =
      "`" + command + "` not recognized. Try " + constants.availableCommands;
    helperFunc.sendMsg(receivedMsg, helpMsg);
  }
}

function sendFullHelpCommandMsg(receivedMsg) {
  let fullHelpMsg = constants.helpInfo + newLineDouble;
  fullHelpMsg +=
    "Type `!help command` to get info on a command." +
    newLine +
    "List of commands:" +
    newLine +
    constants.availableCommands;

  helperFunc.sendMsgEmbed(receivedMsg, "Commands", fullHelpMsg);
}

function helpCommand(receivedMsg, arguments) {
  if (arguments.length > 0) {
    sendSingleCommandMsg(receivedMsg, arguments);
  } else {
    sendFullHelpCommandMsg(receivedMsg);
  }
}

module.exports = { helpCommand };
