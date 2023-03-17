const express = require('express')
const app = express()

const TradingView = require('@mathieuc/tradingview')

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
