import { v4 as uuidv4 } from 'uuid';

import { 
	Client,
	Message,
	GuildChannel,
	TextChannel,
	Channel,
	CategoryChannel,
	User
} from 'discord.js';
import {Game} from './game';
import {Player} from './player';
import {shuffle} from './util';
const client = new Client();

export function onReady(cb: Function) {
	client.login(process.env.BOT_TOKEN);
	client.on('ready',()=>{cb();});
}

interface Session{
	sessionID: string,
	game: Game,
	channel: TextChannel
}

const SESSIONS: { [key: string]: Session  } = {};
const SESSION_MAP: { [key: string]: Session } = {};

async function joinGame(sessionID: string, lobby: TextChannel, player: User) {
	
	if(SESSION_MAP[player.id]) {
		lobby.send(`You already have an active session. Please leave that session and try again.`);
		return;
	}

	const session = SESSIONS[sessionID];
	const game = session.game;
	const channel = session.channel;

	if(game.state.active) {
		lobby.send(`The game is already active.`);
		return;
	}

	SESSION_MAP[player.id] = session;

	game.addPlayer(player.id,player.username);

	channel.updateOverwrite(player.id,{ VIEW_CHANNEL: true });
	channel.send(`New player, <@${player.id}> , has joined the game.`);
}

async function newGame(lobby: TextChannel, creator: User) {
	const game = new Game();	
	const sessionID = uuidv4().slice(0,5);
	const guild = lobby.guild;

	if(SESSION_MAP[creator.id]) {
		lobby.send(`You already have an active session. Please leave that session and try again.`);
		return;
	}

	const channel = await guild.channels.create("cthulu-session-"+sessionID,{
		parent: lobby.parent as any,
	});

	game.state.creator = creator.id;
	game.addPlayer(creator.id, creator.username);

	channel.updateOverwrite((client.user as any).id,{ VIEW_CHANNEL: true });
	channel.updateOverwrite(creator.id,{ VIEW_CHANNEL: true });
	channel.updateOverwrite(guild.roles.everyone as any, { VIEW_CHANNEL: false });
	const session: Session = {
		sessionID,
		game,
		channel
	};
	SESSION_MAP[creator.id] = session;
	SESSIONS[sessionID] = session;

	lobby.send(`Game session has been created.\nJoin game by typing the following\n\`\`\`\ntrag ${sessionID}\n\`\`\``);
	channel.send(`Welcome <@${creator.id}> , this is your game session. Let's wait for other players. \n Tell them to join the game by typing \n \`\`\`trag ${sessionID}\n\`\`\`\nLeave game: \n\`\`\`tra alis\`\`\``);
}

async function leaveGame(channelSent: TextChannel, player: User) {
	if(!SESSION_MAP[player.id]) {
		channelSent.send(`You don't have an active session. Start one by typing the following\n\`\`\`\ntrag tulu\n\`\`\``);
		return;
	}

	const session = SESSION_MAP[player.id];
	const {
		sessionID,
		game,
		channel
	} = session;

	if(game.state.active) {
		channelSent.send(`Luh, leaver.\n You can not leave while game is still active.`);
		return;
	}
	game.removePlayer(player.id);
	channel.updateOverwrite(player.id,{ VIEW_CHANNEL: false });
	delete SESSION_MAP[player.id];
	await channel.send(`Bye <@${player.id}>.`);

	if(game.state.players.length == 0) {
		delete SESSIONS[sessionID];
		await channel.delete();
	}
}

async function getGameState(channelSent: TextChannel,player: User) {
	if(!SESSION_MAP[player.id]) {
		channelSent.send(`You don't have an active session. Start one by typing the following\n\`\`\`\ntrag tulu\n\`\`\``);
		return;
	}
	const session = SESSION_MAP[player.id];
	const {
		sessionID,
		game,
		channel
	} = session;

	if(!game.state.active) {
		channelSent.send(`Game is not yet active.`);
		return;
	}

	sendGameState(channel,game);
}

async function sendGameState(channel: TextChannel, game: Game) {
	const {
		elderScrollsFound,
		turn,
		currentRound,
		players,
		flashlightHolder
	} = game.state;

	const roundsLeft = 5 - currentRound;
	const turnsLeft = players.length - turn;
	const flashlight = flashlightHolder.discordId;
	await channel.send(`**Cthulu Game**\n> Elder scrolls found: ${elderScrollsFound}\n> Rounds left: ${ roundsLeft }\n> Turns left: ${turnsLeft}\nFlashlight holder: <@${flashlight}>`);

	let str = '\n**Player Cards**\n';
	players.forEach(player => {
		str += `\n <@${player.discordId}>`;
		player.cards.forEach((card, index) => {
			if(card.disabled)
				str+= `\n> ${index+1}. ${card.cardType}` ;
			else
				str+= `\n> ${index+1}. UNKNOWN` ;
		});
	});

	await channel.send(str);


}

async function startGame(channelSent: TextChannel, player: User) {
	if(!SESSION_MAP[player.id]) {
		channelSent.send(`You don't have an active session. Start one by typing the following\n\`\`\`\ntrag tulu\n\`\`\``);
		return;
	}

	const session = SESSION_MAP[player.id];
	const {
		sessionID,
		game,
		channel
	} = session;

	if(game.state.active) {
		channelSent.send(`Game is already active.`);		
		return;
	}

	if(game.state.creator != player.id) {
		channelSent.send(`Only <@${game.state.creator}> can start the game.`);
		return;
	}

	await channel.send(`Orayt gtahhhhm.`);
	game.begin();
}

async function endGame(channelSent: TextChannel, player: User) {
	if(!SESSION_MAP[player.id]) {
		channelSent.send(`You don't have an active session. Start one by typing the following\n\`\`\`\ntrag tulu\n\`\`\``);
		return;
	}

	const session = SESSION_MAP[player.id];
	const {
		sessionID,
		game,
		channel
	} = session;

	if(!game.state.active) {
		channelSent.send(`Game is not active.`);		
		return;
	}

	if(game.state.creator != player.id) {
		channelSent.send(`Only <@${game.state.creator}> can end the game.`);
		return;
	}

	channel.send(`Game ended.`);
	game.state.active = false;
}

client.on('message', (msg: Message)=> {
	const { content, channel, author } = msg;
	const words = content.split(" ");

	if(words[0] == 'trag') {

		if(words[1] == 'tulu') {
			newGame(channel as TextChannel,author);
			return;
		};

		const sessionID = words[1];
		if( SESSIONS[sessionID] ) {
			joinGame(sessionID,channel as TextChannel, author);
		}
	}

	if(content == 'tra alis') {
		leaveGame(channel as TextChannel, author);
	}

	if(content == 'tulu g') {
		startGame( channel as TextChannel, author);
	}

	if(content == 'tulu state') {
		getGameState( channel as TextChannel, author);
	}

	if(content == 'tulu end') {
		endGame(channel as TextChannel,author);
	}

	if(words[0] == 'flash' && words.length ==2 && words[1][0] == '<') {
		showHand(channel as TextChannel,author,words[1]);
	}

});


export async function sendUser(player: Player,text: string) {
	const session = SESSION_MAP[player.discordId];
	const {
		sessionID,
		game,
		channel
	} = session;

	const member = await channel.guild.members.fetch(player.discordId);
	member.send(text);
}

export async function sendUserCards(player: Player, round: number) {
	const session = SESSION_MAP[player.discordId];
	const {
		sessionID,
		game,
		channel
	} = session;

	let str = `\nYour cards for round ${round+1}.\n`;
	const cards = [...player.cards];
	shuffle(cards);

	cards.forEach(card => {
		str+= `> ${card.cardType}\n`;
	});

	const member = await channel.guild.members.fetch(player.discordId);
	member.send(str);
}

export async function sendUsers(creator: string, text: string) {

	const session = SESSION_MAP[creator];
	const {
		sessionID,
		game,
		channel
	} = session;
	
	await channel.send(text);
}

export async function sendState(creatorId: string) {
	const session = SESSION_MAP[creatorId];
	const { game,channel} = session;
	await sendGameState(channel,game);
}

async function showHand(channelSent: TextChannel, player: User, target: string) {
		if(!SESSION_MAP[player.id]) {
			channelSent.send(`You don't have an active session. Start one by typing the following\n\`\`\`\ntrag tulu\n\`\`\``);
			return;
		}

		const session = SESSION_MAP[player.id];
		const {
			sessionID,
			game,
			channel
		} = session;

		if(!game.state.active) {
			channelSent.send(`Game is not active.`);		
			return;
		}

		if(game.state.flashlightHolder.discordId != player.id) {
			channelSent.send(`Only <@${game.state.flashlightHolder.discordId}> can point the flashlight.`);
			return;
		}

		const targetId = target.substring(3,target.length-1);
		const targetPlayer = game.findPlayer(targetId);
		const gamePlayer = game.findPlayer(player.id);
		const cards = targetPlayer.cards;
		const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'];

		const message = await channel.send(`Pick a card from ${target}`);
		
		for(let i=0; i<cards.length; i++)
			if(!cards[i].disabled)
				await message.react(emojis[i]);

		const collected = await message.awaitReactions((reaction, user) => {
			return emojis.includes(reaction.emoji.name) && user.id == player.id;
		},{ max: 1});

		const reaction = collected.first();
		if(!reaction) {
			channel.send(`No reaction lol. Bug to ifix mo na lang soon.`);
			return;
		}
		const index = emojis.indexOf(reaction.emoji.name);

		message.reactions.removeAll();
		channel.send(`You picked card #${index+1}!`);
		setTimeout(async()=>{
			game.state.flashlightHolder = targetPlayer;
			await channel.send(`The card is\n> ${ cards[index].cardType }`,{
				files: [{
					attachment: __dirname + `/../assets/${cards[index].cardType}.png`,
					name: 'card.png'
				}]
			});
			if(cards[index] && cards[index].onSelect)
				(cards[index] as any).onSelect(game,gamePlayer);			
		},1000);
}