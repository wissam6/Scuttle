const req = require("express/lib/request");
const fetch = require("node-fetch");
const riotKey = 'RGAPI-ad1770a6-9e2b-4e79-b847-3bc0d8c9d098';

    //show summoner info
    
    const showInfo =  async (req,res) => {
    const {summonerName} = req.params;
    var url = 'https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
    url = url.concat(summonerName);
    let resp = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36 Edg/99.0.1150.55",
            "Accept-Language": "en-US,en;q=0.9,bg;q=0.8",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com",
            "X-Riot-Token": riotKey
        }
    });
    let data = await resp.json();
    res.send(data);
};


    //get game info
    const gameInfo = async (req,res) => {
        const {summonerId} = req.params;
        var url = 'https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/';
        url = url.concat(summonerId);
        let resp = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36 Edg/99.0.1150.55",
                "Accept-Language": "en-US,en;q=0.9,bg;q=0.8",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://developer.riotgames.com",
                "X-Riot-Token": riotKey
            }
        });
        let data = await resp.json();
        //console.log(data);
        res.send(data);
    }
    //get champ info
    const champInfo = async (req, res) => {
        const {summonerId} = req.params;
        //console.log(summonerId);
        const {championId} = req.params;
        //console.log(championId);
        var url = "https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/";
        url = url.concat(summonerId);
        url = url.concat("/by-champion/");
        url = url.concat(championId);
        let resp = await fetch(url, {
            headers : {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36 Edg/99.0.1150.55",
                "Accept-Language": "en-US,en;q=0.9,bg;q=0.8",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://developer.riotgames.com",
                "X-Riot-Token": riotKey
            }
        });
        
        let data = await resp.json();
        res.send(data);
    }

    //get rank info
    const rankInfo = async (req,res) => {
       const {summonerId} = req.params;
       url = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/";
       url = url.concat(summonerId);
       //console.log(url);
       let resp = await fetch(url, {
           headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36 Edg/99.0.1150.55",
            "Accept-Language": "en-US,en;q=0.9,bg;q=0.8",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com",
            "X-Riot-Token": riotKey
           }
       });
       let data= await resp.json();
       res.send(data);
    }

module.exports = {
    showInfo,
    gameInfo,
    champInfo,
    rankInfo
};