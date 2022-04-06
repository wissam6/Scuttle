const fetch = require("node-fetch");
const axios = require('axios');
const express = require("express");
const app = express();
const { json } = require('express');
// Import relevant classes from discord.js
const { Client, Intents } = require('discord.js');
// Instantiate a new client with some necessary parameters.
const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }
);
const fs = require('fs');

//http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/3463.png

const router = require('./router.js');
const res = require("express/lib/response");
const { stringify } = require("querystring");
app.use('/', router);

app.listen(3000);

//discord api key
client.login('');
client.once('ready', () => {
    console.log("Scuttle is now online");
});


client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase().startsWith('!sc')) {
        var messageArray = message.content;
        messageArray = messageArray.split(' ');
        const lastWord = messageArray[messageArray.length-1];
        const beforeLastWord = messageArray[messageArray.length-2];
        //player info
        if(lastWord == "info") {
            var Name = "";
            for(let g=1;g<messageArray.length-1;g++) {
                Name = Name + messageArray[g] + ' ';
            }
            
            summonerName = Name;
            //server = messageArray[2];
            var url = 'http://localhost:3000/summoner/';
            url = url.concat(summonerName);
            const info = await axios.get(url);
            const iconId = info.data.profileIconId;
            
            client.channels.cache.get('960475513275682858').send(">>> **Name: ** ``" + info.data.name + "\n``**Level:** ``" + info.data.summonerLevel
            + "\n``**id:** ||``" + info.data.id + "\n``||**account id:** ||``" + info.data.accountId + "\n``||**puu id:** ||``" + info.data.puuid + "``||" );
            
            
            
            

        }
       
        //user ingame

        //1.get id
        if(lastWord == "game") {
        
            var Name = "";
            if(messageArray.length == 3) Name = messageArray[1];
            else {
            for(let g=1;g<messageArray.length-2;g++) {
                Name = Name + messageArray[g] + ' ';
            }
            Name = Name + messageArray[messageArray.length-2];
                
            }
            
            summonerName = Name;
            

        var url = 'http://localhost:3000/summoner/';
        url = url.concat(summonerName);
        const info = await axios.get(url);
        var id = info.data.id;
        

        //2.get game info
        id = id.toString();
        var currentChampion;
        var url2 = 'http://localhost:3000/summonergame/';
        url2 = url2.concat(id);
        const gameInfo = await axios.get(url2);
        if(typeof gameInfo.data.gameId === 'undefined') {
            client.channels.cache.get('960475513275682858').send("``" + summonerName + "`` is not in game");
        }
        else{
            Participants = gameInfo.data.participants;
            //summonerName1 = messageArray[1];
            summonerName1 = Name;
            //summonerName1 = stringify(Name);
            //console.log(summonerName1);
            
            for(let i=0;i<Participants.length;i++) {
                //console.log(Participants[i].summonerName);
                if(Participants[i].summonerName == summonerName1) {
                    let rawdata = fs.readFileSync('./jsons/champion.json');
                    let champion = JSON.parse(rawdata);
                    
                        //get champion name
                        var result = [];
                        var result2 = [];
                        for(var k in champion.data) {
                        result.push([champion.data[k].key]);
                        result2.push([champion.data[k].name]);
                        }
                        for(let c=0;c<result.length;c++) {
                            if(result[c] == Participants[i].championId) {
                                currentChampion = result2[c];
                            }
                        }
                        
                    
                   
                    
                }
            }
            const game_length = gameInfo.data.gameLength + 280;
            const time = Math.floor(game_length / 60) + ":" + (game_length % 60 ? game_length % 60 : '00');
            client.channels.cache.get('960475513275682858').send(">>> **game mode:** ``" +gameInfo.data.gameMode + "\n``**game type:** ``" + gameInfo.data.gameType + "\n``**champion:** ``" + currentChampion
            + "\n``**game time:** ``" + time + "``");
        }
        

    }

    //get champion mastery
    for(let f=0;f<messageArray.length;f++) {
        if(messageArray[f]=='champion') {
                
        var Name = "";
        for(let d=1;d<f;d++) {
            Name = Name + messageArray[d] + " ";
        }
        var ChampName = "";
        for(let a=f+1;a<messageArray.length-1;a++) {
            ChampName = ChampName + messageArray[a] + " ";
        }
        ChampName = ChampName + messageArray[messageArray.length-1];
        
        
                
                //get id
                summonerName = Name;
                var url = 'http://localhost:3000/summoner/';
                url = url.concat(summonerName);
                const info = await axios.get(url);
                var id = info.data.id;
                //console.log(id);
                
                //get champion id
                championName = ChampName;
                const champId = getChampionId(ChampName);

                //get mastery
                var url2 = 'http://localhost:3000/summonerChamp/';
                url2 = url2.concat(id);
                
                url2 = url2.concat("/");
                url2 = url2.concat(champId);
                
                
      
                const champInfo = await axios.get(url2);
                
                ChampName = ChampName.charAt(0).toUpperCase() + ChampName.slice(1);
                championName = ChampName;

               if(champInfo.data.chestGranted == false) {
                client.channels.cache.get('960475513275682858').send(">>> **champion:**`` " + championName + "\n``**mastery level:** ``" + champInfo.data.championLevel + 
                "\n``**points:** ``" + champInfo.data.championPoints + "``\n``chest still not granted``");
               }
               else {
                client.channels.cache.get('960475513275682858').send(">>> **champion:**`` " + championName + "\n``**mastery level:** ``" + champInfo.data.championLevel + 
                "\n``**points:** ``" + champInfo.data.championPoints + "``\n``chest granted``");
               }
                
                
            
        }
    }
    

    //get rank info
    if(beforeLastWord == "rank") {

        var Name = "";
        for(let d=1;d<messageArray.length-3;d++) {
            Name = Name + messageArray[d] + " ";
        }
        Name = Name + messageArray[messageArray.length-3];
        const summonerName = Name;
        const id = await getSummonerId(summonerName);
        
        var url = 'http://localhost:3000/summonerRank/';
        url = url.concat(id);
        const rank = await axios.get(url);

        queueType = [];
        tier = [];
        rank2 = [];
        points = [];
        wins = [];
        losses = [];

        for(var o in rank.data) {
            queueType.push([rank.data[o].queueType]);
            tier.push([rank.data[o].tier]);
            rank2.push([rank.data[o].rank]);
            points.push([rank.data[o].leaguePoints]);
            wins.push([rank.data[o].wins]);
            losses.push([rank.data[o].losses]);
        }

        if(lastWord == 'solo') {
            var Wins = parseInt(wins[0]);
            var Losses = parseInt(losses[0]);
            var winRate = (Wins / (Wins + Losses) ) * 100;
            winRate = Math.round(winRate);

            
            if(queueType[0] == 'RANKED_SOLO_5x5') {
                client.channels.cache.get('960475513275682858').send(">>> **queue:** ``"+ queueType[0] +"``\n**rank:**`` " + tier[0] + " " + rank2[0] + "``\n**points:** ``" + points[0]
            + "``\n**wins/losses:** ``" + wins[0] + "/" + losses[0] +  " (" + winRate +  "%)``");
            }
            else {
                client.channels.cache.get('960475513275682858').send(">>> **queue:** ``"+ queueType[1] +"``\n**rank:**`` " + tier[1] + " " + rank2[1] + "``\n**points:** ``" + points[1]
            + "``\n**wins/losses:** ``" + wins[1] + "/" + losses[1] +  " (" + winRate +  "%)``");
            }
            
            
        }
        if(lastWord == 'flex') {
            var Wins = parseInt(wins[1]);
            var Losses = parseInt(losses[1]);
            var winRate = (Wins / (Wins + Losses) ) * 100;
            winRate = Math.round(winRate);
            
            if(queueType[1] == 'RANKED_FLEX_SR') {
                client.channels.cache.get('960475513275682858').send(">>> **queue:** ``"+ queueType[1] +"``\n**rank:**`` " + tier[1] + " " + rank2[1] + "``\n**points:** ``" + points[1]
            + "``\n**wins/losses:** ``" + wins[1] + "/" + losses[1] +  " (" + winRate +  "%)``");
            }
            else {
                client.channels.cache.get('960475513275682858').send(">>> **queue:** ``"+ queueType[0] +"``\n**rank:**`` " + tier[0] + " " + rank2[0] + "``\n**points:** ``" + points[0]
            + "``\n**wins/losses:** ``" + wins[0] + "/" + losses[0] +  " (" + winRate +  "%)``");
            }

        }

        
        
        
    }

    if(messageArray[1] == "help") {
        client.channels.cache.get('960475513275682858').send('>>> ```to see champion info: !sc summonerName champion championName' +
        '\nto get my info: !sc summonerName info\nto get icon: !sc summonerName icon\nto get rank info: !sc summonerName rank queueType' + 
        "\nto see game info: !sc summonerName game```");
    }

    //get icon
    if(lastWord == 'icon') {
            var Name = "";
            for(let g=1;g<messageArray.length-1;g++) {
                Name = Name + messageArray[g] + ' ';
            }
        const summonerName = Name;
        const sumId = await getSummonerProfileId(summonerName);
        var url = 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/';
        url = url.concat(sumId);
        url = url.concat('.png');
        //console.log(url);
        message.channel.send({
            files: [url]
        });
    }

    function getChampionId (championName) {
       //championName = 'Lee Sin';
        let rawdata = fs.readFileSync('./jsons/champion.json');
                    let champion = JSON.parse(rawdata);
                    let champId = "";
                        //get champion name
                        var result = [];
                        var result2 = [];
                        for(var k in champion.data) {
                        result.push([champion.data[k].key]); //champ id's
                        result2.push([champion.data[k].name]); //champ names
                        }
                        
                        
                        for(var c=0;c<result.length;c++) {
                            if(result2[c].toString().toLowerCase() == championName.toLowerCase()) {
                                //console.log(result2[c]);
                                champId = result[c]; //id
                                //console.log(champId);
                                
                            }
                        }
                       
        return champId;
    }
}
    async function getSummonerId (summonerName) {
        var url = 'http://localhost:3000/summoner/';
        url = url.concat(summonerName);
        const info = await axios.get(url);
        var id = info.data.id;
        return id;
    }

    async function getSummonerProfileId (summonerName) {
        var url = 'http://localhost:3000/summoner/';
        url = url.concat(summonerName);
        const info = await axios.get(url);
        var iconId = info.data.profileIconId;
        return iconId;
    }


});






