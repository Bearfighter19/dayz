const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const Gamedig = require("gamedig");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const HOST = process.env.HOST;
const PORT = process.env.PORT || 2302;
const INTERVAL = process.env.INTERVAL || 60000;

async function updateServerStatus() {
    try {
        const state = await Gamedig.query({
            type: "dayz",
            host: HOST,
            port: PORT
        });

        const players = state.players.length;
        const maxPlayers = state.maxplayers;

        client.user.setActivity(
            `${players}/${maxPlayers} Players Online`,
            { type: ActivityType.Watching }
        );
    } catch (err) {
        client.user.setActivity("Server Offline", {
            type: ActivityType.Watching
        });
    }
}

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);

    updateServerStatus();
    setInterval(updateServerStatus, INTERVAL);
});

client.login(TOKEN);