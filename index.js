/**
 * 			MOON BOT 2Y2C
 * 
 * Mã nguồn cde được viết dựa trên cảm hứng từ server 2B2T. Ban đầu là
 * bot chỉ dự định dùng để xem hàng chờ của 2b2t. Bot minecraft được tạo
 * vào ngày 6/1/2021. Tất cả data của người chơi mà bot có thể đọc được đã
 * được lưu trên 1 VPS và chính là VPS chính để host bot.
 * 
 * Dự án này hiện tại không công khai. Tuy nhiên vẫn có 1-2 người có thể xem
 * được toàn bộ mã nguồn này.
 * 
 * Tuỳ thuộc vào dev. Nếu như không tiếp tục phát triển nữa thì có thể sẽ
 * public mã nguồn của bot.
 * 
 * Copyright © 2020 - 2021 Moon Bot
 */

// Discord client
const Discord = require("discord.js");
const client = new Discord.Client();

// bot
var mineflayer = require('mineflayer');
var tpsPlugin = require('mineflayer-tps')(mineflayer);
const pathfinder = require('mineflayer-pathfinder').pathfinder;

// Node module
var fs = require('fs');
var Scriptdb = require('script.db');

// Module
const log = require('./log');
var abc = require("./api");
var api = new abc();

// env file
require('dotenv').config();
const config = {
	token: process.env.TOKEN,
	ip: process.env.IP
};

// Var
const footer = "moonbot 2021";
client.footer = footer;

const prefix = "$";
client.prefix = prefix;

// Value
let cooldown = new Set();
let antiSpam = new Set();

const dev = true;

if (dev) prefix = "dev$";

var defaultChannel;
var devuser = "mo0nbot";

if (dev) {
	defaultChannel = '802454010400604161';
	devuser = "mo0nbot2";
} else {
	defaultChannel = '795135669868822528';
	devuser = "mo0nbot";
}

/*
 *				READY
 */
client.on('ready', () => {
	client.user.setActivity("RESTARTING", { type: 'PLAYING' });
	
	console.log('------------------------');
	console.log('       Moon Bot         ')
	console.log('------------------------');
	console.log('Guilds: ' + client.guilds.cache.size);
	console.log('Channels: ' + client.channels.cache.size);
	console.log('Total users: ' + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
	console.log('------------------------');

	console.log('Bot started!');

	console.log('Developer: ' + dev.toString().replace(/t/, "T").replace(/f/, "F"));
	
	log("Bot ready");

	createBot();

	const data = new Scriptdb(`./data.json`);

	data.set('queueStart', null);
	data.set('queueEnd', null);

	data.set('tab-content', null);
	data.set('uptime', null);
	data.set('players', null);
});

async function sendMessage(channel, content) {
	var onChannel = client.channels.cache.get(channel);
	
	if(!onChannel) return console.log("Không thấy kênh " + channel);

	await onChannel.send(content);
}

/*
 *				START_BOT
 */
function createBot() {
	console.log('------------------------');
	log("Creating bot");
	
	const bot = mineflayer.createBot({
		host: config.ip,
		port: 25565,
		username: devuser,
		version: "1.16.4"
	});

    bot.loadPlugin(tpsPlugin);
	bot.loadPlugin(pathfinder);

	const tpsEvent = require('./events-ingame/server-tps.js');
	const autoEvent = require('./events-ingame/auto.js');
	const msgEvent = require(`./events-ingame/msg.js`);
	const joinedEvent = require(`./events-ingame/join.js`);
	const leftEvent = require(`./events-ingame/left.js`);
	const queueEvent = require(`./events-ingame/queue-tab.js`);
	const mainEvent = require(`./events-ingame/main-tab.js`);
	const ServerStatusEvent = require(`./events-ingame/status-tab.js`);
	const verifyEvent = require('./events-ingame/verify.js');
	const playtimeEvent = require('./events-ingame/playtime.js');
	const JoinedServerEvent = require('./events-ingame/login.js');
	const kickedEvent = require('./events-ingame/kicked.js');
	const endedEvent = require('./events-ingame/ended.js');
	
	var color = "0x979797";
	var color2 = "0x979797";

	var lobby = true;

	// New
	var joined = false;
	var countPlayers = 0;

	// Import
	bot.defaultChannel = defaultChannel; // Kenh mat dinh cua chat
	bot.dev = dev; // developer mode
	bot.lobby = lobby;
	bot.joined = joined;
	bot.countPlayers = countPlayers;
	
	bot.on('windowOpen', verifyEvent.bind(null, bot));

	bot.once('login', autoEvent.bind(null, bot, client));
	bot.once('login', JoinedServerEvent.bind(null, bot, client));
	bot.once('login', playtimeEvent.bind(null, bot));
	bot.once('login', tpsEvent.bind(null, client));

	bot.on('message', msg => {
		if (!(msg.toString().startsWith("<"))) return;
	
		var username = msg.toString().split(" ")[0].split("<")[1].split(">")[0];
	
		if(username.startsWith("[")) {
			username = username.split("]")[1];
		}
	
		logger = msg.toString().substr(msg.toString().split(" ")[0].length + 1);
	
		if (logger.startsWith(">")) {
			color2 = "2EA711";
		}
	
		var bp;
		if (bot.dev) {
			bp = "!!";
		} else {
			bp = "!";   
		}
		
		var chat2 = new Discord.MessageEmbed()
						.setDescription(`**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`)
						.setColor(color2);
	
		var setLogger = `**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`;
		
		
		client.guilds.cache.forEach((guild) => {
			const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
			const checkdata = data.get('livechat');
	
			if(checkdata == undefined || guild == undefined) return;
					
			if(setLogger.split(" ")[1].startsWith(">")) {
				color = "2EA711";
			}

			var chat = new Discord.MessageEmbed()
						.setDescription(setLogger)
						.setColor(color);

			if(dev) return;
			if(chat == undefined) return;

			try {
				client.channels.cache.get(checkdata).send(chat)
				color = "0x797979";
			} catch(e) {}
		});
		
		if(chat2 !== undefined) {
			client.channels.cache.get(bot.defaultChannel).send(chat2);
			color2 = "0x797979";
		}
	
		saveMsgsData(username, logger);
		function saveMsgsData(username, logger) {
			if(logger.startsWith(bp)) return;
			let messages = new Scriptdb(`./data/quotes/${username}.json`);
			let msgs = messages.get("messages")
			let times = messages.get("times")
			if(msgs == undefined) {
				messages.set("messages", logger)
				messages.set("times", Date.now())
			} else {
				messages.set("messages", logger + " | " + msgs)
				messages.set("times", times + " | " + Date.now())
			}
		}
	
		if(!logger.startsWith(bp)) return;
		const args = logger.slice(bp.length).split(/ +/);
		const cmdName = args.shift().toLowerCase();
	
		client.commands = new Discord.Collection();
	
		const cmds = require('fs').readdirSync(`./ingame-commands/`).filter(file => file.endsWith('.js'));
	
		for(const file of cmds){
			const cmd = require(`./ingame-commands/${file}`);
			
			client.commands.set(cmd.name, cmd);
		}
	
		const cmd = client.commands.get(cmdName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
	
		if(cmdName == "reload") {
			if(username == "MoonVN" || username == "MoonZ" || username == "MoonOnTop" || username == "MoonX" || username == bot.username || username == "MoonzVN") {
				if(!args[0]) return bot.whisper(username, "> Nhập tên lệnh cần reload.")
	
				const cmd = require(`./ingame-commands/${args[0]}.js`);
	
				delete require.cache[require.resolve(`./ingame-commands/${args[0]}.js`)];
	
				if(!cmd) return bot.whisper(username, "> Không tìm thấy tên lệnh này.")
				client.commands.delete(args[0])
				client.commands.set(args[0], cmd);
				
				bot.whisper(username, "> Reload thành công: " + args[0])
			} else {
				bot.whisper(username, "> Không thể sử dụng lệnh này.")
			}
		}
	
		if(cmdName == "sudo") {
			if(!args[0]) return bot.whisper(username, "Không tìm thấy nội dung.")
			
			if(username == "MoonVN" || username == "MoonZ" || username == "MoonOnTop" || username == "MoonX" || username == bot.username || username == "MoonzVN") {
				bot.chat(logger.substr(6));
				bot.whisper(username, "Đang thực hiện: " + logger.substr(6))
			}
		}
		
		if(!cmd) return;
	
		bot.regex = /[a-z]|[A-Z]|[0-9]/i;
		bot.logger = logger;

		setTimeout(() => {
			try {
				cmd.execute(bot, username, args);
			}catch(err){
				console.log(err);
			}
		}, 1* 1000);
	});

	bot.on("message", msgEvent.bind(null, bot, client));

	bot.on("playerJoined", joinedEvent.bind(null, bot, client));
	bot.on("playerLeft", leftEvent.bind(null, bot, client));

	bot._client.on("playerlist_header", ServerStatusEvent.bind(null, bot));
	bot._client.on("playerlist_header", mainEvent.bind(null, bot, client));
	bot._client.on("playerlist_header", queueEvent.bind(null, bot, client));

	bot.on('kicked', kickedEvent.bind(null, bot, client));
	bot.on('end', endedEvent.bind(null, bot, client));

	bot.on('error', err => { console.log(err)});
	bot._client.on('error',err => console.log(err));

	client.on('message', msg => {
		var message = msg;
		
		if (msg.author.bot) return;

		if(cooldown.has("active")) return message.channel.send("Bạn cần chờ một chút chat tiếp tục.");

		if (msg.channel.id === '797426761142632450') { // main
			if (msg.author == client.user) return;
			if(!dev) {
				setTimeout(() => {
					bot.chat(msg.content);
				}, 1 * 1000);
			}
			return;
		}

		if (msg.channel.id === '802456011252039680') {
			if (msg.author == client.user) return;
			if(dev) {
				setTimeout(() => {
					bot.chat(msg.content);
				}, 1 * 1000);
			}
		}

		if (msg.channel.id == defaultChannel) {
			if (msg.content.startsWith(">")) return;
			if (msg.content.startsWith(prefix)) return;

			var content = msg.content;
			
			if(!content) return;

			// tranh lap lai content
			if(antiSpam.has(content)) {
				antiSpam.add(message.author.id);

				setTimeout(() => antiSpam.delete(message.author.id), 5 * 60 * 1000);
			}

			if(antiSpam.has(message.author.id)) return message.channel.send("Bạn đã tạm thời bị mute.");

			if(content.length > 88) return msg.channel.send("Rút ngắn tin nhắn của bạn lại để có thể gửi.");
			
			var str = msg.content.toString().split('\n')[0];
			var chat = str.charAt(0).toUpperCase() + str.substr(1);

			var fixes = content.charAt(0).toLowerCase();

			if(msg.content.includes("§" || !fixes && fixes == "")) return msg.channel.send("bug text");

			if(msg.author.bot) return;

			if(!chat.endsWith(".")) {
				chat = chat + ".";
			}

			setTimeout(() => {
				bot.chat(`> [${msg.author.tag}]  ${chat}`);

				// cooldown
				cooldown.add("active");
				antiSpam.add(content);

				setTimeout(() => {
					cooldown.delete("active");
				}, 5 * 1000);

				setTimeout(() => {
					antiSpam.delete(content);
				}, 1 * 60 * 1000);

			}, 1 * 1000);

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			msg.react(send);
		}
	});
}

module.exports = { createBot };

/*
*				COMMAND_DISCORD
*/
client.commandss = new Discord.Collection();

const cmdss = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of cmdss) {
	const cmd = require(`./commands/${file}`);

	client.commandss.set(cmd.name, cmd);
}

client.on("message", async message => {
	if(message.author.bot|| !message.content.startsWith(prefix) || message.author == client.user || message.channel.type == "dm") return;

	if(dev && message.guild.id !== "794912016237985802") return message.channel.send("Lệnh đã bị tắt tại nhóm này.");
	
	if(dev && message.author.id !== "425599739837284362") return message.channel.send("Chỉ developer mới có thể sử dụng bot này.");

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.commandss.get(cmdName)
        || client.commandss.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

	if(cmdName == "reload") {
		var noPerm = new Discord.MessageEmbed()
							.setDescription('Bạn phải là nhà phát triển để sử dụng lệnh này.')
							.setColor('0xC51515');

		if(message.author.id !== "425599739837284362")
			return message.channel.send(noPerm).then(msg => {
				msg.delete({ timeout: 10000 });
			});

			delete require.cache[require.resolve(`./commands/${args[0]}.js`)];

		const cmd = require(`./commands/${args[0]}`);
		client.commandss.set(cmd.name, cmd);
		

		var successful = new Discord.MessageEmbed()
							.setDescription(`Đã tải lại ${args[0]} thành công!`)
							.setColor(0x2EA711);

		message.channel.send(successful)
	}

	if(cmdName == "igreload" || cmdName == "igrl") {
		var noPerm = new Discord.MessageEmbed()
							.setDescription('Bạn phải là nhà phát triển để sử dụng lệnh này.')
							.setColor('0xC51515');

		if(message.author.id !== "425599739837284362")
			return message.channel.send(noPerm).then(msg => {
				msg.delete({ timeout: 10000 });
			});

			delete require.cache[require.resolve(`./ingame-commands/${args[0]}.js`)];

		const cmd = require(`./ingame-commands/${args[0]}`);
		client.commands.set(cmd.name, cmd);
		

		var successful = new Discord.MessageEmbed()
							.setDescription(`Đã tải lại ${args[0]} thành công!`)
							.setColor(0x2EA711);

		message.channel.send(successful);
	}


    if(!cmd) return;
	
	client.userNotFound = new Discord.MessageEmbed()
					.setDescription('Không tìm thấy người chơi.')
					.setColor('0xC51515');
	
	client.footer = footer;
	client.dev = dev;
	client.color = "0x000DFF";
	client.prefix = prefix;

	client.ping = client.ws.ping;
	
    try{
        cmd.execute(client, message, args);
    }catch(err) {
		message.author.send(err.toString()).then(() => {
			message.author.send("Hãy báo cáo lỗi này cho admin nếu bạn nghĩ đây là do bot.");
		})
		console.log(cmdName);
        console.log(err);
    }
});

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });
