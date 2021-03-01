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
  console.log(customMsg);
  if (customMsg.length > 1) {
    returnMsg = customMsg;
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
  sendMsgWithReacts,
  getRoleFromMention,
  getUserFromMention,
  sendMsgEmbed,
  sendMsgMemberEmbed,
  sendMsg,
};
