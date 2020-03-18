import { Game } from './game';
import { Card } from './card';


type SPECIAL_CARDS = 'PARANOIA' | 'EVIL PRESCENCE' | 'MIRAGE' | 'PRECIENT VISION' | 'INSANITY\'S GRASP' | 'PRIVATE EYE';
export const SPECIAL_CARD_DESCRIPTIONS: { [key in SPECIAL_CARDS]: String} = {
	'PARANOIA': 'Control the flashlight for the rest of the round.',
	'EVIL PRESCENCE': 'Return all your unrevealed cards to the reshuffle pile.',
	'MIRAGE': 'Return a previously discovered elder sign to the reshuffle pile.',
	'PRECIENT VISION': 'Reveal a card, flip it back over',
	'INSANITY\'S GRASP': 'If this card is unrevealed in front of you, you cannot communicate.',
	'PRIVATE EYE': 'Secretly reveal your role to the investigator',
}


export function createParanoia(card: Card) {
	card.cardType = 'POWER';
	card.preRound = (game: Game) => {

	};
}