"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var Card = /** @class */ (function () {
    function Card() {
        this.disabled = false;
        this.cardType = 'BLANK';
    }
    return Card;
}());
exports.Card = Card;
function getNumberOfCultist(numOfPlayers) {
    if (numOfPlayers == 4)
        return 2;
    if (numOfPlayers == 5)
        return 2;
    if (numOfPlayers == 7)
        return 2;
    if (numOfPlayers <= 8)
        return 3;
    if (numOfPlayers <= 10)
        return 4;
    return 4;
}
exports.getNumberOfCultist = getNumberOfCultist;
function getNumberOfInvestigator(numOfPlayers) {
    if (numOfPlayers == 4)
        return 3;
    if (numOfPlayers == 5)
        return 4;
    if (numOfPlayers == 7)
        return 4;
    if (numOfPlayers <= 8)
        return 5;
    if (numOfPlayers <= 10)
        return 6;
    return 6;
}
exports.getNumberOfInvestigator = getNumberOfInvestigator;
function createCthulhu() {
    var card = new Card();
    card.cardType = 'CTHULHU';
    card.onSelect = function (game) {
        card.disabled = true;
        game.endByCthulhu();
    };
    return card;
}
function createElder() {
    var card = new Card();
    card.cardType = 'ELDER SCROLL';
    card.onSelect = function (game) {
        card.disabled = true;
        game.foundElderScroll();
    };
    return card;
}
function createNecronomicon() {
    var card = new Card();
    card.cardType = 'NECRONOMICON';
    card.onSelect = function (game) {
        card.disabled = true;
        game.endByNecronomicon();
    };
    return card;
}
function createUseless() {
    var card = new Card();
    card.cardType = 'BLANK';
    card.onSelect = function (game) {
        card.disabled = true;
        game.nothingHappened();
    };
    return card;
}
function prepareDeck(deck, numOfPlayers) {
    // prepare required stuff;
    deck.push(createCthulhu());
    for (var i = 0; i < numOfPlayers; i++)
        deck.push(createElder());
    deck.push(createNecronomicon());
    deck.push(createNecronomicon());
    // fill with useless cards
    var spareCards = 5 * numOfPlayers - deck.length;
    for (var i = 0; i < spareCards; i++)
        deck.push(createUseless());
    util_1.shuffle(deck);
    return deck;
}
exports.prepareDeck = prepareDeck;
