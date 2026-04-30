const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const Gamedig = require('gamedig');
const config = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

//--const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    console.error("Missing TOKEN");
    process.exit(1);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    setInterval(async () => {
        try {
            const state = await Gamedig.query({
                type: 'dayz',
                host: config.server.ip,
                port: config.server.queryPort
            });

            client.user.setPresence({
                activities: [{
                    name: `DayZ: ${state.players.length}/${state.maxplayers}`,
                    type: ActivityType.Playing
                }],
                status: 'online'
            });

        } catch {
            client.user.setPresence({
                activities: [{
                    name: `DayZ: Offline`,
                    type: ActivityType.Playing
                }],
                status: 'dnd'
            });
        }
    }, 60000);
});

client.login(TOKEN);