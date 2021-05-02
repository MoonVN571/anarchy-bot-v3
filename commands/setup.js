var Scriptdb = require("script.db");

module.exports = {
    name: "setup",
    description: "setup command.",
    aliases: [''],
    
    async execute(client, message, args) {
        if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.channel.send("Không có quyền để dùng lệnh này.")

        var prefix = client.prefix;
        
        if(!args[0]) return message.channel.send("Cách dùng: " + prefix + "setup chat <tag hoặc nhập id kênh>");
        
        if(args[0] === "chat") {
            if(!args[1]) return message.channel.send("Cách dùng: " + prefix + "setup chat <tag hoặc nhập id kênh>");

            var channel;
            channel = message.content.replace(/\D/g,'');
            if(channel === "") {
                channel = args[2];
            }

            var guild = message.guild.id;
            const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);
            const checkdata = data.get('livechat')
            
            if(checkdata == undefined) {
                data.set('livechat', channel);
                message.channel.send("Bạn đã setup chat tại kênh: " + args[2])
            } else {
                if(args[1] == 'chat') {
                    message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete chat <tag hoặc nhập id kênh>")
                } else {
                    message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete chat <tag hoặc nhập id kênh>")
                }
            }
        }

        if(args[0] == 'restart') {
            if(!client.dev) return;
            if(!args[1]) return message.channel.send("Cách dùng: " + prefix + "setup restart <tag hoặc nhập id kênh> <tên role>");
            if(!args[2] && args[1]) return message.channel.send("Cách dùng: " + prefix + "setup restart " + args[1] + " <tên role>");

            var channel;
            channel = args[1].replace(/\D/g,'');
            if(channel === "") {
                channel = args[1];
            }

            var guild = message.guild.id;
            const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);

            var checkData = data.get('restart-role');
            if(checkData !== undefined) return message.channel.send("Đã setup restart role")

            data.set('restart-channels', channel);
            data.set('restart-roles', args[2].split("<@&")[1].split(">")[0]);

            message.channel.send("Đã setup kênh thông báo restart: " + channel + " và role: " + args[2])   
        }

        if(args[0] == 'stats') {
            if(!bot.dev) return;
            var channel;
            channel = message.content.replace(/\D/g,'');
            if(channel === "") {
                channel = args[2];
            }

            var guild = message.guild.id;
            const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);
            const checkdata = data.get('livechat')
            
            if(checkdata == undefined) {
                data.set('stats', channel); // nó sẽ ra 2 loại, 1 là id, 2 là tên channel đã setup
                if(channel !== "NaN") {
                    message.channel.send("Bạn đã setup chat tại channel: " + channel.toString())
                } else {
                    message.channel.send("Bạn đã setup chat tại channel: " + channel)
                }
            } else {
                if(args[1] == "commands") {
                    message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete stats <tag hoặc nhập kênh>")
                } else {
                    message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete <chat hoặc stats> <tag hoặc nhập id kênh>")
                }
            }
        }
    }
}