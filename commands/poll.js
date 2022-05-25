const helperFunc = require("../helperFunctions.js");
const constants = require("../constants.json");
const newLineDouble = "\n\n";
const helpCommands = constants.helpCommands;

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

function pollReactsCommand(receivedMsg, primaryCommand, fullArgs, client) {
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

module.exports = { pollCommand, pollReactsCommand };
