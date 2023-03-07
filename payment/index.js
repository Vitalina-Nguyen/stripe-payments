import { createPayment } from "./payment.controller.js";
import express from "express";

const router = express.Router()

router.post('/create', createPayment)

export default router;

