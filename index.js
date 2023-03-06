import express from 'express'
import Stripe from 'stripe';
import * as dotenv from 'dotenv'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Home Page')
})

app.post('/payments', async (req, res) => {

    const product = await stripe.products.create({
        name: 'Test Product',
    });

    const price = await stripe.prices.create({
        unit_amount: 2500,
        currency: 'usd',
        product: product.id,
    });

    // const paymentMethod = await stripe.paymentMethods.create({
    //     type: 'card',
    //     card: {
    //         number: req.body.card.number,
    //         exp_month: req.body.card.exp_month,
    //         exp_year: req.body.card.exp_year,
    //         cvc: req.body.card.cvc,
    //     },
    // });

    // const paymentIntent = await stripe.paymentIntents.create({
    //     confirm: true,
    //     amount: req.body.items[0].price,
    //     currency: req.body.items[0].currency,
    //     automatic_payment_methods: {enabled: true},
    //     payment_method: paymentMethod.id,
    //     return_url: `${process.env.SERVER_URL}/payments/complete`
    // });

    const session = await stripe.checkout.sessions.create({
        success_url: `${process.env.SERVER_URL}/success`,
        line_items: [
            {price: price.id, quantity: 2},
        ],
        mode: 'payment',
    });
        res.send({ "url" : session.url});
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})