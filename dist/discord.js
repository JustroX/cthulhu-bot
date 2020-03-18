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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var discord_js_1 = require("discord.js");
var game_1 = require("./game");
var util_1 = require("./util");
var client = new discord_js_1.Client();
function onReady(cb) {
    client.login(process.env.BOT_TOKEN);
    client.on('ready', function () { cb(); });
}
exports.onReady = onReady;
var SESSIONS = {};
var SESSION_MAP = {};
function joinGame(sessionID, lobby, player) {
    return __awaiter(this, void 0, void 0, function () {
        var session, game, channel;
        return __generator(this, function (_a) {
            if (SESSION_MAP[player.id]) {
                lobby.send("You already have an active session. Please leave that session and try again.");
                return [2 /*return*/];
            }
            session = SESSIONS[sessionID];
            game = session.game;
            channel = session.channel;
            if (game.state.active) {
                lobby.send("The game is already active.");
                return [2 /*return*/];
            }
            SESSION_MAP[player.id] = session;
            game.addPlayer(player.id, player.username);
            channel.updateOverwrite(player.id, { VIEW_CHANNEL: true });
            channel.send("New player, <@" + player.id + "> , has joined the game.");
            return [2 /*return*/];
        });
    });
}
function newGame(lobby, creator) {
    return __awaiter(this, void 0, void 0, function () {
        var game, sessionID, guild, channel, session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    game = new game_1.Game();
                    sessionID = uuid_1.v4().slice(0, 5);
                    guild = lobby.guild;
                    if (SESSION_MAP[creator.id]) {
                        lobby.send("You already have an active session. Please leave that session and try again.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, guild.channels.create("cthulu-session-" + sessionID, {
                            parent: lobby.parent,
                        })];
                case 1:
                    channel = _a.sent();
                    game.state.creator = creator.id;
                    game.addPlayer(creator.id, creator.username);
                    channel.updateOverwrite(client.user.id, { VIEW_CHANNEL: true });
                    channel.updateOverwrite(creator.id, { VIEW_CHANNEL: true });
                    channel.updateOverwrite(guild.roles.everyone, { VIEW_CHANNEL: false });
                    session = {
                        sessionID: sessionID,
                        game: game,
                        channel: channel
                    };
                    SESSION_MAP[creator.id] = session;
                    SESSIONS[sessionID] = session;
                    lobby.send("Game session has been created.\nJoin game by typing the following\n```\ntrag " + sessionID + "\n```");
                    channel.send("Welcome <@" + creator.id + "> , this is your game session. Let's wait for other players. \n Tell them to join the game by typing \n ```trag " + sessionID + "\n```\nLeave game: \n```tra alis```");
                    return [2 /*return*/];
            }
        });
    });
}
function leaveGame(channelSent, player) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionID, game, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!SESSION_MAP[player.id]) {
                        channelSent.send("You don't have an active session. Start one by typing the following\n```\ntrag tulu\n```");
                        return [2 /*return*/];
                    }
                    session = SESSION_MAP[player.id];
                    sessionID = session.sessionID, game = session.game, channel = session.channel;
                    if (game.state.active) {
                        channelSent.send("Luh, leaver.\n You can not leave while game is still active.");
                        return [2 /*return*/];
                    }
                    game.removePlayer(player.id);
                    channel.updateOverwrite(player.id, { VIEW_CHANNEL: false });
                    delete SESSION_MAP[player.id];
                    return [4 /*yield*/, channel.send("Bye <@" + player.id + ">.")];
                case 1:
                    _a.sent();
                    if (!(game.state.players.length == 0)) return [3 /*break*/, 3];
                    delete SESSIONS[sessionID];
                    return [4 /*yield*/, channel.delete()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getGameState(channelSent, player) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionID, game, channel;
        return __generator(this, function (_a) {
            if (!SESSION_MAP[player.id]) {
                channelSent.send("You don't have an active session. Start one by typing the following\n```\ntrag tulu\n```");
                return [2 /*return*/];
            }
            session = SESSION_MAP[player.id];
            sessionID = session.sessionID, game = session.game, channel = session.channel;
            if (!game.state.active) {
                channelSent.send("Game is not yet active.");
                return [2 /*return*/];
            }
            sendGameState(channel, game);
            return [2 /*return*/];
        });
    });
}
function sendGameState(channel, game) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, elderScrollsFound, turn, currentRound, players, flashlightHolder, roundsLeft, turnsLeft, flashlight, str;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = game.state, elderScrollsFound = _a.elderScrollsFound, turn = _a.turn, currentRound = _a.currentRound, players = _a.players, flashlightHolder = _a.flashlightHolder;
                    roundsLeft = 5 - currentRound;
                    turnsLeft = players.length - turn;
                    flashlight = flashlightHolder.discordId;
                    return [4 /*yield*/, channel.send("**Cthulu Game**\n> Elder scrolls found: " + elderScrollsFound + "\n> Rounds left: " + roundsLeft + "\n> Turns left: " + turnsLeft + "\nFlashlight holder: <@" + flashlight + ">")];
                case 1:
                    _b.sent();
                    str = '\n**Player Cards**\n';
                    players.forEach(function (player) {
                        str += "\n <@" + player.discordId + ">";
                        player.cards.forEach(function (card, index) {
                            if (card.disabled)
                                str += "\n> " + (index + 1) + ". " + card.cardType;
                            else
                                str += "\n> " + (index + 1) + ". UNKNOWN";
                        });
                    });
                    return [4 /*yield*/, channel.send(str)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function startGame(channelSent, player) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionID, game, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!SESSION_MAP[player.id]) {
                        channelSent.send("You don't have an active session. Start one by typing the following\n```\ntrag tulu\n```");
                        return [2 /*return*/];
                    }
                    session = SESSION_MAP[player.id];
                    sessionID = session.sessionID, game = session.game, channel = session.channel;
                    if (game.state.active) {
                        channelSent.send("Game is already active.");
                        return [2 /*return*/];
                    }
                    if (game.state.creator != player.id) {
                        channelSent.send("Only <@" + game.state.creator + "> can start the game.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, channel.send("Orayt gtahhhhm.")];
                case 1:
                    _a.sent();
                    game.begin();
                    return [2 /*return*/];
            }
        });
    });
}
function endGame(channelSent, player) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionID, game, channel;
        return __generator(this, function (_a) {
            if (!SESSION_MAP[player.id]) {
                channelSent.send("You don't have an active session. Start one by typing the following\n```\ntrag tulu\n```");
                return [2 /*return*/];
            }
            session = SESSION_MAP[player.id];
            sessionID = session.sessionID, game = session.game, channel = session.channel;
            if (!game.state.active) {
                channelSent.send("Game is not active.");
                return [2 /*return*/];
            }
            if (game.state.creator != player.id) {
                channelSent.send("Only <@" + game.state.creator + "> can end the game.");
                return [2 /*return*/];
            }
            channel.send("Game ended.");
            game.state.active = false;
            return [2 /*return*/];
        });
    });
}
client.on('message', function (msg) {
    var content = msg.content, channel = msg.channel, author = msg.author;
    var words = content.split(" ");
    if (words[0] == 'trag') {
        if (words[1] == 'tulu') {
            newGame(channel, author);
            return;
        }
        ;
        var sessionID = words[1];
        if (SESSIONS[sessionID]) {
            joinGame(sessionID, channel, author);
        }
    }
    if (content == 'tra alis') {
        leaveGame(channel, author);
    }
    if (content == 'tulu g') {
        startGame(channel, author);
    }
    if (content == 'tulu state') {
        getGameState(channel, author);
    }
    if (content == 'tulu end') {
        endGame(channel, author);
    }
    if (words[0] == 'flash' && words.length == 2 && words[1][0] == '<') {
        showHand(channel, author, words[1]);
    }
});
function sendUser(player, text) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionID, game, channel, member;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = SESSION_MAP[player.discordId];
                    sessionID = session.sessionID, game = session.game, channel = session.channel;
                    return [4 /*yield*/, channel.guild.members.fetch(player.discordId)];
                case 1:
                    member = _a.sent();
                    member.send(text);
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendUser = sendUser;
function sendUserCards(player, round) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionID, game, channel, str, cards, member;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = SESSION_MAP[player.discordId];
                    sessionID = session.sessionID, game = session.game, channel = session.channel;
                    str = "\nYour cards for round " + (round + 1) + ".\n";
                    cards = __spreadArrays(player.cards);
                    util_1.shuffle(cards);
                    cards.forEach(function (card) {
                        str += "> " + card.cardType + "\n";
                    });
                    return [4 /*yield*/, channel.guild.members.fetch(player.discordId)];
                case 1:
                    member = _a.sent();
                    member.send(str);
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendUserCards = sendUserCards;
function sendUsers(creator, text) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionID, game, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = SESSION_MAP[creator];
                    sessionID = session.sessionID, game = session.game, channel = session.channel;
                    return [4 /*yield*/, channel.send(text)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendUsers = sendUsers;
function sendState(creatorId) {
    return __awaiter(this, void 0, void 0, function () {
        var session, game, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = SESSION_MAP[creatorId];
                    game = session.game, channel = session.channel;
                    return [4 /*yield*/, sendGameState(channel, game)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendState = sendState;
function showHand(channelSent, player, target) {
    return __awaiter(this, void 0, void 0, function () {
        var session, sessionID, game, channel, targetId, targetPlayer, gamePlayer, cards, emojis, message, i, collected, reaction, index;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!SESSION_MAP[player.id]) {
                        channelSent.send("You don't have an active session. Start one by typing the following\n```\ntrag tulu\n```");
                        return [2 /*return*/];
                    }
                    session = SESSION_MAP[player.id];
                    sessionID = session.sessionID, game = session.game, channel = session.channel;
                    if (!game.state.active) {
                        channelSent.send("Game is not active.");
                        return [2 /*return*/];
                    }
                    if (game.state.flashlightHolder.discordId != player.id) {
                        channelSent.send("Only <@" + game.state.flashlightHolder.discordId + "> can point the flashlight.");
                        return [2 /*return*/];
                    }
                    targetId = target.substring(3, target.length - 1);
                    targetPlayer = game.findPlayer(targetId);
                    gamePlayer = game.findPlayer(player.id);
                    cards = targetPlayer.cards;
                    emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
                    return [4 /*yield*/, channel.send("Pick a card from " + target)];
                case 1:
                    message = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < cards.length)) return [3 /*break*/, 5];
                    if (!!cards[i].disabled) return [3 /*break*/, 4];
                    return [4 /*yield*/, message.react(emojis[i])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, message.awaitReactions(function (reaction, user) {
                        return emojis.includes(reaction.emoji.name) && user.id == player.id;
                    }, { max: 1 })];
                case 6:
                    collected = _a.sent();
                    reaction = collected.first();
                    if (!reaction) {
                        channel.send("No reaction lol. Bug to ifix mo na lang soon.");
                        return [2 /*return*/];
                    }
                    index = emojis.indexOf(reaction.emoji.name);
                    message.reactions.removeAll();
                    channel.send("You picked card #" + (index + 1) + "!");
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    game.state.flashlightHolder = targetPlayer;
                                    return [4 /*yield*/, channel.send("The card is\n> " + cards[index].cardType, {
                                            files: [{
                                                    attachment: __dirname + ("/../assets/" + cards[index].cardType + ".png"),
                                                    name: 'card.png'
                                                }]
                                        })];
                                case 1:
                                    _a.sent();
                                    if (cards[index] && cards[index].onSelect)
                                        cards[index].onSelect(game, gamePlayer);
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 1000);
                    return [2 /*return*/];
            }
        });
    });
}
