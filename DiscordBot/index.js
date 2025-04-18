const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS] });
const fs = require("fs");
const path = require("path");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());
const log = require("../structs/log.js");
const Users = require("../model/user.js");

client.commands = new Map();

client.once("ready", () => {
    log.bot("Bot is up and running!");

    if (config.bEnableBackendStatus) {
        if (!config.bBackendStatusChannelId || config.bBackendStatusChannelId.trim() === "") {
            log.error("The channel ID has not been set in config.json for bEnableBackendStatus.");
        } else {
            const channel = client.channels.cache.get(config.bBackendStatusChannelId);
            if (!channel) {
                log.error(`Cannot find the channel with ID ${config.bBackendStatusChannelId}`);
            } else {
                const embed = new MessageEmbed()
                    .setTitle("Backend Online")
                    .setDescription("Reload Backend is now online")
                    .setColor("GREEN")
                    .setThumbnail("https://i.imgur.com/2RImwlb.png")
                    .setFooter({
                        text: "Reload Backend",
                        iconURL: "https://i.imgur.com/2RImwlb.png",
                    })
                    .setTimestamp();

                channel.send({ embeds: [embed] }).catch(err => {
                    log.error(err);
                });
            }
        }
    }

    const loadCommands = (dir) => {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                loadCommands(filePath);
            } else if (file.endsWith(".js")) {
                const command = require(filePath);
                const normalizedCommandName = command.commandInfo.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
                client.commands.set(normalizedCommandName, command);
            }
        });
    };

    loadCommands(path.join(__dirname, "commands"));
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isApplicationCommand()) return;

    const normalizedCommandName = interaction.commandName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const command = client.commands.get(normalizedCommandName);

    if (!command) {
        log.error(`Command "${interaction.commandName}" not found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        log.error(`Error executing command "${interaction.commandName}": ${error}`);
        interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
});

client.on("guildBanAdd", async (ban) => {
    if (!config.bEnableCrossBans) 
        return;

    const memberBan = await ban.fetch();

    if (memberBan.user.bot)
        return;

    const userData = await Users.findOne({ discordId: memberBan.user.id });

    if (userData && userData.banned !== true) {
        await userData.updateOne({ $set: { banned: true } });

        let refreshToken = global.refreshTokens.findIndex(i => i.accountId == userData.accountId);

        if (refreshToken != -1)
            global.refreshTokens.splice(refreshToken, 1);
        let accessToken = global.accessTokens.findIndex(i => i.accountId == userData.accountId);

        if (accessToken != -1) {
            global.accessTokens.splice(accessToken, 1);
            let xmppClient = global.Clients.find(client => client.accountId == userData.accountId);
            if (xmppClient)
                xmppClient.client.close();
        }

        if (accessToken != -1 || refreshToken != -1) {
            await functions.UpdateTokens();
        }

        log.debug(`user ${memberBan.user.username} (ID: ${memberBan.user.id}) was banned on the discord and also in the game (Cross Ban active).`);
    }
});

client.on("guildBanRemove", async (ban) => {
    if (!config.bEnableCrossBans) 
        return;

    if (ban.user.bot)
        return;

    const userData = await Users.findOne({ discordId: ban.user.id });
    
    if (userData && userData.banned === true) {
        await userData.updateOne({ $set: { banned: false } });

        log.debug(`User ${ban.user.username} (ID: ${ban.user.id}) is now unbanned.`);
    }
});

//AntiCrash System
client.on("error", (err) => {
    console.log("Discord API Error:", err);
});
  
process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled promise rejection:", reason, p);
});
  
process.on("uncaughtException", (err, origin) => {
    console.log("Uncaught Exception:", err, origin);
});
  
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("Uncaught Exception Monitor:", err, origin);
});

client.login(config.discord.bot_token);