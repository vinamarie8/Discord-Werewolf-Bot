var moment = require("moment-timezone");

const constants = require("../constants.json");
const helperFunc = require("../helperFunctions.js");

// case "timezones":
//   timeCommand(receivedMsg, arguments, fullArgs);
//   break;
// case "mytimezone":
// case "mytz":
//   myTimezoneCommand(receivedMsg, arguments, fullArgs);
//   break;

function myTimezoneCommand(receivedMsg, args, fullArgs) {
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
  // "timezones": {
  //   "help": "`!timezones time_in_eastern`",
  //   "desc": "Get a list of times converted from Eastern time"
  // },
  // "mytimezone": {
  //   "help": "`!mytimezone time_in_eastern` or `!mytz time_in_eastern`",
  //   "desc": "Get your time converted from Eastern time"
  // }
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
