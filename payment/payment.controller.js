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
    res.send( { url: session.url })
    // res.redirect(303, session.url);
}

export const getAllPayments = async ( req, res ) => {

    const paymentIntents = await stripe.paymentIntents.list({
        limit: 100,
    });
    res.send(paymentIntents);
}

// Cancel for payments if it's not succeeded or process
export const cancelPayment = async ( req, res ) => {

    const paymentToCancel = await stripe.paymentIntents.cancel(
        req.body.id
    );
    res.send(paymentToCancel);
}

// Update for payments with
// ( requires_payment_method, requires_capture, requires_confirmation, requires_action, processing)
// statuses
export const updatePayment = async ( req, res ) => {

    const paymentIntent = await stripe.paymentIntents.update(
        req.body.id,
        req.body.params
    );
    res.send(paymentIntent);
}

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_88d60bcc420c5e103d627da8ca25852418f1fbda44bf63a92b19c81332546716'
export const webhook = async ( request, response ) => {
    console.log('11111111111111111111111')

    const sig = request.headers['stripe-signature'];

    let event;

    try {
        console.log(event);
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            console.log('Payments were made successfully!')
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
}

