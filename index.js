import express from 'express'
import PaymentRouter from './payment/index.js';
const app = express()
const port = 3000

app.use(express.json());
app.use('/payment', PaymentRouter)


app.get('/', (req, res) => {
    res.send('Home Page')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})