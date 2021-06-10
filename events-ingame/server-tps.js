const Scriptdb = require('script.db');

const { MessageEmbed } = require('discord.js');

const log = require('../log');

module.exports = (client) => {
    setInterval(checkLag, 15000)

    let isLagging = false
    let minTps
    let lagStartTime
    let tpsAvg
    let tpsCount
    let totalPoints

    function msgAll(channelName, msg){
        client.channels.cache.get(channelName).send(msg);
    }
    
    function readTPS(){
        try{
            var a = new Scriptdb('./data.json');
            let tps = a.get('tab-content').split(" ")[1];
            return tps;
        } catch(error){}
    }

    var tps = 0;

    function checkLag(){

        if(readTPS() == 0 || readTPS() == undefined) return;
            tps = readTPS()

        log("Got TPS: " + tps)
        tps = parseFloat(tps)
        if(tps > 0 && tps <= 14 || tps > 20){
            if(isLagging == false){
                var embedLag = new MessageEmbed().setColor(0xCC3333).setDescription("2Y2C bắt đầu lag: " + tps);
                msgAll("852158457624657941", embedLag);
                log("2Y2C has started lagging. TPS: " + tps)
                lagStartTime = Date.now()
                minTps = tps
                tpsAvg = tps
                tpsCount = 1
                isLagging = true
                totalPoints = 0
                if(tps<=2){
                    totalPoints = (1 / Math.sqrt(tpsAvg/tpsCount))
                }
                return
            }

            if(isLagging){
                tpsAvg = tpsAvg + tps
                tpsCount = tpsCount + 1
                if(minTps > tps){
                    minTps = tps
                }

                if(tps <= 2){
                    totalPoints = totalPoints + (1 / Math.sqrt(tpsAvg/tpsCount))
                }

                if(tps > 20 || tps < 0){
                    log("Non real TPS! TPS: " + tps)
                    totalPoints = totalPoints + (1 / Math.sqrt(tpsAvg/tpsCount)) + (15/4)
                }
            }
        }

        if(tps > 16 && tps <= 20){
            if(!isLagging) return;
            log("2Y2C has stopped lagging.");

            if(isLagging){
                isLagging = false
                tpsAvg = tpsAvg/tpsCount
                let uptimesec = (Date.now() - lagStartTime) /  1000
                let hours = Math.floor(uptimesec / 60 / 60);
                let minutes = Math.floor(uptimesec / 60) - (hours * 60);
                let seconds = Math.floor(uptimesec % 60);

                let lagEmbed = new MessageEmbed()
                .setColor('#CC3333')
                .setTitle('Lag Information')
                .setURL('https://discord.gg/G2w7DQQ')
                .setAuthor('Moon Bot', 'https://cdn.discordapp.com/avatars/768448728125407242/f18ec971961b23db96e6cf0f3f79ec1c.png?size=256')
                .setDescription('Tính toán thời gian server tps.')
                .addFields(
                    { name: 'TPS trung bình', value: tpsAvg },
                    { name: 'Thời gian lag', value: hours + 'h ' + minutes + 'm ' + seconds + 's.'},
                    { name: 'TPS thấp nhất', value: minTps },
                    { name: 'Điểm ước tính', value: (totalPoints / 4)},
                )
                msgAll('852158457624657941', lagEmbed);
            }
        }
    }
}