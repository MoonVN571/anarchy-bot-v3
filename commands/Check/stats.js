var Scriptdb = require('script.db');
var { MessageEmbed } = require('discord.js');

module.exports = {
    name: "stats",
    description: "Xem chỉ số người chơi.",
    aliases: ['kd', 'stats'],
    delay: 5,
    
    async execute(client, message, args) {
		if (!args[0]) return message.reply({embeds: [client.inputUsername]});

		const kd = new Scriptdb(`./data/kd/${args[0]}.json`);
		let deads = kd.get('deaths');
		let kills = kd.get('kills');

		if (kills == undefined && deads == undefined) return message.reply({embeds: [client.userNotFound]});

        if(kills == undefined) kills = 0;
        if(deads == undefined) deads = 0;

		var ratio = kills / deads;
		var ratioFixed = ratio.toFixed(2);

		if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
			ratioFixed = "0.00";
		}

        var embed = new MessageEmbed()
                        .setAuthor(`${args[0]}'s statistics`, `https://minotar.net/helm/${args[0]}`, `https://namemc.com/` + args[0])
                        .addField(`Kills`, `${kills}`, true)
                        .addField(`Deaths`, `${deads}`, true )
                        .addField(`K/D Ratio`, `${ratioFixed}`, true )
                        .setThumbnail(`https://minotar.net/helm/${args[0]}`)
                        .setColor(0x2EA711)
                        .setFooter(client.FOOTER, 'https://cdn.discordapp.com/avatars/768448728125407242/f18ec971961b23db96e6cf0f3f79ec1c.png?size=256')
                        .setTimestamp();

        message.reply({embeds: [embed]});
    }
}