require("dotenv").config();

const { Client } = require("discord.js");
const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  StreamType,
} = require("@discordjs/voice");
const path = require("path");

const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_VOICE_STATES"],
  partials: ["CHANNEL"],
});

const player = createAudioPlayer();

let resource;

resource = createAudioResource(
  path.join(__dirname, "../assets/audio/music.ogg"),
  {
    inputType: StreamType.OggOpus,
    inlineVolume: true,
  }
);

resource.volume.setVolume(0.01);

player.play(resource);
player.on(AudioPlayerStatus.Idle, () => {
  player.play(resource);
});

const guildConnections = {};

client.on("voiceStateUpdate", async (oldState, newState) => {
  const channel = newState.channel ?? oldState.channel;
  const members = channel.members.filter((member) => !member.user.bot).size;

  if (members == 2) {
    const con = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    guildConnections[channel.guild.id] = {
      channelId: channel.id,
      connection: con,
    };

    con.subscribe(player);
  } else {
    if (guildConnections[channel.guild.id]?.channelId == channel.id) {
      getVoiceConnection(channel.guild.id)?.destroy();
    }
  }
});

client.login(process.env.TOKEN);
