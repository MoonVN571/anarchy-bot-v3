const log = require('../log');
const { AutoPoster } = require('topgg-autoposter');
const { Collection, Permissions } = require('discord.js');
const Scriptdb = require('script.db');
const { Client } = require('discord.js');
const api = require('../utils');
module.exports = {
	name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     * @returns 
     */
    execute(client) {
        client.commands = new Collection();
        client.slashCommands = new Collection();
        require('../handlers/command')(client);
        require('../handlers/slash')(client);

        if(!client.dev) AutoPoster(client.config.TOPGG_TOKEN, client).on('posted', () => console.log('Posted stats to Top.gg!'));
    
        
        client.user.setActivity("RESTARTING", { type: 'PLAYING' });
        
        setTimeout(() => client.user.setActivity("Idling", { type: 'PLAYING' }), 10 * 1000);
    
        console.log('------------------------');
        console.log('       Moon Bot         ')
        console.log('------------------------');
        console.log('Guilds: ' + Intl.NumberFormat().format(client.guilds.cache.size));
        console.log('Channels: ' + Intl.NumberFormat().format(client.channels.cache.size));
        console.log('Total users: ' + Intl.NumberFormat().format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)));
        console.log('------------------------');
    
        console.log('Bot started!');
        console.log('Developer: ' + client.dev.toString().replace(/t/, "T").replace(/f/, "F"));
        
        log("Ready!");
        
        api.clean();
        
        // started notify
        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');
    
            if(checkdata == undefined || guild == undefined) return;
    
            if(client.dev) return;

            try {
                if(!client.guilds.cache.get(guild.id).me.permissionsIn(client.channels.cache.get(checkdata)).has(Permissions.FLAGS.SEND_MESSAGES)) {
                    console.log(guild.id);
                    const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
                    if(err.toString().includes("Missing Permissions")) data.delete('livechat');
                    return;
                }

                client.channels.cache.get(checkdata).send({embeds: [{
                    description: "Đang khởi động lại bot.",
                    color: 0x15ff00
                }]}).catch(err => {
                    console.log(err);
                    client.sendError(`${message.guild.name} - ${message.guildId} : Không thể gửi tin nhắn cho author.\n${err.message || err.toString()}\n\n${err}`);
                })
            } catch(e) {

            }
        });
    
        if(client.dev) return;
    
        // guild count
        client.channels.cache.get('856516410750664764').setName('Total Guilds: ' +  Intl.NumberFormat().format(client.guilds.cache.size));
        client.channels.cache.get('856517492372668426').setName('Total Channels: ' +  Intl.NumberFormat().format(client.channels.cache.size));
        client.channels.cache.get('856517721122406430').setName('Total Users: ' + Intl.NumberFormat().format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)));
        setInterval(() => {
            client.channels.cache.get('856516410750664764').setName('Total Guilds: ' +  Intl.NumberFormat().format(client.guilds.cache.size));
            client.channels.cache.get('856517492372668426').setName('Total Channels: ' +  Intl.NumberFormat().format(client.channels.cache.size));
            client.channels.cache.get('856517721122406430').setName('Total Users: ' + Intl.NumberFormat().format(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)));
        }, 30 * 60 * 1000);
    
        // restart since
        var today = new Date()
        let day = ("00" + today.getDate()).slice(-2)
        let month = ("00" + (today.getMonth() + 1)).slice(-2)
        let hours = ("00" + today.getHours()).slice(-2)
        let min = ("00" + today.getMinutes()).slice(-2)
    
        var date = hours + ':' + min + " " + day + '/' + month;
        client.channels.cache.get('856522329672515614').setName('Restart At: ' + date);
    }
}