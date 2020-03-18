import { config } from 'dotenv';
config();

import { onReady } from './discord';
onReady(()=> {
	console.log('Bot is alive.');
});