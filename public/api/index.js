"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qrcode_1 = __importDefault(require("qrcode"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const request_schema_1 = require("./schema/request.schema");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
const template = path_1.default.join(__dirname, "resources", "template.html");
async function generateQrCode(product) {
    const productJson = JSON.stringify(product);
    const qrCode = await qrcode_1.default.toDataURL(productJson, {
        errorCorrectionLevel: "L",
    });
    return qrCode;
}
app.get("/", (req, res) => {
    res.send("I'm online!");
});
app.post("/qr", request_schema_1.validateProducts, async (req, res) => {
    try {
        console.log("/qr");
        const products = req.body.products;
        for (const product of products) {
            const qrCode = await generateQrCode(product);
            product.qrCode = qrCode;
        }
        ejs_1.default.renderFile(template, { data: products }, async (err, html) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal server error");
                return;
            }
            res.send(html);
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
