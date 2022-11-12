const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('Get some help'),
    async execute(interaction) {
        const p = "/"
        const infoEmbed = new Discord.EmbedBuilder()
            .setColor('#57a3bd')
            .setTitle('Help')
            .setURL('https://www.youtube.com/watch?v=0iaNqJN5MTM')
            .setDescription(`
            Commands Available :
          `)
            .addFields(
                { name: '━━ 🎶 ・ Music commands ━━', value: `\`${p}play\`, \`${p}stop\`, \`${p}skip\`, \`${p}forceskip\`, \`${p}queue\`, \`${p}nowplaying\`, \`${p}pause\`, \`${p}resume\`, \`${p}remove\`` },
                { name: '឵឵  ឵឵  ឵឵', value: '឵឵  ឵឵  ឵឵' },
                { name: '━━ 🤖 ・ General commands ━━', value: `\`${p}ping\`, \`${p}help\`, \`${p}snipe\`` },
            )
        interaction.reply({ embeds: [infoEmbed] }).catch(console.error)
    },
};
