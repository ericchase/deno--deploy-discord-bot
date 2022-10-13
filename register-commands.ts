import * as discordeno from "https://deno.land/x/discordeno@17.0.0/mod.ts";

import { readDirRecursiveSync } from "./helpers/read-dir-recursive.ts"

const BOT_TOKEN = Deno.env.get('DISCORD_TOKEN_TEST_BOT');
if (!BOT_TOKEN) {
    console.log('Environment variable for bot token not found.');
    Deno.exit(1);
}

const bot = discordeno.createBot({
    token: BOT_TOKEN
});

try {
    console.log('Successfully Registered Commands:');
    const dirEntryList = readDirRecursiveSync("./commands");
    for (const dirEntry of dirEntryList) {
        if (dirEntry.isFile) {
            if (dirEntry.name.endsWith('.json')) {
                const command = JSON.parse(Deno.readTextFileSync(dirEntry.path));
                await discordeno.createGlobalApplicationCommand(bot, command);
                console.log(command.name);
            }
        }
    }
} catch (e) {
    throw e;
}
console.log();
