const express = require('express')
const app = express()

const TradingView = require('./vendors/tradingview')

app.get('/get-indicator-graphic', async (req, res) => {
    const { indicatorId, currency, timeframe, range } = req.query
    
    const client = new TradingView.Client()
    
    const chart = new client.Session.Chart()
    chart.setMarket(currency, {
        timeframe,
        range,
    })
    
    const indicator = await TradingView.getIndicator(indicatorId)
    
    const STD = new chart.Study(indicator)
    
    STD.onError((...err) => {
        console.error('Study error:', ...err)
        
        res.json({
            status: 'error',
            error: err[0],
        })
    })
    
    STD.onReady(() => {
        console.log(`STD '${STD.instance.description}' Loaded!`)
    })
    
    STD.onUpdate(() => {
        console.log('Graphic data:', STD.graphic)
        res.json(STD.graphic)
        
        client.end()
    })
})

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

process.on('uncaughtException', (err) => {
    console.error(err.stack)
})
