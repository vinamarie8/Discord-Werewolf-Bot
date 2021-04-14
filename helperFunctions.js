const Discord = require("discord.js");
const constants = require("./constants.json");
const emojiRegex = require("emoji-regex/text.js");
const { Util } = require("discord.js");

function sendImg(receivedMsg, imageName, textMsg) {
  if (imageName == "idol") {
    imageNumber = getRandomNumber(constants.maxImageNumber);
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

function getCustomMsgFromArguments(defaultMsg, arguments, index, receivedMsg) {
  let returnMsg = defaultMsg;
  let argsWanted = arguments.slice(index);

  argsWanted = getArgsCleaned(argsWanted, receivedMsg);
  let customMsg = argsWanted.join(" ");
  if (customMsg.length > 1) {
    returnMsg = customMsg;
  }
  return returnMsg;
}

function getArgsCleaned(argsToClean, receivedMsg) {
  // Replace mention with string
  console.log("args before:" + argsToClean);
  for (var i in argsToClean) {
    let mentionedRole = getRoleFromMention(argsToClean[i], receivedMsg);
    if (mentionedRole) {
      argsToClean[i] = "@" + mentionedRole.name;
      continue;
    }

    let mentionedMember = getUserFromMention(argsToClean[i], receivedMsg);
    if (mentionedMember) {
      argsToClean[i] = "@" + mentionedMember.displayName;
      continue;
    }
  }
  console.log("args after:" + argsToClean);
  return argsToClean;
}

function getCustomMsgMembersRemove(fullArgs, mention, arguments, membersRemove, msgTitle, receivedMsg) {
  let membersRemoveCount = membersRemove.length;
  let msgIndex = membersRemoveCount + 1;
  console.log("membersRemoveCount: " + membersRemoveCount);
  if (membersRemoveCount > 0 && !(arguments[msgIndex] == undefined)) {
    msgTitle = getCustomMsgFromArguments(msgTitle, arguments, msgIndex, receivedMsg);
  } else if (!(membersRemoveCount > 0)) {
    msgTitle = getCustomMsgFromArguments(msgTitle, arguments, 1, receivedMsg);
  }
  return msgTitle;
}

function getCustomMsgPlayers(arguments, membersMentioned, msgTitle, receivedMsg) {
  let membersMentionedCount = membersMentioned.length;
  let msgIndex = membersMentionedCount;
  if (membersMentionedCount > 0 && !(arguments[msgIndex] == undefined)) {
    msgTitle = getCustomMsgFromArguments(msgTitle, arguments, msgIndex, receivedMsg);
  }
  return msgTitle;
}

async function sendMsgWithReacts(receivedMsg, sendMsg, sendMsgTitle, reacts, reactCount, primaryCommand) {
  const msg = await sendMsgEmbed(receivedMsg, sendMsgTitle, sendMsg);
  // Discord limit of 20 reacts/msg
  let reactLimit = 20;
  if (primaryCommand == "vote") reactLimit = 19;
  if (reactCount > reactLimit) reactCount = reactLimit;

  // Add reacts
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
  if (mention == "@everyone") {
    return receivedMsg.guild.roles.cache.get(receivedMsg.guild.roles.everyone.id);
  }
}

function getUserFromMention(mention, receivedMsg) {
  if (!mention) return;
  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }
    return receivedMsg.guild.members.cache.get(mention);
  }
}

function getMembersMentionedArray(receivedMsg, arguments, startIndex) {
  const membersMentioned = [];
  let err = [];
  // startIndex is 1 when a role is mentioned since we only want members mentioned.
  for (let i = startIndex; i < arguments.length; i++) {
    argString = arguments[i];
    // Stop if a role is mentioned
    if (argString.startsWith("<@&")) {
      err.push("role");
      err.push(argString);
      return err;
    }
    // Look for users mentioned
    if (argString.startsWith("<@")) {
      let member = getUserFromMention(argString, receivedMsg);
      if (!member) {
        err.push("notmember");
        err.push(argString);
        return err;
      }
      membersMentioned.push(member);
    } else {
      break;
    }
  }
  return membersMentioned;
}

function checkMembersArrayForError(membersArray) {
  let errMsg = "";
  if (membersArray.length > 0) {
    console.log("memberid: " + membersArray[0].id);
    if (membersArray[0].id) return errMsg;
    console.log("membersArray[0]: " + membersArray[0]);
    let errType = membersArray[0].toString();
    let errArg = membersArray[1].toString();
    switch (errType) {
      case "role":
        errMsg = errArg + " is a role. Only specific users can be mentioned.";
        break;
      case "notmember":
        errMsg = errArg + " is not part of this server.";
        break;
      default:
        errMsg = "Oops, sorry! There was an error. Check the formatting and try again.";
        break;
    }
  }
  return errMsg;
}

function getFilteredMembersArray(membersRemove, membersArray) {
  let membersKept = [];
  let membersRemoveCount = membersRemove.length;
  if (membersRemoveCount > 0) {
    membersKept = membersArray.filter((member) => !membersRemove.includes(member));
  } else {
    membersKept = membersArray;
  }
  console.log("membersKept.length:" + membersKept.length);
  return membersKept;
}

function sendMsgEmbed(receivedMsg, title, sendMsg) {
  title = getTrimTitle(title);
  const embed = new Discord.MessageEmbed().setTitle(title).setColor(constants.embedColor).setDescription(sendMsg);
  return receivedMsg.channel.send(embed);
}

function sendMsgMemberEmbed(receivedMsg, title, sendMsg, member) {
  title = getTrimTitle(title);
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(constants.embedColor)
    .setDescription(sendMsg)
    .setImage(member.user.avatarURL());
  return receivedMsg.channel.send(embed);
}

function getTrimTitle(title) {
  if (title.length > 256) {
    let myString = "...MY-";
    title = title.substring(0, 250) + myString;
  }
  return title;
}

function sendMsg(receivedMsg, sendMsg) {
  receivedMsg.channel.send(sendMsg);
}

function cleanPollString(fullArgs, delimiter) {
  let pollArgs = fullArgs.split(delimiter);
  pollArgs.forEach((pollArg, index) => {
    pollArgs[index] = pollArg.trim();
  });
  pollArgs = pollArgs.filter((pollArg) => pollArg !== "");
  return pollArgs;
}

function checkReact(client, reactString, customReacts, choiceMsg) {
  let errMsg = "";

  //Check if it already exists in list of reacts
  const reactExists = customReacts.includes(reactString);
  if (reactExists) return "Sorry, emojis can be used only once.";

  //Check for discord emoji
  console.log("reactstring:" + reactString);
  let discordEmojiMatch = reactString.match(/<a:.+?:\d+>|<:.+?:\d+>/g);
  console.log("discordEmojiMatch:" + discordEmojiMatch);
  let emojiInfo = reactString.match(/<(a?):(\w+):(\d+)>/);
  console.log("emojiInfo:" + emojiInfo);
  if (discordEmojiMatch != null && emojiInfo != null) {
    console.log("emojiInfo[3]:" + emojiInfo[3]);
    let discordReact = client.emojis.cache.get(emojiInfo[3]);
    console.log("discordReact:" + discordReact);
    if (discordReact == null) {
      return "Sorry, DWWVD/Z Bot does not have access to the emoji '" + reactString + "'";
    } else {
      return discordReact.toString();
    }
  }

  //Check for unicode emoji
  const regexEmoji = emojiRegex();
  let unicodeReactMatch = regexEmoji.exec(reactString);
  let numberOrCharMatch = reactString.match(/[\d*#]/g);
  if (unicodeReactMatch != null && numberOrCharMatch == null) {
    return unicodeReactMatch[0];
  }

  errMsg = "Sorry, no valid emoji found for '" + choiceMsg + "'";

  return errMsg;
}

function checkPollString(fullArgs) {
  if (!fullArgs.includes("|")) {
    return "Format incorrect.";
  }
  if (fullArgs.includes("||")) {
    console.log("before:" + fullArgs);
    fullArgs = replaceSpoilerTag(fullArgs);
    console.log("after:" + fullArgs);
  }
  //Clean up poll string
  let pollArgs = cleanPollString(fullArgs, "|");

  if (pollArgs.length < 2) {
    return "Format incorrect.";
  }

  return pollArgs;
}

function replaceSpoilerTag(fullArgs) {
  // Temporarily replace spoiler tag so that it does not interfere with '|' delimiter
  return fullArgs.split("||").join("@#$%^spoiler@#$%^");
}

function restoreSpoilerTag(pollString) {
  // Put spoiler tag back
  return pollString.split("@#$%^spoiler@#$%^").join("||");
}

module.exports = {
  sendImg,
  getRandomNumber,
  getCustomMsgFromArguments,
  getCustomMsgMembersRemove,
  getCustomMsgPlayers,
  sendMsgWithReacts,
  getRoleFromMention,
  getUserFromMention,
  getMembersMentionedArray,
  checkMembersArrayForError,
  getFilteredMembersArray,
  sendMsgEmbed,
  sendMsgMemberEmbed,
  sendMsg,
  cleanPollString,
  checkReact,
  checkPollString,
  restoreSpoilerTag,
};
