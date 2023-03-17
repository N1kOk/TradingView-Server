const express = require('express')
const app = express()

const TradingView = require('@mathieuc/tradingview');

// global.TW_DEBUG = true;

(async () => {
    // const sessionId = '8zsscssfyw28ktu0a4kvo8msku42obr7'
    //
    // const client = new TradingView.Client({
    //     token: sessionId,
    // })
    //
    // const chart = new client.Session.Chart()
    // // chart.setMarket('BINANCE:BTCEUR')
    //
    // chart.setMarket('BINANCE:BTCEUR', { // Set the market
    //     timeframe: 'D',
    // })
    //
    // chart.onError((...err) => { // Listen for errors (can avoid crash)
    //     console.error('Chart error:', ...err)
    //     // Do something...
    // })
    //
    // chart.onSymbolLoaded(() => { // When the symbol is successfully loaded
    //     console.log(`Market "${chart.infos.description}" loaded !`)
    // })
    //
    // chart.onUpdate(() => { // When price changes
    //     if (!chart.periods[0]) return
    //     console.log(`[${chart.infos.description}]: ${chart.periods[0].close} ${chart.infos.currency_id}`)
    //     // Do something...
    // })
    
    
    const client = new TradingView.Client()
    
    const chart = new client.Session.Chart()
    chart.setMarket('BINANCE:BTCEUR', {
        timeframe: '5',
        range: 10000,
    })
    
    TradingView.getIndicator('STD;Zig_Zag').then((indic) => {
        const STD = new chart.Study(indic)
        
        STD.onError((...err) => {
            console.log('Study error:', ...err)
        })
        
        STD.onReady(() => {
            console.log(`STD '${STD.instance.description}' Loaded!`)
        })
        
        STD.onUpdate(() => {
            console.log('Graphic data:', STD.graphic)
            // console.log('Tables:', changes, STD.graphic.tables);
            // console.log('Cells', STD.graphic.tables[0].cells());
            client.end()
        })
    })
    
    
    // const indicators = await TradingView.getPrivateIndicators(sessionId)
    // const indicators = await TradingView.searchIndicator(sessionId)
    
    // const indicator = new chart.Study(await indicators[0].get())
    
    // console.log(indicator)
    
    // indicator.onReady(() => {
    //     console.log('Indicator loaded!')
    // })
    //
    // indicator.onUpdate(() => {
    //     console.log('Plot values', indicator.periods)
    //     console.log('Strategy report', indicator.strategyReport)
    // })
})()


app.get('/get-session-id', async (req, res) => {
    const { login, pass } = req.query
    
    try {
        const { session } = await TradingView.loginUser(login, pass)
        
        res.json({ sessionId: session })
    } catch (error) {
        console.error(error)
        
        res.json({
            status: 'error',
            error: error.message || error,
        })
    }
})

app.get('/get-private-indicators', async (req, res) => {
    const { sessionId } = req.query
    
    try {
        const indicators = await TradingView.getPrivateIndicators(sessionId)
        
        const test = await indicators[0].get()
        // console.log(test.script)
        
        res.json(indicators)
    } catch (error) {
        console.error(error)
        
        res.json({
            status: 'error',
            error: error.message || error,
        })
    }
})

app.get('/search-indicator', async (req, res) => {
    const { indicator } = req.query
    
    try {
        const data = await TradingView.searchIndicator(indicator)
        // const test = await data[0].get() // Еще какие-то данные
        // console.log(test)
        
        res.json(data)
    } catch (error) {
        console.error(error)
        
        res.json({
            status: 'error',
            error: error.message || error,
        })
    }
})

const port = process.env.PORT || 80

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
