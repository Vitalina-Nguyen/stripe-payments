import Stripe from 'stripe';
import * as dotenv from 'dotenv'
import {products} from "../products.js";

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {

    const allProducts = req.body.items.map( (item) => {
        const product = products.find( (element) => {
            if (element.id === item.id) return element
        })
        return {
            price_data: {
                currency: product.price.currency,
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price.unit_amount
            },
            quantity: item.quantity,
        }
    })

    const session = await stripe.checkout.sessions.create({
        success_url: `${process.env.SERVER_URL}/success`,
        line_items: allProducts,
        mode: 'payment',
    });
    res.redirect(303, session.url);

}
