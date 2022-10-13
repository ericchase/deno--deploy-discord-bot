import * as discordeno from "https://deno.land/x/discordeno@17.0.0/mod.ts";

const BOT_TOKEN = Deno.env.get('DISCORD_TOKEN_TEST_BOT');
if (!BOT_TOKEN) {
    console.log('Environment variable for bot token not found.');
    Deno.exit(1);
}

const bot = discordeno.createBot({
    token: BOT_TOKEN
});

try {
    console.log('List of Registered Commands:');
    const commandList = await discordeno.getGlobalApplicationCommands(bot);
    for (const command of commandList) {
        console.log(command);
    }
} catch (e) {
    throw e;
}
console.log();
