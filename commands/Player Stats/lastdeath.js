const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "lastdeath",
    description: "Xem tin nhắn đã chết mới nhất",
    delay: 5,

    async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

        let quote = new Scriptdb(`./data/deaths/${args[0]}.json`)
        let msgs = quote.get('deaths')
        let times = quote.get('times')

        if (!msgs || !times) return message.userNotFound();

        var data;
        var time;

        try {
            data = msgs.split(" | ")[0];
        } catch (e) {
            data = msgs;
        }

        try {
            time = times.split(" | ")[0];
        } catch (e) {
            time = times;
        }

        let timed = time ? api.ageCalc(time) : "Không rõ";

        var embed = new MessageEmbed()
            .setDescription("**" + timed + " trước**: " + data)
            .setColor(0x2EA711)

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}