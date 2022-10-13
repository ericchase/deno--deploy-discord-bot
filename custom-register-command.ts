const BOT_TOKEN = Deno.env.get('DISCORD_TOKEN_TEST_BOT');
if (!BOT_TOKEN) {
    console.log('Environment variable for bot token not found.');
    Deno.exit(1);
}

const CLIENT_ID = "";

type Snowflake = string;

const Locale = [
    "da",    //   Danish                  Dansk
    "de",    //   German                  Deutsch
    "en-GB", //   English, UK             English, UK
    "en-US", //   English, US             English, US
    "es-ES", //   Spanish                 Español
    "fr",    //   French                  Français
    "hr",    //   Croatian                Hrvatski
    "it",    //   Italian                 Italiano
    "lt",    //   Lithuanian              Lietuviškai
    "hu",    //   Hungarian               Magyar
    "nl",    //   Dutch                   Nederlands
    "no",    //   Norwegian               Norsk
    "pl",    //   Polish                  Polski
    "pt-BR", //   Portuguese, Brazilian   Português do Brasil
    "ro",    //   Romanian, Romania       Română
    "fi",    //   Finnish                 Suomi
    "sv-SE", //   Swedish                 Svenska
    "vi",    //   Vietnamese              Tiếng Việt
    "tr",    //   Turkish                 Türkçe
    "cs",    //   Czech                   Čeština
    "el",    //   Greek                   Ελληνικά
    "bg",    //   Bulgarian               български
    "ru",    //   Russian                 Pусский
    "uk",    //   Ukrainian               Українська
    "hi",    //   Hindi                   हिन्दी
    "th",    //   Thai                    ไทย
    "zh-CN", //   Chinese, China          中文
    "ja",    //   Japanese                日本語
    "zh-TW", //   Chinese, Taiwan         繁體中文
    "ko",    //   Korean                  한국어
];

/** Permissions
 * 
 * Permissions are a way to limit and grant certain abilities to users in
 * Discord. A set of base permissions can be configured at the guild level for
 * different roles. When these roles are attached to users, they grant or revoke
 * specific privileges within the guild. Along with the guild-level permissions,
 * Discord also supports permission overwrites that can be assigned to
 * individual roles or members on a per-channel basis.
 * 
 * In API v8 and above, all permissions are serialized as strings, including the
 * allow and deny fields in overwrites. Any new permissions are rolled back into
 * the base field.
 * 
 * Permissions are stored in a variable-length integer serialized into a string,
 * and are calculated using bitwise operations. For example, the permission
 * value `123` will be serialized as "123". For long-term stability, it's
 * recommended to deserialize the permissions using your preferred languages'
 * Big Integer libraries. The total permissions integer can be determined by
 * OR-ing (`|`) together each individual value, and flags can be checked using
 * AND (`&`) operations.
 * 
 * Note that permission names may be referred to differently in the Discord
 * client. For example, "Manage Permissions" refers to MANAGE_ROLES, "Use Voice
 * Activity" refers to USE_VAD, and "Timeout Members" refers to
 * MODERATE_MEMBERS.
 * 
 * Timed out members will temporarily lose all permissions except VIEW_CHANNEL
 * and READ_MESSAGE_HISTORY. Owners and admin users with ADMINISTRATOR
 * permissions are exempt.
 * 
 * Permission Hierarchy
 * https://discord.com/developers/docs/topics/permissions#permission-hierarchy
 * 
 * Permission Overwrites
 * https://discord.com/developers/docs/topics/permissions#permission-overwrites
 * Overwrites can be used to apply certain permissions to roles or members on a
 * channel-level. Applicable permissions are indicated by a
 * 
 * T for text channels,
 * V for voice channels, or
 * S for stage channels.
 * 
 * Implicit Permissions
 * https://discord.com/developers/docs/topics/permissions#implicit-permissions
 * 
 * Inherited Permissions (Threads)
 * https://discord.com/developers/docs/topics/permissions#inherited-permissions-threads
 * 
 * 2FA: These permissions require the owner account to use two-factor
 *      authentication when used on a guild that has server-wide 2FA enabled.
 * https://discord.com/developers/docs/topics/oauth2#twofactor-authentication-requirement
 * 
 * Timeout: See Permissions for Timed Out Members to understand how permissions
 *          are temporarily modified for timed out users.
 * https://discord.com/developers/docs/topics/permissions#permissions-for-timed-out-members
 */
enum BitwisePermissionFlags {
    /*|  TVS      |*/   CREATE_INSTANT_INVITE = 1 << 0,         // Allows creation of instant invites
    /*|      2FA  |*/   KICK_MEMBERS = 1 << 1,                  // Allows kicking members
    /*|      2FA  |*/   BAN_MEMBERS = 1 << 2,                   // Allows banning members
    /*|      2FA  |*/   ADMINISTRATOR = 1 << 3,                 // Allows all permissions and bypasses channel permission overwrites
    /*|  TVS 2FA  |*/   MANAGE_CHANNELS = 1 << 4,               // Allows management and editing of channels
    /*|      2FA  |*/   MANAGE_GUILD = 1 << 5,                  // Allows management and editing of the guild
    /*|  TV       |*/   ADD_REACTIONS = 1 << 6,                 // Allows for the addition of reactions to messages
    /*|           |*/   VIEW_AUDIT_LOG = 1 << 7,                // Allows for viewing of audit logs
    /*|   V       |*/   PRIORITY_SPEAKER = 1 << 8,              // Allows for using priority speaker in a voice channel
    /*|   V       |*/   STREAM = 1 << 9,                        // Allows the user to go live
    /*|  TVS      |*/   VIEW_CHANNEL = 1 << 10,                 // Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels
    /*|  TV       |*/   SEND_MESSAGES = 1 << 11,                // Allows for sending messages in a channel and creating threads in a forum (does not allow sending messages in threads)
    /*|  TV       |*/   SEND_TTS_MESSAGES = 1 << 12,            // Allows for sending of /tts messages
    /*|  TV  2FA  |*/   MANAGE_MESSAGES = 1 << 13,              // Allows for deletion of other users messages
    /*|  TV       |*/   EMBED_LINKS = 1 << 14,                  // Links sent by users with this permission will be auto-embedded
    /*|  TV       |*/   ATTACH_FILES = 1 << 15,                 // Allows for uploading images and files
    /*|  TV       |*/   READ_MESSAGE_HISTORY = 1 << 16,         // Allows for reading of message history
    /*|  TVS      |*/   MENTION_EVERYONE = 1 << 17,             // Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel
    /*|  TV       |*/   USE_EXTERNAL_EMOJIS = 1 << 18,          // Allows the usage of custom emojis from other servers
    /*|           |*/   VIEW_GUILD_INSIGHTS = 1 << 19,          // Allows for viewing guild insights
    /*|   VS      |*/   CONNECT = 1 << 20,                      // Allows for joining of a voice channel
    /*|   V       |*/   SPEAK = 1 << 21,                        // Allows for speaking in a voice channel
    /*|   VS      |*/   MUTE_MEMBERS = 1 << 22,                 // Allows for muting members in a voice channel
    /*|   VS      |*/   DEAFEN_MEMBERS = 1 << 23,               // Allows for deafening of members in a voice channel
    /*|   VS      |*/   MOVE_MEMBERS = 1 << 24,                 // Allows for moving of members between voice channels
    /*|   V       |*/   USE_VAD = 1 << 25,                      // Allows for using voice-activity-detection in a voice channel
    /*|           |*/   CHANGE_NICKNAME = 1 << 26,              // Allows for modification of own nickname
    /*|           |*/   MANAGE_NICKNAMES = 1 << 27,             // Allows for modification of other users nicknames
    /*|  TVS 2FA  |*/   MANAGE_ROLES = 1 << 28,                 // Allows management and editing of roles
    /*|  TV  2FA  |*/   MANAGE_WEBHOOKS = 1 << 29,              // Allows management and editing of webhooks
    /*|      2FA  |*/   MANAGE_EMOJIS_AND_STICKERS = 1 << 30,   // Allows management and editing of emojis and stickers
    /*|  TV       |*/   USE_APPLICATION_COMMANDS = 1 << 31,     // Allows members to use application commands, including slash commands and context menu commands
    /*|    S      |*/   REQUEST_TO_SPEAK = 1 << 32,             // Allows for requesting to speak in stage channels (This permission is under active development and may be changed or removed)
    /*|   VS      |*/   MANAGE_EVENTS = 1 << 33,                // Allows for creating, editing, and deleting scheduled events
    /*|  T   2FA  |*/   MANAGE_THREADS = 1 << 34,               // Allows for deleting and archiving threads, and viewing all private threads
    /*|  T        |*/   CREATE_PUBLIC_THREADS = 1 << 35,        // Allows for creating public and announcement threads
    /*|  T        |*/   CREATE_PRIVATE_THREADS = 1 << 36,       // Allows for creating private threads
    /*|  TV       |*/   USE_EXTERNAL_STICKERS = 1 << 37,        // Allows the usage of custom stickers from other servers
    /*|  T        |*/   SEND_MESSAGES_IN_THREADS = 1 << 38,     // Allows for sending messages in threads
    /*|   V       |*/   USE_EMBEDDED_ACTIVITIES = 1 << 39,      // Allows for using Activities (applications with the EMBEDDED flag) in a voice channel
    /*|  Timeout  |*/   MODERATE_MEMBERS = 1 << 40,             // Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels
}

enum ChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_ANNOUNCEMENT = 5,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15,
}

enum ApplicationCommandOptionTypes {
    SUB_COMMAND = 1,   // 
    SUB_COMMAND_GROUP, // 
    STRING,            // 
    INTEGER,           // 
    BOOLEAN,           // 
    USER,              // 
    CHANNEL,           // 
    ROLE,              // 
    MENTIONABLE,       // 
    NUMBER,            // 
    ATTACHMENT,        // 
}

type Integer = number;

/** TODO: Incomplete
 * Required options must be listed before optional options
 * 
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
 */
interface ApplicationCommandOption {
    type?: ApplicationCommandOptionTypes;
    name?: string;
    name_localizations?: Map<string, string>;
    description?: string;
    description_localizations?: Map<string, string>;
    required?: boolean;
    choices?: any;
    options?: any;
    channel_types?: ChannelTypes[];
    min_value?: Integer | number;
    max_value?: Integer | number;
    min_length?: Integer;
    max_length?: Integer;
    autocomplete?: boolean; // may not be set to true if `choices` are present.
}

enum ApplicationCommandTypes {
    CHAT_INPUT = 1, // Slash commands; a text-based command that shows up when a user types /
    USER,           // A UI-based command that shows up when you right click or tap on a user
    MESSAGE         // A UI-based command that shows up when you right click or tap on a message
}

interface ApplicationCommand {
    id?: Snowflake;
    type?: ApplicationCommandTypes;
    application_id?: Snowflake;
    guild_id?: Snowflake;

    /**
     * Application Command Naming
     * CHAT_INPUT command names and command option names must match the
     * following regex ^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$ with the
     * unicode flag set. If there is a lowercase variant of any letters used,
     * you must use those. Characters with no lowercase variants and/or uncased
     * letters are still allowed. USER and MESSAGE commands may be mixed case
     * and can include spaces.
     */
    name?: string;

    /**
     * Localization dictionary for name field. Values follow the same
     * restrictions as name.
     *///                Map<Locale, Name>
    name_localizations?: Map<string, string>;

    /**
     * Description for CHAT_INPUT commands, 1-100 characters. Empty string for
     * USER and MESSAGE commands.
     */
    description?: string;

    /**
     * Localization dictionary for description field. Values follow the same
     * restrictions as description.
     *///                       Map<Locale, Description>
    description_localizations?: Map<string, string>;

    /**
     * Parameters for CHAT_INPUT commands, max of 25.
     */
    options?: ApplicationCommandOption[];

    /**
     * Set of permissions represented as a bit set.
     */
    default_member_permissions?: string;
    dm_permission?: boolean;
    // default_permission?: boolean; // To be deprecated.
    version?: Snowflake;
}

async function RegisterCommand(command_data: ApplicationCommand) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bot ${BOT_TOKEN}`);

    try {
        const response = await fetch(`https://discord.com/api/v8/applications/${CLIENT_ID}/commands`, {
            method: 'POST',
            headers,
            body: JSON.stringify(command_data)
        });
        console.log(response);
    } catch (err) {
        console.log('fetch error');
        throw err;
    }
}

RegisterCommand({
    "name": "hello",
    "description": "Greet a person",
    "options": [{
        "name": "name",
        "description": "The name of the person",
        "type": 3,
        "required": true,
    }],
});
