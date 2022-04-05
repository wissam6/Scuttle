const controller = require('./controller.js');

const router = require('express').Router();

router.get('/summoner/:summonerName', controller.showInfo);

router.get('/summonergame/:summonerId', controller.gameInfo);

router.get('/summonerChamp/:summonerId/:championId', controller.champInfo);

router.get('/summonerRank/:summonerId', controller.rankInfo);

module.exports = router;