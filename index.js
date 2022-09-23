const Discord = require('discord.js');
const {DisTube} = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const path = require('node:path');
const fs = require('node:fs');
const {REST} = require("@discordjs/rest")
require('dotenv').config();
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildVoiceStates
    ]
});
client.distube = new DisTube(client, {
	leaveOnStop: true,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
	emitAddListWhenCreatingQueue: true,
	plugins: [
		new SpotifyPlugin({
		  emitEventsAfterFetching: true
		}),
		new SoundCloudPlugin(),
		new YtDlpPlugin()
	]
})
client.commands = new Discord.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const cmds = []
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
	cmds.push(command.data)
}

rest.put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), { body: cmds })
	.then((data) => console.log(`Successfully registered ${data.length} commands.`))
	.catch(console.error);

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

const distubeEventsPath = path.join(__dirname, 'events/distube');
const distubeEventFiles = fs.readdirSync(distubeEventsPath).filter(file => file.endsWith('.js'));

for (const file of distubeEventFiles) {
	const distubeFilePath = path.join(distubeEventsPath, file);
	const devent = require(distubeFilePath);
	if (devent.once) {
		client.distube.once(devent.name, (...args) => devent.execute(...args));
	} else {
		client.distube.on(devent.name, (...args) => devent.execute(...args));
	}
}

client.login(process.env.TOKEN);