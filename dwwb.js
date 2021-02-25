const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
});

client.on("message", (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return;
  }

  if (receivedMessage.content.startsWith("!")) {
    processCommand(receivedMessage);
  }

  if (receivedMessage.content.startsWith("?")) {
    processCommandQuestion(receivedMessage);
  }
});

function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  if (primaryCommand == "help") {
    helpCommand(arguments, receivedMessage);
  } else if (primaryCommand == "vote") {
    voteCommand(arguments, receivedMessage);
  } else {
    receivedMessage.channel.send("I don't understand the command. Try `!help`");
  }
}

function processCommandQuestion(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  if (primaryCommand == "idol") {
    receivedMessage.channel.send("Sorry, got nothing for ya.");
  } else {
    receivedMessage.channel.send("I don't understand the command.");
  }
}

function helpCommand(arguments, receivedMessage) {
  if (arguments.length > 0) {
    receivedMessage.channel.send(
      "It looks like you might need help with " + arguments
    );
  } else {
    receivedMessage.channel.send(
      "I'm not sure what you need help with. Try `!help [topic]`"
    );
  }
}

function voteCommand(mention, receivedMessage) {
  const roleMentioned = getRoleFromMention(String(mention), receivedMessage);

  if (roleMentioned) {
    receivedMessage.channel.send(roleMentioned.name + " selected.");
    let membersWithRole = roleMentioned.members;

    if (membersWithRole.size > 0) {
      membersWithRole.forEach((member) => {
        receivedMessage.channel.send("a member\n" + member.displayName);
      });
    } else {
      receivedMessage.channel.send(
        "There are no members of " + roleMentioned.name + "."
      );
    }
    //receivedMessage.channel.send(roleMentioned.members[0]);
  } else {
    receivedMessage.channel.send(
      "Role name required. Try '!vote @[role name]'"
    );
  }
}

function getRoleFromMention(mention, receivedMessage) {
  if (!mention) return;
  if (mention.startsWith("<@&") && mention.endsWith(">")) {
    mention = mention.slice(3, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }

    return receivedMessage.guild.roles.cache.get(mention);
  }
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token =
  "ODE0MzY2MTE1MzkxNDcxNjE2.YDczjA.o7GVm-T0KczzeL2mfYqmAa0JKEs";

client.login(bot_secret_token);
