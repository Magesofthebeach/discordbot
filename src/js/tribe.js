const {cleantext, moderator} = require('./shared.js');

export function brainwash(message, bot, mentions) {
    let member = message.member;

    if (mentions.length > 0) {
        if (moderator(message)) {
            member = bot.guilds.get(message.guild.id).members.get(mentions[0]);
        }
        else {
            return;
        }
    }

    let bw = bot.guilds.get(message.guild.id).roles.find(role => role.name==="Brainwashed");
    if (!bw) return;

    if (member.roles.find(role => role === bw)) {
        member.removeRole(bw);
        return `Your mind is free!`;
    }
    else {
        member.addRole(bw);
        return `<:Mar:294942283273601044> You have been brainwashed`;
    }
}

export function showTribe(message, bot) {
    let bw = bot.guilds.get(message.guild.id).roles.find(role => role.name==="Brainwashed");

    let tribe = "";
    ["Danian", "Mipedian", "M'arrillian", "OverWorld", "UnderWorld", "Tribeless"]
    .forEach((t) => {
        let gr = bot.guilds.get(message.guild.id).roles.find(role => role.name===t);
        if (message.member.roles.find(role => role === gr)) {
            if (bw && message.member.roles.find(role => role === bw)) {
                return tribe = `You are a brainwashed ` + (() => {
                    if (t == "OverWorld") return "OverWorlder";
                    else if (t == "UnderWorld") return "UnderWorlder";
                    else return t;
                })();
            }
            return tribe = `You are part of the ` + t;
        }
    });
    if (tribe) return tribe;
    return `You have not declared an allegiance. Use !join *tribe name*`;
}

export function leaveTribe(message, bot) {
    let leaving_tribe = "";
    ["Danian", "Mipedian", "M'arrillian", "OverWorld", "UnderWorld", "Tribeless", "Frozen"]
    .forEach((t) => {
        let gr = bot.guilds.get(message.guild.id).roles.find(role => role.name===t);
        if (message.member.roles.find(role => role === gr)) {
            message.member.removeRole(gr);
            leaving_tribe = t;
        }
    });
    return leaving_tribe;
}

export function joinTribe(tribe, message, bot) {
    let leaving_tribe = "";
    ["Danian", "Mipedian", "M'arrillian", "OverWorld", "UnderWorld", "Tribeless", "Frozen"]
    .forEach((t) => {
        let gr = bot.guilds.get(message.guild.id).roles.find(role => role.name===t);
        if (message.member.roles.find(role => role === gr)) {
            if (tribe == t) return leaving_tribe = "stay";
            else {
                message.member.removeRole(gr);
                leaving_tribe = t;
            }
        }
    });

    if (leaving_tribe == "stay")
        return `You're already part of the ${tribe}.`

    let joining_msg = "";
    let leaving_msg = "";
    switch(tribe.toLowerCase()) {
        case 'danian':
        case 'danians':
            tribe = "Danian";
            if (leaving_tribe) {
                joining_msg = `<:gottahave:400174328215502851> You've been infected.`;

                if (leaving_tribe == "Mipedian") {
                    leaving_msg = `<:Shim:315235831927537664> Hey! Return our water!`;
                }
                else if (leaving_tribe == "UnderWorld") {
                    leaving_msg = `<:Chaor:285620681163669506> Bugs, humans? I'll squash you both!`;
                }
            }
            else {
                joining_msg = `<:gottahave:400174328215502851> Yo, you're one of the hive now.`;
            }
            break;
        case 'mipedian':
        case 'mipedians':
            tribe = "Mipedian";
            if (leaving_tribe == "Danian") {
                joining_msg = `<:Shim:315235831927537664> Another one purified`;
            }
            else {
                joining_msg = `<:Shim:315235831927537664> What's up my dude? heh heh heh, welcome to the fun.`;
            }
            break;
        case 'marrillian':
        case "m'arrillian":
        case 'm’arrillian':
        case 'marrillians':
        case "m'arrillians":
        case 'm’arrillians':
            tribe = "M'arrillian";
            joining_msg = `<:Mar:294942283273601044> You'll serve your purpose.`
            break;
        case 'overworld':
        case 'overworlder':
        case 'overworlders':
            tribe = "OverWorld";
            if (leaving_tribe == "UnderWorld") {
                leaving_msg = "<:Chaor:285620681163669506> How dare you betray me for the OverWorld!";
                joining_msg = "<:ZalThink:565050379499208704> I'm still suspicious of your allegiance, but we can use another set of hands.";
            }
            else if (leaving_tribe == "Mipedian") {
                leaving_msg = "<:Shim:315235831927537664> Look out!";
                joining_msg = `<:WhyHello:586724104732672000> SURPRISE!`
            }
            else {
                joining_msg = `<:Bodal:401553896108982282> You have joined the mighty forces of the OverWorld.`;
            }
            break;
        case 'underworld':
        case 'underworlder':
        case 'underworlders':
            tribe = "UnderWorld";
            if (leaving_tribe == "OverWorld") {
                joining_msg = `<:Chaor:285620681163669506> Ah good! You can tell me all their secrets! `;
            }
            else {
                joining_msg = `<:Chaor:285620681163669506> Puny humans can still fight for Chaor!`;
            }
            break;
        case 'tribeless':
        case 'generic':
            tribe = "Tribeless";
            if (leaving_tribe) {
                joining_msg = `<:creepy:471863166737973268> You've left your home behind`
            }
            else {
                joining_msg = `<:creepy:471863166737973268> New prey 👀`;
            }
            break;
        case 'frozen':
            tribe = "Frozen";
            joining_msg = `Shhhh we haven't been revealed yet`;
            break;
        default:
            return `${tribe} is not a valid faction`;
    }

    let guild_role = bot.guilds.get(message.guild.id).roles.find(role => role.name===tribe);
    if (guild_role) {
        message.member.addRole(guild_role);
        if (leaving_msg != "") {
            return leaving_msg + '\n' + joining_msg;
        }
        return joining_msg;
    }
    return `Sorry this guild doesn't have tribal roles`;
}
