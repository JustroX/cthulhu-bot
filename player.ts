import { 
	Card,
	getNumberOfCultist,
	getNumberOfInvestigator
} from './card';

import { shuffle } from './util';


type ROLE = 'INVESTIGATOR' | 'CULTIST';

export class Player{
	role: ROLE = 'INVESTIGATOR';
	cards: Card[] = [];
	discordId: string = '';
	name: string = '';
}

export function assignRoles(players: Player[]) {
	const deck: ROLE[] = [];
	const numOfPlayers = players.length;
	const numOfCultist = getNumberOfCultist(numOfPlayers);
	const numofInvestigator = getNumberOfInvestigator(numOfPlayers);

	for(let i=0; i<numOfCultist; i++) deck.push( 'CULTIST' );
	for(let i=0; i<numofInvestigator; i++) deck.push( 'INVESTIGATOR' );
	
	shuffle(deck);
	
	players.forEach(player => {
		const role =  deck.shift();
		if(role)
			player.role = role;
	});
}


export function distributeCards(cardsEach: number,cards: Card[], players: Player[]) {
	shuffle(cards);

	while(cards.length>0)
		players.forEach( player => {
			for(let i=0; i<cardsEach; i++)
				if(cards.length>0) {
					const card = cards.shift() as Card;
					card.disabled = false;
					player.cards.push(card);
				}
		});

}