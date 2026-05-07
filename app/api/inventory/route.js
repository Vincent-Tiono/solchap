import { google } from "googleapis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const INVENTORY_RANGE = process.env.GOOGLE_SHEET_RANGE || "Inventory!A2:C";

const getRequiredEnv = (key) => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

const parseStock = (value) => {
    const normalizedValue = String(value ?? "").trim().replace(/,/g, "");

    if (!normalizedValue) {
        return null;
    }

    const stock = Number(normalizedValue);
    return Number.isFinite(stock) ? stock : null;
};

const normalizePrivateKey = (value) => {
    return value
        .trim()
        .replace(/^"/, "")
        .replace(/",?$/, "")
        .replace(/\\n/g, "\n");
};

const getSheetsClient = () => {
    const email = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const key = normalizePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY"));

    const auth = new google.auth.JWT({
        email,
        key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    return google.sheets({ version: "v4", auth });
};

export async function GET() {
    try {
        const sheets = getSheetsClient();

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: getRequiredEnv("GOOGLE_SHEET_ID"),
            range: INVENTORY_RANGE,
        });

        const products = (response.data.values || [])
            .filter(([productId]) => productId)
            .map(([productId, productName, stock]) => {
                const quantity = parseStock(stock);

                return {
                    productId,
                    productName: productName || "",
                    stock: quantity,
                    inStock: quantity === null ? null : quantity > 0,
                };
            });

        const inventory = Object.fromEntries(
            products.map((product) => [product.productId, product])
        );

        return Response.json(
            { products, inventory },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("Failed to load inventory from Google Sheets:", error);

        return Response.json(
            { error: "Unable to load inventory" },
            { status: 500 }
        );
    }
}
