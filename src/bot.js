require("dotenv").config();

const { Client } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_VOICE_STATES"],
  partials: ["CHANNEL"],
});

const guildConnections = {};

client.on("voiceStateUpdate", async (oldState, newState) => {
  const channel = newState.channel ?? oldState.channel;
  const members = channel.members.filter((member) => !member.user.bot).size;

  if (members == 2) {
    guildConnections[channel.guild.id] = {
      channelId: channel.id,
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      }),
    };
  } else {
    if (guildConnections[channel.guild.id]?.channelId == channel.id) {
      getVoiceConnection(channel.guild.id)?.destroy();
    }
  }
});

client.login(process.env.TOKEN);
