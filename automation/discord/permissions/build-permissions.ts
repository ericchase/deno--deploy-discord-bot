interface PermissionObject {
    identifier: string;
    value: string;
    description: string;
    channel_t: boolean;
    channel_v: boolean;
    channel_s: boolean;
    requires_2fa: boolean;
    is_timeout: boolean;
}

function toPermissionList(csv: string): PermissionObject[] {
    function toObject(columns: string[]): PermissionObject {
        return {
            identifier: columns[0].replace(/ \*{1,2}/, ''),
            value: columns[1].slice(columns[1].indexOf('(') + 1, columns[1].indexOf(')')),
            description: columns[2].trim(),
            channel_t: columns[3].includes('T'),
            channel_v: columns[3].includes('V'),
            channel_s: columns[3].includes('S'),
            requires_2fa: columns[0].endsWith(' *'),
            is_timeout: columns[0].endsWith(' **'),
        }
    }

    return csv.split('\n')
        .map(line => line.split('\t'))
        .map(columns => toObject(columns));
}

function toString(list: PermissionObject[]): string {
    function buildParts(o: PermissionObject): string[] {
        return [
            o.is_timeout
                ? '/*|  Timeout  |*/'
                : `/*|  ${o.channel_t ? 'T' : ' '}${o.channel_v ? 'V' : ' '}${o.channel_s ? 'S' : ' '} ${o.requires_2fa ? '2FA' : '   '}  |*/`,
            `   ${o.identifier} = ${o.value},   `,
            `// ${o.description}`,
        ];
    }
    const partsList = list.map(buildParts);
    const maxCharCount = Math.max(...partsList.map(p => p[0].length + p[1].length));

    const stringList = [];
    for (const p of partsList) {
        const count = maxCharCount - (p[0].length + p[1].length);
        stringList.push(`    ${p[0]}${p[1]}${' '.repeat(count)}${p[2]}`)
    }

    return stringList.join('\n');
}

const csv = Deno.readTextFileSync('./permissions.csv');
const permissionList = toPermissionList(csv);
const formattedString = toString(permissionList);
Deno.writeTextFileSync('./permissions.txt', formattedString);
