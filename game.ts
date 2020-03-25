import {
	Player,
	distributeCards,
	assignRoles
} from './player';

import {
	Card,
	prepareDeck
} from './card';


import {
	sendUser,
	sendUserCards,
	sendUsers,
	sendState
} from './discord';


export interface GameState {
	active: boolean,
	currentRound: number,
	creator: string,
	players: Player[],
	elderScrollsFound: number,
	flashlightHolder: Player,
	elderScrollsFoundThisRound: number,

	turn: number,
	deck: Card[],	// communal deck
	hold: Card[],   // on hold deck

	muted: string[], //discord id of muted players
}

export class Game{
	state: GameState = {
		active: false,
		currentRound: 0,
		creator: "",
		players: [],
		elderScrollsFound: 0,
		flashlightHolder: {} as any,
		elderScrollsFoundThisRound: 0,
		turn: 0,
		deck: [],
		hold: [],
		muted: []
	};


	constructor() {}

	async begin() {
		const state = this.state;
		state.currentRound = 0;
		state.elderScrollsFound = 0;
		state.active = true;
		state.turn= 0;
		state.deck = [];
		state.hold = [];
		state.players.forEach(player => {
			player.cards = [];
		});

		// reset state

		// give flashlight
		const luckyPlayer = Math.floor( state.players.length*Math.random() );
		state.flashlightHolder = state.players[luckyPlayer];

		// assign deck
		state.deck.length = 0; // empty-deck
		prepareDeck(state.deck,state.players.length);

		// assign role == 
		assignRoles(state.players);
		await this.notifyRoles();

		await this.nextRound();
	}

	async nextRound() {
		
		const {
			currentRound,
			deck,
			players
		} = this.state;


		// const cardsEach =  5 - currentRound;
		const cardsEach = Math.floor( deck.length / players.length );
		distributeCards(cardsEach, deck,players );

		//call all card effects
		this.callCardEffects();
		
		await this.publishAll(`\n\n**START OF ROUND ${currentRound+1}**\n\n`);
		await this.publishState();
		await this.sendCards();
	}

	async endTurn() {
		if( this.state.turn == this.state.players.length-1 )
			await this.endRound();
		else {
			this.state.turn +=1;
			await this.publishState();
		}
	}

	async endRound() {

		this.state.turn = 0;
		this.state.elderScrollsFoundThisRound = 0;
		const {currentRound} = this.state;
		this.collectCards();

		if(currentRound+1==4) {
			this.endByDefault();
		} 
		else {
			this.state.currentRound +=1;
			this.nextRound();
		}
	}

	private async publishAll(text: string){
		await sendUsers(this.state.creator,text);
	}

	private async publishState() {
		await sendState(this.state.creator);
	}

	private collectCards() {
		const {
			deck,
			players,
			hold
		} = this.state;

		deck.push(...hold);
		hold.length = 0;

		players.forEach( player => {
			deck.push(...player.cards.filter(x=>!x.disabled));
			player.cards.length = 0;
		});
	}

	private callCardEffects() {
		this.state.players.forEach(player => {
			player.cards.forEach(card => {
				if(card.preRound && !card.disabled)
					card.preRound(this,player);
			});
		});
	}

	private async sendCards() {
		this.state.players.forEach(player => {
			sendUserCards(player,this.state.currentRound);
		});
	}

	private notifyRoles() {
		const {players} = this.state;
		players.forEach(player => {
			sendUser(player,`Hello <@${player.discordId}> ,\nYou play as **${player.role}**`);
		});
	}

	findPlayer(discordId: string) {
		return this.state.players.filter(x=>x.discordId==discordId)[0];
	}

	addPlayer(discordId: string, discordName: string) {
		const player = new Player();
		player.discordId = discordId;
		player.name = discordName;

		this.state.players.push(player);
		return player;
	}

	removePlayer(discordId: string) {
		const player = this.findPlayer(discordId);
		if(player) {
			const index = this.state.players.indexOf(player);
			this.state.players.splice(index,1);
		}
	}

	foundElderScroll () {
		this.state.elderScrollsFound +=1;
		this.state.elderScrollsFoundThisRound +=1;
		if(this.state.elderScrollsFound == this.state.players.length) {
			this.endByElderScrolls();
		}
		else
			this.endTurn();
	}

	flashlight(discordId: string, index: number) {
		const player = this.findPlayer(discordId);
		this.state.flashlightHolder = player;
		
		if(index>=player.cards.length)
			return;

		const card = player.cards[index];
		if(card.onSelect)
			card.onSelect();
	}

	async nothingHappened() {

		await this.endTurn();
	}

	async endByCthulhu() {
		await this.cultistsWon();
	}

	async endByNecronomicon() {
		if(this.state.elderScrollsFoundThisRound == 0) {
			await this.cultistsWon();
		} else this.endTurn();
	}

	async endByElderScrolls() {
		await this.publishAll(`All the elder scrolls has been found.`);
		await this.investigatorsWon();
	}

	async endByDefault() {
		await this.publishAll(`Investigators run out of time.`);
		await this.cultistsWon();
	}

	private async cultistsWon() {

		const cultists = this.state.players.filter(p => p.role == 'CULTIST');
		let str = `Game over.\n> **Cultists WON!**`;

		let i=0;
		cultists.forEach(p => {
			str+=`\n> ${i+1}. <@${p.discordId}> `
			i++;
		});

		await this.publishAll(str);
		this.state.active = false;
	}

	private async investigatorsWon() {

		const cultists = this.state.players.filter(p => p.role == 'INVESTIGATOR');
		let str = `Game over.\n> **Investigators WON!**`;

		let i=0;
		cultists.forEach(p => {
			str+=`\n> ${i+1}. <@${p.discordId}> `
			i++;
		});

		await this.publishAll(str);
		this.state.active = false;
	}
}
