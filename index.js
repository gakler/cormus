const { Client, Permissions } = require("discord.js");
const fs = require("fs");
var data = require("./data.json");
const bot = new Client({
  intents: [
    "DIRECT_MESSAGES",
    "GUILD_MESSAGES",
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGE_TYPING",
  ],
});
const config = require("./config.json");

bot.on("ready", function () {
  console.log("Bot Is Ready");
  bot.user.setActivity(config.general.activity, {
    type: config.general.activity_type,
  });
});

function saveData() {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}
setInterval(async () => {
  let guild = bot.guilds.cache.first();
  let roles = await guild.roles.fetch();
  let channels = await guild.channels.fetch();
  config.general.roles_names.forEach(async (x) => {
    let rolename = x.toLowerCase();
    let role = roles.find((x) => x.name.toLowerCase() == rolename);
    if (!role) return;
    if (data.channels[rolename])
      channels
        .get(data.channels[rolename])
        .setName(`${role.name}: ${role.members.size}`);
    else {
      let newchannel = await guild.channels.create(
        `${role.name}: ${role.members.size}`,
        {
          type: "GUILD_VOICE",
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [Permissions.FLAGS.CONNECT],
            },
          ],
        }
      );
      data.channels[rolename] = newchannel.id;
      saveData();
    }
  });
}, 1000 * 10);
bot.login(config.credentials.token);
