const { MessageEmbed } = require('discord.js')
const {
    setGoldenChannelPlayerThumbnail,
    setGoldenChannerlPlayerTitle,
    setGoldenChannerlPlayerQueue,
    setGoldenChannelPlayerFooter,
    resetGoldenChannelPlayer,
} = require('../../functions/channel')

module.exports =
    ('tracksAdd',
    (client, queue, tracks) => {
        const guild = tracks[0].requestedBy.guild
        //const guild = client.guilds.get(queue.message.guildId)

        setGoldenChannelPlayerFooter(
            guild,
            `${queue.tracks.length} songs in queue | Volume: ${queue.volume}%`
        )

        //console.log(tracks)
        //console.log(queue.tracks)

       // let tracksMap = [`0. ${tracks[0].title}\n`]
       let tracksMap = []

        tracksMap.push(queue.tracks
        .slice(0)
        .reverse()
        .map((track, i) => {
          if(track !== queue.tracks[0]) {
              return `${queue.tracks.length+1 - i}. ${track.title}\n`
            }
        }))

        if(tracksMap[0].length === 0) {
          console.log("KEINE QUEUE WEIL NRU EIN SONG DREIN UND SO") // CURRENT QUEUE LIST
          setGoldenChannerlPlayerQueue(guild, `JOIN CHANNEL TO ADD STUFF YOU KNOW HOW IT IS`)
        } else {
          console.log(`${queue.tracks.length+1}. ${tracks[0].title}\n` + tracksMap) // CURRENT QUEUE LIST
          setGoldenChannerlPlayerQueue(guild, `${queue.tracks.length}. ${tracks[0].title}\n` + tracksMap)
        }
      

        /*console.log("/////////////////")
        
        const tracksMap2 = tracks
        .map((track, i) => {
          return `${queue.tracks.length - i}. ${track.title}\n`
        })
        console.log(tracksMap2) // SONG ADDED IN THIS ONE



        if(tracksMap[1] !== undefined && tracksMap2 !== undefined) {
          tracksMap[1] = tracksMap[1] + tracksMap2
        }
        
        console.log("++++++++++++++")
        console.log(tracksMap[1])*/

       /* if(tracksMap2[0] !== undefined)
          tracksMap[1].add(tracksMap2[0])
          //tracksMap[1] = tracksMap[1] + tracksMap2[0];

        console.log("///////////////////////////////////////")
        console.log(tracksMap[1])*/

       /* const tracksA = tracks
                .slice(0)
                .reverse()
                .map((song, i) => {
                        return `${queue.tracks.length - i}. ${song.title}\n`
                })
                console.log(tracksA)
        setGoldenChannerlPlayerQueue(guild, tracksA.join('')) */

        /*if (queue.tracks[0] === undefined) {
            setGoldenChannerlPlayerQueue(
                guild,
                'Join a voice channel and queue songs by name or url in here.'
            )
        } else {

          console.log(queue.tracks[0])
          return;

            const tracks = queue.tracks
                .slice(0)
                .reverse()
                .map((song, i) => {
                    if (queue.current.id != queue.tracks[0].id) {
                        return `${queue.tracks.length - i}. ${song.title} - ${
                            song.author
                        } [${song.duration}]\n`
                    }
                })
            setGoldenChannerlPlayerQueue(queue.guild, tracks.join(''))
        }*/

        return

        const Embed = new MessageEmbed()
            .setTitle('Music Player')
            .setDescription(
                `${
                    tracks.length > 1 ? `\`${tracks.length}\` Songs` : 'Song'
                } has been Added to Queue\n**RequestedBy :** \`${
                    tracks[0].requestedBy.user.username
                }\``
            )
            .setColor('GREEN')
        return void queue.message.channel.send({ embeds: [Embed] })
    })
