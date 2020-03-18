"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPECIAL_CARD_DESCRIPTIONS = {
    'PARANOIA': 'Control the flashlight for the rest of the round.',
    'EVIL PRESCENCE': 'Return all your unrevealed cards to the reshuffle pile.',
    'MIRAGE': 'Return a previously discovered elder sign to the reshuffle pile.',
    'PRECIENT VISION': 'Reveal a card, flip it back over',
    'INSANITY\'S GRASP': 'If this card is unrevealed in front of you, you cannot communicate.',
    'PRIVATE EYE': 'Secretly reveal your role to the investigator',
};
function createParanoia(card) {
    card.cardType = 'POWER';
    card.preRound = function (game) {
    };
}
exports.createParanoia = createParanoia;
