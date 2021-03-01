# Discord-Werewolf-Bot

## Setup
I used [this tutorial](https://www.devdungeon.com/content/javascript-discord-bot-tutorial) to get my environment set up, and will be reffering to it below.

<strong>Creating your own test instance of the bot</strong>
<ol>
<li>Follow the instructions for "Create a Discord App" in the tutorial</li>
<li>Follow the instructions for "Create a bot user for your app" in the tutorial</li>
<li>Under Settings, click on OAuth2.</li>
<ol>
<li>Scroll down to Scopes and check bot.</li>
<li>Scroll down to Bot Permissions and check the following in Text Permissions</li>
<ul>
<li>Send Messages</li>
<li>Manage Messages</li>
<li>Embed Links</li>
<li>Attach Files</li>
<li>Read Message History</li>
<li>Mention Everyone</li>
<li>Use External Emojis</li>
<li>Add Reactions</li>
</ul>
</ol>
<li>Click on Copy to copy the URL under Scopes.</li>
<li>Go to that URL and invite your bot to your test Discord server.</strong></li>
<li>It will be offline...for now</li>
</ol>

<strong>Setting up your Project Workspace</strong>
<ol>
<li>Install <a href=https://nodejs.org/en/download/>Node.js</a></li>
<li>Install an IDE of your choice. I use <a href=https://code.visualstudio.com/>Visual Studio Code</a> with these plugins:</li>
<ol>
<li><a href=https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>Prettier - Code formatter</a></li>
<li><a href=https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github
	https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github>GitHub Pull Requests and Issues</a> - If you want to be a collaborator, let me know</li>
</ol>
<li>Clone this repository to a chosen directory on your machine</li>
<li>Delete the nodes_module direcotry if it is there</li>
<li>Open command prompt in the directory and run <code>npm install discord.js</code> (Refer to Install the Discord.js module section in the tutorial) This will add the node_modules directory</li>
<li>Add a file named ".env" to your directory. Inside should be one line <code>DISCORD_TOKEN:secret_token</code>.</li> 
<ul>
<li>Replace secret_token with your bot's secret token. On the Discord bot application page go to Settings > Bot > Click on Copy under TOKEN</li>
</ul>
<li>In command prompt, run <code>node dwwb.js</code></li>
<li>Your bot should now be online!</li>
<li>Ctrl+C to stop the bot</li>
</ol>
