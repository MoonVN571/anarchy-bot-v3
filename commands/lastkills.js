var Discord = require('discord.js');
var Scriptdb = require('script.db');

var a = require("../api")
var api = new a();

module.exports = {
    name: "lastwords",
    description: "lastwords command.",
    aliases: ['fw'],
    
    async execute(client, message, args) {
		if (!args[0]) return message.channel.send(client.userNotFound)

		let quote = new Scriptdb(`./data/quotes/${args[0]}.json`)
		let msgs = quote.get('kills')
		let times = quote.get('times')
		
		if (msgs === undefined || times == undefined) return message.channel.send(client.userNotFound);

		var data = msgs.split(" | ")[0];
		var time = times.split(" | ")[0];

        var embed = new Discord.MessageEmbed()
                            .setDescription("**" +api.ageCalc(time) + " trước**: " + data)
                            .setColor(0x2EA711)

        message.channel.send(embed);
    }
}