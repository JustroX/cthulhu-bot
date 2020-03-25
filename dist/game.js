"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("./player");
var card_1 = require("./card");
var discord_1 = require("./discord");
var Game = /** @class */ (function () {
    function Game() {
        this.state = {
            active: false,
            currentRound: 0,
            creator: "",
            players: [],
            elderScrollsFound: 0,
            flashlightHolder: {},
            elderScrollsFoundThisRound: 0,
            turn: 0,
            deck: [],
            hold: [],
            muted: []
        };
    }
    Game.prototype.begin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state, luckyPlayer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.state;
                        state.currentRound = 0;
                        state.elderScrollsFound = 0;
                        state.active = true;
                        state.turn = 0;
                        state.deck = [];
                        state.hold = [];
                        state.players.forEach(function (player) {
                            player.cards = [];
                        });
                        luckyPlayer = Math.floor(state.players.length * Math.random());
                        state.flashlightHolder = state.players[luckyPlayer];
                        // assign deck
                        state.deck.length = 0; // empty-deck
                        card_1.prepareDeck(state.deck, state.players.length);
                        // assign role == 
                        player_1.assignRoles(state.players);
                        return [4 /*yield*/, this.notifyRoles()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nextRound()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.nextRound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currentRound, deck, players, cardsEach;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, currentRound = _a.currentRound, deck = _a.deck, players = _a.players;
                        cardsEach = Math.floor(deck.length / players.length);
                        player_1.distributeCards(cardsEach, deck, players);
                        //call all card effects
                        this.callCardEffects();
                        return [4 /*yield*/, this.publishAll("\n\n**START OF ROUND " + (currentRound + 1) + "**\n\n")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.publishState()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.sendCards()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.endTurn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.state.turn == this.state.players.length - 1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.endRound()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        this.state.turn += 1;
                        return [4 /*yield*/, this.publishState()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.endRound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentRound;
            return __generator(this, function (_a) {
                this.state.turn = 0;
                this.state.elderScrollsFoundThisRound = 0;
                currentRound = this.state.currentRound;
                this.collectCards();
                if (currentRound + 1 == 4) {
                    this.endByDefault();
                }
                else {
                    this.state.currentRound += 1;
                    this.nextRound();
                }
                return [2 /*return*/];
            });
        });
    };
    Game.prototype.publishAll = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, discord_1.sendUsers(this.state.creator, text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.publishState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, discord_1.sendState(this.state.creator)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.collectCards = function () {
        var _a = this.state, deck = _a.deck, players = _a.players, hold = _a.hold;
        deck.push.apply(deck, hold);
        hold.length = 0;
        players.forEach(function (player) {
            deck.push.apply(deck, player.cards.filter(function (x) { return !x.disabled; }));
            player.cards.length = 0;
        });
    };
    Game.prototype.callCardEffects = function () {
        var _this = this;
        this.state.players.forEach(function (player) {
            player.cards.forEach(function (card) {
                if (card.preRound && !card.disabled)
                    card.preRound(_this, player);
            });
        });
    };
    Game.prototype.sendCards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.state.players.forEach(function (player) {
                    discord_1.sendUserCards(player, _this.state.currentRound);
                });
                return [2 /*return*/];
            });
        });
    };
    Game.prototype.notifyRoles = function () {
        var players = this.state.players;
        players.forEach(function (player) {
            discord_1.sendUser(player, "Hello <@" + player.discordId + "> ,\nYou play as **" + player.role + "**");
        });
    };
    Game.prototype.findPlayer = function (discordId) {
        return this.state.players.filter(function (x) { return x.discordId == discordId; })[0];
    };
    Game.prototype.addPlayer = function (discordId, discordName) {
        var player = new player_1.Player();
        player.discordId = discordId;
        player.name = discordName;
        this.state.players.push(player);
        return player;
    };
    Game.prototype.removePlayer = function (discordId) {
        var player = this.findPlayer(discordId);
        if (player) {
            var index = this.state.players.indexOf(player);
            this.state.players.splice(index, 1);
        }
    };
    Game.prototype.foundElderScroll = function () {
        this.state.elderScrollsFound += 1;
        this.state.elderScrollsFoundThisRound += 1;
        if (this.state.elderScrollsFound == this.state.players.length) {
            this.endByElderScrolls();
        }
        else
            this.endTurn();
    };
    Game.prototype.flashlight = function (discordId, index) {
        var player = this.findPlayer(discordId);
        this.state.flashlightHolder = player;
        if (index >= player.cards.length)
            return;
        var card = player.cards[index];
        if (card.onSelect)
            card.onSelect();
    };
    Game.prototype.nothingHappened = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.endTurn()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.endByCthulhu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cultistsWon()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.endByNecronomicon = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.state.elderScrollsFoundThisRound == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cultistsWon()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.endTurn();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.endByElderScrolls = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publishAll("All the elder scrolls has been found.")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.investigatorsWon()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.endByDefault = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publishAll("Investigators run out of time.")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.cultistsWon()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.cultistsWon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cultists, str, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cultists = this.state.players.filter(function (p) { return p.role == 'CULTIST'; });
                        str = "Game over.\n> **Cultists WON!**";
                        i = 0;
                        cultists.forEach(function (p) {
                            str += "\n> " + (i + 1) + ". <@" + p.discordId + "> ";
                            i++;
                        });
                        return [4 /*yield*/, this.publishAll(str)];
                    case 1:
                        _a.sent();
                        this.state.active = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.investigatorsWon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cultists, str, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cultists = this.state.players.filter(function (p) { return p.role == 'INVESTIGATOR'; });
                        str = "Game over.\n> **Investigators WON!**";
                        i = 0;
                        cultists.forEach(function (p) {
                            str += "\n> " + (i + 1) + ". <@" + p.discordId + "> ";
                            i++;
                        });
                        return [4 /*yield*/, this.publishAll(str)];
                    case 1:
                        _a.sent();
                        this.state.active = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Game;
}());
exports.Game = Game;
