"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qrcode_1 = __importDefault(require("qrcode"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./logger"));
const request_schema_1 = require("./schema/request.schema");
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
        logger_1.default.info("/qr");
        const products = req.body.products;
        for (const product of products) {
            const qrCode = await generateQrCode(product);
            product.qrCode = qrCode;
        }
        ejs_1.default.renderFile(template, { data: products }, async (err, html) => {
            if (err) {
                logger_1.default.error(err);
                res.status(500).send("Internal server error");
                return;
            }
            res.send(html);
        });
    }
    catch (err) {
        logger_1.default.error(err);
        res.status(500).send("Internal server error");
    }
});
app.listen(3000, () => {
    logger_1.default.info("Server is running on port 3000");
});
