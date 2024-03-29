var Scriptdb = require('script.db');
const api = require('../utils');
module.exports = {
    name: "joindate",
    description: "Xem lần đầu bot thấy người chơi vào server",
    aliases: ['jd', 'joindate'],
    
    execute(bot, username, args) {
        if(!args[0]) return;
        if(!args[0].match(bot.regex)) return;

        let fj = new Scriptdb(`./data/joindate/${args[0]}.json`);
        let firstjoin = fj.get('date');

        if (firstjoin === undefined) return bot.whisper(username, `> Không tìm thấy người chơi.`);
        
        var t = firstjoin.split(" ")[1];

        var date = firstjoin.replace('/', '-').replace(".", "-").replace('.2', '-202').replace("/2", '-202')

        var day = date.split("-")[0]
        var month = date.split("-")[1]
        var year = date.split("-")[2].split(" ")[0];


        var datee = year + '-' + month + '-' + day + "T" + t.replace(" ", "T") + ":55.506Z";

        var tick = new Date(datee).getTime();

        bot.whisper(username, `> ${args[0]}: ${firstjoin} (${api.ageCalc(tick)} trước) - Dữ liệu chỉ lưu sau 28/1/2021`);
    }
}