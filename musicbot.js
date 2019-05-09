const Discord = require('discord.js');
const client = new Discord.Client();

//const token = "NTAzNDUzMzgzNDE2NjEwODI2.Dtwqag.wPXMXxbga4BF43hdOgk6pQw51Aw";

const token = "NTc0NzIzODgyMzg1NDA4MDA5.XM9jYQ.wI7PNJOSHdEggaXaJIAAwV0Mj_g";

client.login(token);

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };

const musicUrls = [];

client.on('ready', () => {
    console.log("Music Bot is ready!");
});

// https://youtu.be/MkNeIUgNPQ8

client.on('message', async message => {

    if(message.author.bot)
        return;

    if(message.content.toLowerCase().startsWith("?play"))
    {
        let args = message.content.split(" ");
        let url = args[1];
        let VoiceChannel = message.guild.channels.find(channel => channel.id === '516228667685470218');
        if(VoiceChannel != null)
        {
            console.log(VoiceChannel.name + " was found and is a " + VoiceChannel.type + " channel.");
            VoiceChannel.join()
            .then(connection => {
                console.log("Bot joined the channel.");
                const stream = ytdl(url, { filter : 'audioonly' });
                const dispatcher = connection.playStream(stream, streamOptions);

                dispatcher.on('end', () => {
                    VoiceChannel.leave();
                });
            })
            .catch();
        }
    }

    else if(message.content.toLowerCase().startsWith("?queue"))
    {
        let args = message.content.split(" ");
        let url = args[1];
        let VoiceChannel = message.guild.channels.find(channel => channel.id === '574726612592099329');

        var flag = musicUrls.some(element => element === url);

        if(!flag)
        {
            musicUrls.push(url);
            console.log(musicUrls);
        }
        
        if(VoiceChannel != null)
        {
           
            if(VoiceChannel.connection) // If this is null, the bot is not in the channel.
            {
                // If this is true, then there is an existing connection..
                console.log("Existing connection...");
            }
            else {
                try {
                    const voiceConnection = await VoiceChannel.join();
                    await playSong(voiceConnection, VoiceChannel);
                }
                catch(ex)
                {
                    console.log(ex);
                }
            }
        }
        else {

        }
    }
    
});

async function playSong(connection, channel)
{
    console.log("Trying to play song: " + musicUrls[0]);
    const stream = ytdl(musicUrls[0], { filter : 'audioonly' });
    const dispatcher = connection.playStream(stream, streamOptions);

    dispatcher.on('end', () => {
        
        musicUrls.shift();

        if(musicUrls.length == 0)
        {
            console.log("Array length is 0, bot is leaving...");
            channel.leave();
        }
        else {
            console.log("The array is not length 0, there are other items in the queue.");
            setTimeout(() => {
                playSong(connection, channel);
            }, 5000);
        }
    });
}