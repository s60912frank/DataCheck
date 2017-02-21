const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs")
const bluebird = require('bluebird');
const readDir = bluebird.promisify(require("fs").readdir);
const TelegramBot = require('node-telegram-bot-api');

const token = '**********';
const gminID = '******';
let bot = new TelegramBot(token, {polling: false});
let checkInterval = 1000 * 60 * 10

let processors = []

async function Main() {
    try {
        await Init()

        while(true){
            let newMsg = await CheckLoop()
            newMsg.forEach((m) => {
                bot.sendMessage(gminID, m);
                console.log("NEW!");
            })
            console.log("LOOP COMPLETE!");
            await sleep(checkInterval)
        }
    }
    catch(e){
        bot.sendMessage(gminID, e.message);
        process.exit()
    }
}

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

async function Init() {
    let sources = await readDir('./dataSource')
    sources.forEach((s) => {
        let source = require('./dataSource/' + s)
        processors.push(new source())
    })
}

async function CheckLoop() {
    let newMsg = []
    for(let i = 0;i < processors.length;i++){
        let data = await processors[i].process()
        //console.log(data)
        newMsg = newMsg.concat(data)
    }
    return newMsg
}

Main()