var os = require("os");

var Api = require("../../api");

var { MessageEmbed } = require('discord.js');

module.exports = {
    name: "botinfo",
    description: "Xem thông tin của bot",
    aliases: ['bi'],
    delay: 5,
    
    execute(client, message, args) {
        var bot = message.guild.members.cache.get(client.user.id);

        message.reply({embeds: [{
            description: "Đang lấy thông tin của bot...",
            color: client.config.DEF_COLOR
        }]}).then(msg => {
                var embed = new MessageEmbed()
                    .addField("Thông tin", 
                          "-   **Name:** " + bot.user.tag + " - ID: " + client.user.id + "\n"
                        + "-   **Created at:** " + new Api().getTimestamp(bot.joinedTimestamp) + "\n"

                        + "-   **Bot:** " + require("../../package.json").version + "\n"
                        + "-   **Mineflayer:** " + require("mineflayer/package").version + "\n"
                        + "-   **Discord.js:** " + require("discord.js").version + "\n"
                        )
                    .addField("Bot stats", 
                        "-   **Guilds:** " + client.guilds.cache.size + "\n"
                        + "-   **Channels:** " + client.channels.cache.size + "\n"
                        + "-   **Users:** " + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) + "\n"
                        + "-   **Discord delay:** " + client.ws.ping + "ms\n"
                        + "-   **API delay:** " + (msg.createdTimestamp - message.createdTimestamp) + "ms" 
                        )
                    .addField("System",
                        `-   **Platform:** ${os.type()}` + "\n"
                        + `-   **Process uptime:** ${new Api().calc(os.uptime())}` + "\n"
                        + `-   **Ram used:** ${((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2)} MB\n`
                        + "-   **CPU processors:** " + os.cpus()[0].model + "\n"
                        + "-   **CPU cores:** " + os.cpus().length + "\n"
                        + "-   **CPU strengh:** " + os.cpus()[0].speed + "MHz"
                        )
                    .setColor(0x000DFF)
                    .setTimestamp()
                    .setFooter(client.FOOTER);
            msg.edit({embeds: [embed]});
        })
    }
}