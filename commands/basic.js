const helperFunc = require("../helperFunctions.js");
const constants = require("../constants.json");

const pgSus = constants.pgSus;

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

module.exports = { yesNoCommand, randomNumberCommand, pgSusCommand };
