const { createBot } = require('../index');

var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');

var a = require("../api");
var api = new a();

var e = require("../goTevent");
var event = new e();

const log = require('../log');

module.exports = {
	name: 'end',
	once: false,
	execute(bot, client) {
        client.user.setActivity("");
        
        console.log('      Bot Ended');
        console.log('------------------------');

        log("Bot ended");

        setTimeout(createBot, 10 * 60 * 1000);

        setTimeout(() => {
            if(!bot.joined) return;

            if(bot.lobby) {
                var d = new Scriptdb('./data.json');
                d.set('queueEnd', Date.now())
            }
            var disconnected = new MessageEmbed()
                                .setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
                                .setColor("F71319");

            client.channels.cache.get(bot.defaultChannel).send({embeds: [disconnected]});
        
            if(!bot.dev) {
                client.guilds.cache.forEach((guild) => {
                    const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
                    const checkdata = data.get('livechat');

                    if(checkdata == undefined || guild == undefined) return;

                    try { client.channels.cache.get(checkdata).send({embeds: [disconnected]}); } catch(e) {}
                });
            }
            
            bot.joined = false;

            var disconnectedLog = new MessageEmbed()
                                    .setDescription("Bot đã mất kết nối đến server. Kết nối lại sau 2 phút." + `\nThời gian trong hàng chờ là ${api.queueTime()}. Thời gian trong server là ${api.uptimeCalc()}.`)
                                    .setColor("F71319");

            try {
                if(bot.dev) {
                    client.channels.cache.get("807045720699830273").send({embeds: [disconnectedLog]});
                } else {
                    client.channels.cache.get("806881615623880704").send({embeds: [disconnectedLog]});
                }
            } catch(e) {}

            event.setAuto(false);
            api.clean();
        }, 2 * 1000);
    }
}