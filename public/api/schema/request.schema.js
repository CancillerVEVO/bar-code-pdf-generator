"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProducts = void 0;
const zod_1 = require("zod");
const ProductSchema = zod_1.z.object({
    selling_session_product_id: zod_1.z.number(),
    product_name: zod_1.z.string(),
    price: zod_1.z.number(),
    selling_session_id: zod_1.z.number(),
    qrCode: zod_1.z.string().optional(),
});
const RequestSchema = zod_1.z.object({
    products: zod_1.z.array(ProductSchema),
});
const validateProducts = (req, res, next) => {
    try {
        const { products } = RequestSchema.parse(req.body);
        next();
    }
    catch (error) {
        res.status(400).json({ error: error.errors });
    }
};
exports.validateProducts = validateProducts;
