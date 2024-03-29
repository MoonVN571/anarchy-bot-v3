const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "kills",
	description: "Xem 5 tin nhắn giết người mới nhất",
	delay: 5,

	async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

		let quotes = new Scriptdb(`./data/kills/${args[0]}.json`)
		let deaths = quotes.get('deaths')
		let times = quotes.get('times')

		if (!times || !deaths) return message.userNotFound();

		var msg0;
		var msg1;
		var msg2;
		var msg3;
		var msg4;

		var time0;
		var time1;
		var time2;
		var time3;
		var time4;

		if (times.toString().split(" | ")) {
			if (times.toString().split(" | ").length <= 5) {
				time0 = times.toString().split(" | ")[0]
				time1 = times.toString().split(" | ")[1]
				time2 = times.toString().split(" | ")[2]
				time3 = times.toString().split(" | ")[3]
				time4 = times.toString().split(" | ")[4]

				msg0 = deaths.toString().split(" | ")[0]
				msg1 = deaths.toString().split(" | ")[1]
				msg2 = deaths.toString().split(" | ")[2]
				msg3 = deaths.toString().split(" | ")[3]
				msg4 = deaths.toString().split(" | ")[4]
			} else {
				time0 = times.toString().split(" | ")[times.toString().split(" | ").length - 1]
				time1 = times.toString().split(" | ")[times.toString().split(" | ").length - 2]
				time2 = times.toString().split(" | ")[times.toString().split(" | ").length - 3]
				time3 = times.toString().split(" | ")[times.toString().split(" | ").length - 4]
				time4 = times.toString().split(" | ")[times.toString().split(" | ").length - 5]

				msg0 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 1]
				msg1 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 2]
				msg2 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 3]
				msg3 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 4]
				msg4 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 5]
			}

			var data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
				+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
				+ `***${api.ageCalc(time2)} trước***: ${msg2}\n`
				+ `***${api.ageCalc(time3)} trước***: ${msg3}\n`
				+ `***${api.ageCalc(time4)} trước***: ${msg4}`

			if (time4 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
					+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
					+ `***${api.ageCalc(time2)} trước***: ${msg2}\n`
					+ `***${api.ageCalc(time3)} trước***: ${msg3}`
			}

			if (time3 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
					+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
					+ `***${api.ageCalc(time2)} trước***: ${msg2}`
			}

			if (time2 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
					+ `***${api.ageCalc(time1)} trước***: ${msg1}`
			}

			if (time1 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}`
			}

			var embed = new MessageEmbed()
				.setTitle(`Báo cáo của ${args[0]}`)
				.setDescription(`*Tổng số ghi nhận người này: ${deaths.toString().split(" | ").length}*\n`)
				.addField('*5 lần chết gần đây*', data + "\n")
				.setFooter(client.footer)
				.setTimestamp()
				.setColor(0x2EA711);

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
		} else {
			var embed = new MessageEmbed()
				.setTitle(`Báo cáo của ${args[0]}`)
				.setDescription(`*Tổng số ghi nhận người này: 1*\n`)
				.addField('*5 lần chết gần đây*', deaths + "\n")
				.setTimestamp()
				.setColor(0x2EA711);

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
		}
	}
}