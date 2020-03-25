import {Game} from './game';
import {shuffle} from './util';



export type CardType = 'NECRONOMICON' | 'ELDER SCROLL' | 'CTHULHU' | 'POWER' | 'BLANK';

export class Card {
	disabled: boolean = false;
	preRound: Function | undefined;
	postRound: Function | undefined;
	onSelect: Function | undefined;
	cardType: CardType = 'BLANK';
	constructor() {}
}

export function getNumberOfCultist(numOfPlayers: number) {
	if(numOfPlayers==4)
		return 2;
	if(numOfPlayers==5)
		return 2;
	if(numOfPlayers==7)
		return 2;
	if(numOfPlayers<=8)
		return 3;
	if(numOfPlayers<=10)
		return 4;
	return 4;
}

export function getNumberOfInvestigator(numOfPlayers: number) {
	if(numOfPlayers==4)
		return 3;
	if(numOfPlayers==5)
		return 4;
	if(numOfPlayers==7)
		return 4;
	if(numOfPlayers<=8)
		return 5;
	if(numOfPlayers<=10)
		return 6;
	return 6;
}

function createCthulhu() {
	const card = new Card();
	card.cardType = 'CTHULHU';
	card.onSelect = (game: Game) => {
		card.disabled = true;
		game.endByCthulhu();
	};
	return card;
}

function createElder() {
	const card = new Card();
	card.cardType = 'ELDER SCROLL';
	card.onSelect = (game: Game) => {
		card.disabled = true;
		game.foundElderScroll();
	};
	return card;
}

function createNecronomicon() {
	const card = new Card();
	card.cardType = 'NECRONOMICON';
	card.onSelect = (game: Game) => {
		card.disabled = true;
		game.endByNecronomicon();
	};
	return card;
}

function createUseless() {
	const card = new Card();
	card.cardType = 'BLANK';
	card.onSelect = (game: Game) => {
		card.disabled = true;
		game.nothingHappened();
	};
	return card;
}

export function prepareDeck(deck: Card[], numOfPlayers: number) {
	// prepare required stuff;
	deck.push(createCthulhu());

	for(let i=0; i<numOfPlayers; i++)
		deck.push( createElder() );

	deck.push(createNecronomicon());
	deck.push(createNecronomicon());

	// fill with useless cards
	const spareCards = 5*numOfPlayers - deck.length;
	for(let i=0; i<spareCards; i++)
		deck.push(createUseless());

	shuffle(deck);
	return deck;
}