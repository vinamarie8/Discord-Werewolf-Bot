const Discord = require("discord.js");
const constants = require("./constants.json");

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

function getCustomMsg(defaultMsg, primaryCommand, fullCommand, mention) {
  let returnMsg = defaultMsg;
  let customMsg = fullCommand.split(primaryCommand + " " + mention + " ");
  if (customMsg.length > 1) {
    returnMsg = customMsg[1];
  }
  return returnMsg;
}

function getCustomMsgFromArguments(defaultMsg, arguments, index) {
  let returnMsg = defaultMsg;
  let argsWanted = arguments.slice(index);
  let customMsg = argsWanted.join(" ");
  if (customMsg.length > 1) {
    returnMsg = customMsg;
  }
  return returnMsg;
}

function getCustomMsgMembersRemove(
  primaryCommand,
  fullCommand,
  mention,
  arguments,
  membersRemove,
  msgTitle
) {
  let membersRemoveCount = membersRemove.length;
  let msgIndex = membersRemoveCount + 1;
  if (membersRemoveCount > 0 && !(arguments[msgIndex] == undefined)) {
    msgTitle = getCustomMsgFromArguments(msgTitle, arguments, msgIndex);
  } else if (!(membersRemoveCount > 0)) {
    msgTitle = getCustomMsg(msgTitle, primaryCommand, fullCommand, mention);
  }
  return msgTitle;
}

function getCustomMsgVotePlayers(arguments, membersMentioned, msgTitle) {
  let membersMentionedCount = membersMentioned.length;
  let msgIndex = membersMentionedCount;
  if (membersMentionedCount > 0 && !(arguments[msgIndex] == undefined)) {
    msgTitle = getCustomMsgFromArguments(msgTitle, arguments, msgIndex);
  }
  return msgTitle;
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

function getUserFromMention(mention, receivedMsg) {
  if (!mention) return;
  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(3, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }
    return receivedMsg.guild.members.cache.get(mention);
  }
}

function getMembersRemoveArray(receivedMsg, arguments) {
  const membersRemove = [];
  for (let i = 1; i < arguments.length; i++) {
    argString = arguments[i];
    // Stop if a role is mentioned
    if (argString.startsWith("<@&")) {
      const err = ["role"];
      return err;
    }
    // Look for users mentioned
    if (argString.startsWith("<@")) {
      let member = getUserFromMention(argString, receivedMsg);
      membersRemove.push(member);
    } else {
      break;
    }
  }
  return membersRemove;
}

function getMembersMentionedArray(receivedMsg, arguments) {
  const membersMentioned = [];
  for (let i = 0; i < arguments.length; i++) {
    argString = arguments[i];
    // Stop if a role is mentioned
    if (argString.startsWith("<@&")) {
      const err = ["role"];
      return err;
    }
    // Look for users mentioned
    if (argString.startsWith("<@")) {
      let member = getUserFromMention(argString, receivedMsg);
      membersMentioned.push(member);
    } else {
      break;
    }
  }
  return membersMentioned;
}

function getFilteredMembersArray(membersRemove, membersArray) {
  let membersKept = [];
  let membersRemoveCount = membersRemove.length;
  if (membersRemoveCount > 0) {
    membersKept = membersArray.filter(
      (member) => !membersRemove.includes(member)
    );
  } else {
    membersKept = membersArray;
  }
  console.log(membersKept.length);
  return membersKept;
}

function sendMsgEmbed(receivedMsg, title, sendMsg) {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(constants.embedColor)
    .setDescription(sendMsg);
  return receivedMsg.channel.send(embed);
}

function sendMsgMemberEmbed(receivedMsg, title, sendMsg, member) {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(constants.embedColor)
    .setDescription(sendMsg)
    .setImage(member.user.avatarURL());
  return receivedMsg.channel.send(embed);
}

function sendMsg(receivedMsg, sendMsg) {
  receivedMsg.channel.send(sendMsg);
}

module.exports = {
  sendImg,
  getRandomNumber,
  getCustomMsg,
  getCustomMsgFromArguments,
  getCustomMsgMembersRemove,
  getCustomMsgVotePlayers,
  sendMsgWithReacts,
  getRoleFromMention,
  getUserFromMention,
  getMembersRemoveArray,
  getMembersMentionedArray,
  getFilteredMembersArray,
  sendMsgEmbed,
  sendMsgMemberEmbed,
  sendMsg,
};
