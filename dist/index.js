"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.config();
var discord_1 = require("./discord");
discord_1.onReady(function () {
    console.log('Bot is alive.');
});
