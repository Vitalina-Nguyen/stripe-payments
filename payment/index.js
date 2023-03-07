import {cancelPayment, createPayment, getAllPayments, updatePayment, webhook} from "./payment.controller.js";
import express from "express";

const router = express.Router()

router.post('/create', createPayment)
router.get('/get', getAllPayments)
router.post('/:id/cancel', cancelPayment)
router.post('/:id/update', updatePayment)
router.post('/webhook', express.raw({type: 'application/json'}), webhook)
export default router;

