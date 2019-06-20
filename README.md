# everyeye-news-bot
A Telegram bot for reading https://www.everyeye.it news

## Installation

Clone the repo where you want

```bash
git clone https://github.com/ontech7/everyeye-news-bot.git
```

Install all the needed packages (N.B.: It will also install [ontech7/everyeye-rss](https://github.com/ontech7/everyeye-rss))

```bash
npm install
```

Run it from the entry point

```bash
node index.js 
```

## Usage

First of all, you need to copy&paste your bot token inside YOUR_TOKEN.

`
/start - Start the bot
`
<br/>
`
/news - Pull some news (default: 5)
`
<br/>
`
/stop - Stop pulling news every fixed time (default: 60 seconds)
`
<br/>
`
/continue - Continue receiving news
`
<br/>
`
/help - Well, you know what it means
`
