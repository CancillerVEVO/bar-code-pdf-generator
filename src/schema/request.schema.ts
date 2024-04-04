import { z } from "zod";
import { NextFunction, Request, Response } from "express";

const ProductSchema = z.object({
  selling_session_product_id: z.number(),
  product_name: z.string(),
  price: z.number(),
  selling_session_id: z.number(),
  qrCode: z.string().optional(),
});

const RequestSchema = z.object({
  products: z.array(ProductSchema),
});

export type ProductRequest = z.infer<typeof ProductSchema>;

export const validateProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { products } = RequestSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};
