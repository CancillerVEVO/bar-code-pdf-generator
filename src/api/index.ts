import express, { Request, Response } from "express";
import qrcode from "qrcode";
import ejs from "ejs";
import path from "path";
import logger from "./logger";
import { ProductRequest, validateProducts } from "./schema/request.schema";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const template = path.join(__dirname, "resources", "template.html");

async function generateQrCode(product: ProductRequest): Promise<string> {
  const productJson = JSON.stringify(product);
  const qrCode = await qrcode.toDataURL(productJson, {
    errorCorrectionLevel: "L",
  });

  return qrCode;
}

app.get("/", (req: Request, res: Response) => {
  res.send("I'm online!");
});

app.post("/qr", validateProducts, async (req: Request, res: Response) => {
  try {
    logger.info("/qr");
    const products: ProductRequest[] = req.body.products;

    for (const product of products) {
      const qrCode = await generateQrCode(product);
      product.qrCode = qrCode;
    }

    ejs.renderFile(template, { data: products }, async (err, html) => {
      if (err) {
        logger.error(err);
        res.status(500).send("Internal server error");
        return;
      }

      res.send(html);
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  logger.info("Server is running on port 3000");
});
