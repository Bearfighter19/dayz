const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const Gamedig = require("gamedig");
const config = require("./config.json");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

async function updateServerStatus() {
    try {
        const state = await Gamedig.query({
            type: "dayz",
            host: config.host,
            port: config.port
        });

        const players = state.players.length;
        const maxPlayers = state.maxplayers;

        client.user.setActivity(
            `${players}/${maxPlayers} Players Online`,
            { type: ActivityType.Watching }
        );

        console.log(`Players: ${players}/${maxPlayers}`);
    } catch (err) {
        console.log("Server offline or unreachable");

        client.user.setActivity("Server Offline", {
            type: ActivityType.Watching
        });
    }
}

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);

    updateServerStatus();
    setInterval(updateServerStatus, config.interval);
});

client.login(config.token);