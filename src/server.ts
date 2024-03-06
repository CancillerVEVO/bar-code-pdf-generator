import express from "express";
import qrcode from "qrcode";
import ejs from "ejs";
import path from "path";

const app = express();

const template = path.join(__dirname, "resources", "template.html");

type Product = {
  selling_session_proudct_id: number;
  product_name: string;
  price: number;
  qrCode?: string;
};

const mockData: Product[] = [
  {
    selling_session_proudct_id: 1,
    product_name: "Naranja",
    price: 10,
  },
  {
    selling_session_proudct_id: 2,
    product_name: "Naranja",
    price: 10,
  },
  {
    selling_session_proudct_id: 3,
    product_name: "Naranja",
    price: 10,
  },
  {
    selling_session_proudct_id: 4,
    product_name: "Naranja",
    price: 10,
  },
  {
    selling_session_proudct_id: 5,
    product_name: "Manzana",
    price: 10,
  },
  {
    selling_session_proudct_id: 6,
    product_name: "Manzana",
    price: 10,
  },
];

const generateQRCode = async (
  product: Product
): Promise<string | undefined> => {
  try {
    const productJson = JSON.stringify(product);
    // Esto regresa un B64
    const qrDataUri = await qrcode.toDataURL(productJson, {
      errorCorrectionLevel: "H",
    });

    return qrDataUri;
  } catch (err) {
    console.log(err);
  }
};

app.get("/", async (req, res) => {
  const data = mockData;

  for (const product of data) {
    const qrCode = await generateQRCode(product);
    product.qrCode = qrCode;
  }

  ejs.renderFile(template, {data}, (err, html) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(html);
  })
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
