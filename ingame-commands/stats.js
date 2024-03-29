const Scriptdb = require("script.db");

module.exports = {
    name: "stats",
    description: "Xem K/D người chơi",
    aliases: ['stats', 'kd'],
    
    execute(bot, username, args) {
        if(args[0]) {
            if(!args[0].toString().match(bot.regex)) return;
        } else {
            args[0] = username;
        }
        
        const kd = new Scriptdb(`./data/kd/${args[0]}.json`);
        let die = kd.get('deaths');
        let kills = kd.get('kills');
        
		if (kills == undefined && die == undefined) return bot.whisper(username, '> Không tìm thấy người chơi.');

        if(kills == undefined) kills = 0;
        if(die == undefined) die = 0;

        var ratio = kills / die;
        var ratioFixed = ratio.toFixed(2);

        if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
            ratioFixed = "0.00";
        }

        bot.whisper(username, `> ${args[0]}: [K: ${kills} - D: ${die} - K/D: ${ratioFixed}]`);
    }
}