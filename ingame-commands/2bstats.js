var superagent = require('superagent');

module.exports = {
    name: "2bstats",
    aliases: [''],
    
    async execute(bot, username, args) {
        if(args[0]) {
            if(!args[0].toString().match(bot.regex)) return;
        }

        if(!args[0]) return

        superagent.get("https://api.2b2t.dev/stats?username=" + args[0]).end((err, data) => {
            if(data.body[0] == undefined) return bot.whisper(username, `> Không tìm thấy người chơi.`);

            
            let joins = data.body[0].joins
            let leaves = data.body[0].leaves
            let deads = data.body[0].deaths
            let kills = data.body[0].kills

            if (kills === undefined) { kills = 0 }

            if (deads === undefined) { deads = 0 }

            var ratio = kills / deads;
            var ratioFixed = ratio.toFixed(2);

            if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
                ratioFixed = "0.00";
            }

            bot.whisper(username, `> 2B2T: ${args[0]} | K: ${kills} - D: ${deads} - K/D: ${ratioFixed} - Joins: ${joins} - Leaves: ${leaves}`);
        })
    }
}