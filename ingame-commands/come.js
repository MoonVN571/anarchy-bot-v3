
const { GoalNear} = require('mineflayer-pathfinder').goals
const { Movements } = require('mineflayer-pathfinder')

module.exports = {
    name: "come",
    description: "Cho bot đi đến vị trí hiện tại của bạn",
    aliases: [''],
    
    execute(bot, username, args) {
		const target = bot.players[username] ? bot.players[username].entity : null
		if (!target) return bot.whisper(username, '> Không ở trong tầm nhìn!');

        const p = target.position

        const mcData = require('minecraft-data')(bot.version)
        const defaultMove = new Movements(bot, mcData)
        
        bot.whisper(username, "> Đang đi đến X: " + parseInt(p.x) + " Y: " + parseInt(p.y) + " Z: " + parseInt(p.z) + ". Nếu bot không di chuyển, hãy dùng !avoid.")

        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
    }
}