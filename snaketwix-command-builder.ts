function main() {
    const command = new CommandBuilder();
    const json = command
        .setName('Nice')
        .setDesciption('Cool description')
        .setType(PermissionTypes.ROLE)
        .addOption(
            new OptionBuilder()
                .setName('Option name')
                .setDesciption('Option Description')
                .setRequired(true)
                .setType(CommandOptionTypes.CHANNEL)
                .addChannelType(ChannelTypes.PRIVATE_THREAD)
                .addChannelType(ChannelTypes.GUILD_CATEGORY)
                .addChannelType(ChannelTypes.ANNOUNCEMENT_THREAD)
        )
        .addOption(new OptionBuilder().setName('Interesting option').setDesciption('What is this').setRequired(true))
        .convertToJson();

    console.log(json);
}

enum PermissionTypes {
    ROLE = 1,
    USER,
    CHANNEL,
}

enum CommandOptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT,
}

enum ChannelTypes {
    GUILD_TEXT = 0,
    DM,
    GUILD_VOICE,
    GROUP_DM,
    GUILD_CATEGORY,
    GUILD_ANNOUNCEMENT,
    ANNOUNCEMENT_THREAD,
    PUBLIC_THREAD,
    PRIVATE_THREAD,
    GUILD_STAGE_VOICE,
    GUILD_DIRECTORY,
    GUILD_FORUM,
}

interface Choice {
    name: string;
    value: string | number;
}

abstract class BaseClass {
    private name: string;
    private description: string;
    protected type: PermissionTypes | CommandOptionTypes;
    protected options?: OptionBuilder[] = [];

    setName(name: string) {
        this.name = name;
        return this;
    }

    setDesciption(description: string) {
        this.description = description;
        return this;
    }

    setType(type: PermissionTypes | CommandOptionTypes) {
        this.type = type;
        return this;
    }

    addOption(option: OptionBuilder) {
        if (!this.options) {
            throw new Error("Options somehow don't exist?");
        } else if (this.options.length >= 25) {
            throw new Error("Can't add more than 25 options");
        }

        this.options.push(option);
        return this;
    }
}

class CommandBuilder extends BaseClass {
    constructor() {
        super();

        this.setName('PLACEHOLDER NAME').setDesciption('PLACEHOLDER DESCRIPTION').setType(PermissionTypes.ROLE);
    }

    private sanitizeData() {
        if (!this.options) {
            throw new Error("Options don't exist while sanitizing data");
        }

        // Sort, as the docs require required options to come before the optional ones
        this.options.sort((optionA, optionB) => {
            let result = 0;

            if (optionA.isRequired() === optionB.isRequired()) {
                result = 0;
            } else if (optionA.isRequired() === true) {
                result = -1;
            } else if (optionB.isRequired() === true) {
                result = 1;
            }

            return result;
        });

        let options: string[] | undefined = this.options.map((option) => option.toJson());

        return {
            ...this,
            options: options,
        };
    }

    convertToJson() {
        const sanitizedData = this.sanitizeData();
        return JSON.stringify(sanitizedData);
    }
}

class OptionBuilder extends BaseClass {
    private choices?: Choice[] = [];
    private autocomplete: boolean = true;
    private required: boolean = false;
    private channelTypes: ChannelTypes[] = [];
    private minValue: number;
    private maxValue: number;
    private minLength: number;
    private maxLength: number;

    constructor() {
        super();
        this.setName('PLACEHOLDER NAME').setDesciption('PLACEHOLDER DESCRIPTION');
    }

    setAutocomplete(value: boolean) {
        if (!this.choices) throw new Error("Choices don't exist while setting autocomplete");

        if (this.choices.length > 0) {
            console.warn("Can't set autocomplete if choices present");
            this.autocomplete = false;
        } else {
            this.autocomplete = value;
        }

        return this;
    }

    setMaxLength(value: number) {
        this.maxLength = value;
        return this;
    }

    setMinLength(value: number) {
        this.minLength = value;
        return this;
    }

    setMaxValue(value: number) {
        this.maxValue = value;
        return this;
    }

    setMinValue(value: number) {
        this.minValue = value;
        return this;
    }

    setRequired(value: boolean) {
        this.required = value;
        return this;
    }

    addChannelType(value: ChannelTypes) {
        if (this.type !== CommandOptionTypes.CHANNEL) throw new Error("Option type isn't CHANNEL");

        this.channelTypes.push(value);
        return this;
    }

    addChoice(name: string, value: number | string) {
        const choice = { name, value };
        this.choices?.push(choice);

        return this;
    }

    private sanitizeData() {
        if (!this.choices) {
            throw new Error("Choices don't exist while sanitizing options");
        } else if (this.choices.length === 0) {
            this.choices = undefined;
        }
    }

    isRequired() {
        return this.required;
    }

    toJson() {
        this.sanitizeData();
        return JSON.stringify(this);
    }
}

main();
