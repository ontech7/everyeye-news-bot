const everyeye = require('everyeye-rss');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const bot = new Telegraf("YOUR_TOKEN");

console.log("Everyeye News Feed bot started!\n");

bot.use(session());
bot.start((ctx) => {
    console.log(ctx.from.username + " (" + ctx.from.id + ") started the bot");
    ctx.reply('Everyeye News Feed started!\n\nFor all commands, click on `Help`', Markup
    .keyboard([
        ['Pull news'],
        ['Autopull', 'Stop'],
        ['Help']
    ])
    .resize()
    .extra()
    );
});

bot.hears('Help', async function(ctx) {
    ctx.reply('/start - Start the bot\nPull news - Pull some news (default: 5)\nStop - Stop receiving news\nAutopull - Start receiving receiving news every fixed interval (default: 60 seconds)');
});
bot.hears('Pull news', async function(ctx) {
    console.log(ctx.from.username + " (" + ctx.from.id + ") is pulling the latest news");
    var result = await everyeye.rss(5);
    for(var i = result.titles.length - 1; i >= 0; i--) {
        ctx.reply(result.titles[i] + '\n\n' + result.descriptions[i] + '\n\n' + result.links[i] + '\n\n' + result.pubDates[i] + '\n\nScritto da: ' + result.creators[i]);
    }
});
bot.hears('Stop', async function(ctx) {
    console.log(ctx.from.username + " (" + ctx.from.id + ") stopped autopull");
    if(ctx.session.t_check != null) { 
        clearInterval(ctx.session.t_check);
        ctx.session.t_check = null;
    }
    ctx.reply("You won't receive any news until you click Autopull");
});
bot.hears('Autopull', async function(ctx) {
    console.log(ctx.from.username + " (" + ctx.from.id + ") started autopull to receive news");
    var result_new = await everyeye.rss(1);
    ctx.session.t_check = setInterval(rssCheck, 60000, result_new, ctx);
    ctx.reply("You are now receiving news.\nClick Stop if you want to stop autopull.");
});
bot.launch();

async function rssCheck(result_old, ctx) {
    var result_new = await everyeye.rss(1);
    if(result_old.pubDates[0] != result_new.pubDates[0]) {
        ctx.reply(result_new.titles[0] + '\n\n' + result_new.descriptions[0] + '\n\n' + result_new.links[0] + '\n\n' + result_new.pubDates[0] + '\n\nScritto da: ' + result_new.creators[0]);
        ctx.session.t_check = setInterval(rssCheck, 60000, result_new, ctx);
        clearInterval(this);
    }
}
