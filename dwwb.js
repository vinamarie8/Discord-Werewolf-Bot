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
  } else if (primaryCommand == "multiply") {
    multiplyCommand(arguments, receivedMessage);
  } else {
    receivedMessage.channel.send(
      "I don't understand the command. Try `!help` or `!multiply`"
    );
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

function multiplyCommand(arguments, receivedMessage) {
  if (arguments.length < 2) {
    receivedMessage.channel.send(
      "Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`"
    );
    return;
  }
  let product = 1;
  arguments.forEach((value) => {
    product = product * parseFloat(value);
  });
  receivedMessage.channel.send(
    "The product of " +
      arguments +
      " multiplied together is: " +
      product.toString()
  );
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token =
  "ODE0MzY2MTE1MzkxNDcxNjE2.YDczjA.o7GVm-T0KczzeL2mfYqmAa0JKEs";

client.login(bot_secret_token);
