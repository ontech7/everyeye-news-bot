const everyeye = require('everyeye-rss');
const Telegraf = require('telegraf');
const events = require('events');

const bot = new Telegraf("YOUR_TOKEN");

console.log("Everyeye News Feed bot started!\n");

var em = new events.EventEmitter();
var t_check = null;

bot.start((ctx) => {
    console.log("A user started the bot");
    ctx.reply('Everyeye News Feed started!\n\nYou will start receiving news everytime the RSS feed updates as soon as you click on /news.\n\nFor all commands, click /help');
});
bot.command('help', async function(ctx) {
    ctx.reply('/start - Start the bot\n/news - Pull some news (default: 5)\n/stop - Stop receiving news every fixed time (default: 60 seconds)\n/continue - Continue receiving news');
});
bot.command('news', async function(ctx) {
    console.log("A user is pulling the latest news");
    var result = await everyeye.rss(5);
    for(var i = result.titles.length - 1; i >= 0; i--) {
        ctx.reply(result.titles[i] + '\n\n' + result.descriptions[i] + '\n\n' + result.links[i] + '\n\n' + result.pubDates[i] + '\n\nScritto da: ' + result.creators[i]);
    }
    t_check = setInterval(rssCheck, 60000, result, ctx);
    em.emit('interval', t_check);
});
bot.command('stop', async function(ctx) {
    console.log("A user stopped receiving news");
    clearInterval(t_check);
    ctx.reply("You won't receive any news until you write /continue");
});
bot.command('continue', async function(ctx) {
    console.log("A user continued to receive news");
    var result_new = await everyeye.rss(1);
    t_check = setInterval(rssCheck, 60000, result_new, ctx);
    em.emit('interval', t_check);
    ctx.reply("You are now receiving news");
});
bot.launch();

em.on('interval', async function(timerId) {
    t_check = timerId;
});

async function rssCheck(result_old, ctx) {
    var result_new = await everyeye.rss(1);
    if(result_old.pubDates[0] != result_new.pubDates[0]) {
        ctx.reply(result_new.titles[0] + '\n\n' + result_new.descriptions[0] + '\n\n' + result_new.links[0] + '\n\n' + result_new.pubDates[0] + '\n\nScritto da: ' + result_new.creators[0]);
        t_check = setInterval(rssCheck, 60000, result_new, ctx);
        em.emit('interval', t_check);
        clearInterval(this);
    }
}
