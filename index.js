const Discord = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const {REST} = require("@discordjs/rest")
require('dotenv').config();
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds
    ]
});

client.commands = new Discord.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
	const cmds = []
	cmds.push(command.data)
	rest.put(Discord.Routes.applicationGuildCommands('1020641311176532028','956585752668569701'), { body: cmds })
	  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	  .catch(console.error);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);