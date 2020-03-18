"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("./card");
var util_1 = require("./util");
var Player = /** @class */ (function () {
    function Player() {
        this.role = 'INVESTIGATOR';
        this.cards = [];
        this.discordId = '';
        this.name = '';
    }
    return Player;
}());
exports.Player = Player;
function assignRoles(players) {
    var deck = [];
    var numOfPlayers = players.length;
    var numOfCultist = card_1.getNumberOfCultist(numOfPlayers);
    var numofInvestigator = card_1.getNumberOfInvestigator(numOfPlayers);
    for (var i = 0; i < numOfCultist; i++)
        deck.push('CULTIST');
    for (var i = 0; i < numofInvestigator; i++)
        deck.push('INVESTIGATOR');
    util_1.shuffle(deck);
    players.forEach(function (player) {
        var role = deck.shift();
        if (role)
            player.role = role;
    });
}
exports.assignRoles = assignRoles;
function distributeCards(cardsEach, cards, players) {
    util_1.shuffle(cards);
    while (cards.length > 0)
        players.forEach(function (player) {
            for (var i = 0; i < cardsEach; i++)
                if (cards.length > 0) {
                    var card = cards.shift();
                    card.disabled = false;
                    player.cards.push(card);
                }
        });
}
exports.distributeCards = distributeCards;
