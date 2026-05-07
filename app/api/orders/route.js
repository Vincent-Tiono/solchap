import { google } from "googleapis";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ORDER_SHEET_NAMES = {
    delivery: "Orders-Delivery",
    selfPickup: "Orders-Self-pickup",
};
const INVENTORY_SHEET_NAME = "Inventory";
const PAYMENT_PROOF_MAX_SIZE_BYTES = 3 * 1024 * 1024;
const PAYMENT_PROOF_MAX_SIZE_LABEL = "3 MB";
const ORDER_HEADERS = [
    "Product Name",
    "Quantity",
    "Total Price",
    "Name",
    "Contact WhatsApp or Line ID",
    "Email",
    "Address",
    "Payment Proof",
    "Submitted At",
];
const DELIVERY_ORDER_HEADERS = [
    "Product Name",
    "Quantity",
    "Total Price",
    "Name",
    "Contact WhatsApp or Line ID",
    "Email",
    "City",
    "Address",
    "Payment Proof",
    "Submitted At",
];

const getOrdersSheetName = (shippingMethod) => {
    const normalizedShippingMethod = String(shippingMethod || "").trim().toLowerCase();

    if (["self pick-up", "self pickup", "self-pickup"].includes(normalizedShippingMethod)) {
        return ORDER_SHEET_NAMES.selfPickup;
    }

    return ORDER_SHEET_NAMES.delivery;
};

const getSheetRange = (sheetName, range) => {
    const escapedSheetName = String(sheetName).replace(/'/g, "''");

    return `'${escapedSheetName}'!${range}`;
};

const getOrderHeaders = (sheetName) => {
    return sheetName === ORDER_SHEET_NAMES.delivery ? DELIVERY_ORDER_HEADERS : ORDER_HEADERS;
};

const getColumnLetter = (columnNumber) => {
    let column = "";
    let current = columnNumber;

    while (current > 0) {
        const remainder = (current - 1) % 26;
        column = String.fromCharCode(65 + remainder) + column;
        current = Math.floor((current - 1) / 26);
    }

    return column;
};

const normalizeHeader = (value) => {
    return String(value || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
};

const normalizeLookupValue = (value) => {
    return String(value || "").trim().toLowerCase();
};

const parseStock = (value) => {
    const stock = Number(String(value ?? "").replace(/,/g, ""));

    return Number.isFinite(stock) ? stock : null;
};

const getSubmittedAtWib = () => {
    const formatter = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return `${formatter.format(new Date())} WIB`;
};

const getRequiredEnv = (key) => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

const normalizePrivateKey = (value) => {
    return value
        .trim()
        .replace(/^"/, "")
        .replace(/",?$/, "")
        .replace(/\\n/g, "\n");
};

const getOptionalEnv = (key) => {
    const value = process.env[key];

    return value ? value.trim() : "";
};

const escapeHtml = (value) => {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const formatOrderAmount = (amount, currency = "IDR") => {
    const numericAmount = Number(amount);
    const cleanCurrency = String(currency || "IDR").trim();

    if (!Number.isFinite(numericAmount)) {
        return `${cleanCurrency} ${String(amount || "").trim()}`;
    }

    return `${cleanCurrency} ${numericAmount.toLocaleString("en-US")}`;
};

const getOrderEmailItems = (items) => {
    return Array.isArray(items)
        ? items
            .map((item) => ({
                name: String(item?.name || "Product").trim(),
                quantity: Number(item?.quantity || 0),
                price: Number(item?.price),
            }))
            .filter((item) => item.name && Number.isFinite(item.quantity) && item.quantity > 0)
        : [];
};

let emailLogoDataUri;

const getEmailLogoDataUri = () => {
    if (emailLogoDataUri !== undefined) {
        return emailLogoDataUri;
    }

    try {
        const logo = readFileSync(join(process.cwd(), "assets", "logo.png"));
        emailLogoDataUri = `data:image/jpeg;base64,${logo.toString("base64")}`;
    } catch (error) {
        console.warn("Unable to load email logo:", error);
        emailLogoDataUri = "";
    }

    return emailLogoDataUri;
};

const buildOrderConfirmationEmail = (order) => {
    const items = getOrderEmailItems(order.items);
    const logoDataUri = getEmailLogoDataUri();
    const currency = String(order.currency || "IDR").trim();
    const totalLabel = formatOrderAmount(order.totalPrice, currency);
    const deliveryFee = Number(order.deliveryFee || 0);
    const deliveryFeeLabel = deliveryFee > 0 ? formatOrderAmount(deliveryFee, currency) : "To be confirmed";
    const shippingMethod = String(order.shippingMethod || "").trim();
    const customerName = String(order.customerName || "").trim();
    const greeting = customerName ? `Hi ${customerName}!` : "Hi!";
    const isSelfPickup = shippingMethod.toLowerCase() === "self pick-up";
    const destination = isSelfPickup
        ? `Self Pick-up: ${String(order.pickupCity || "").trim()}`
        : [order.deliveryCity, order.address].filter(Boolean).join(" - ");
    const contactType = String(order.contactType || "").trim().toLowerCase();
    const whatsappNumber = [
        order.whatsappCountryCode,
        order.whatsappNumber,
    ].map((value) => String(value || "").trim()).filter(Boolean).join(" ") || String(order.contact || "").trim();
    const lineId = String(order.lineId || order.contact || "").trim();
    const contactLabel = contactType.includes("line") ? "Line ID" : "Whatsapp Number";
    const contactValue = contactType.includes("line") ? lineId : whatsappNumber;
    const contactLine = contactValue ? `${contactLabel}: ${contactValue}` : "";
    const itemLines = items.map((item) => {
        const itemPrice = Number.isFinite(item.price) ? ` - ${formatOrderAmount(item.price, currency)} each` : "";

        return `${item.name} x ${item.quantity}${itemPrice}`;
    });
    const htmlItemRows = items.map((item) => {
        const itemPrice = Number.isFinite(item.price) ? formatOrderAmount(item.price, currency) : "";

        return `
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(item.name)}</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: center;">${escapeHtml(item.quantity)}</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${escapeHtml(itemPrice || "-")}</td>
            </tr>
        `;
    }).join("");

    const text = [
        greeting,
        "",
        "We have received your order and payment proof.",
        "",
        "Order summary:",
        ...itemLines.map((line) => `- ${line}`),
        "",
        `Total: ${totalLabel}`,
        deliveryFee > 0 ? `Delivery fee: ${deliveryFeeLabel}` : null,
        shippingMethod ? `Shipping method: ${shippingMethod}` : null,
        destination ? `Destination: ${destination}` : null,
        contactLine || null,
        "",
        "Our team will contact you with delivery or pick-up details. The receipt will be sent to you after we confirm the order.",
        "",
        "Solar Chapter",
    ].filter((line) => line !== null && line !== undefined).join("\n");

    const html = `
        <div style="margin: 0; padding: 0; background: #f8fafc; font-family: Arial, sans-serif; color: #334155;">
            <div style="max-width: 620px; margin: 0 auto; padding: 32px 20px;">
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px;">
                    <h1 style="margin: 0 0 12px; color: #0f172a; font-size: 24px; line-height: 1.3;">${escapeHtml(greeting)}</h1>
                    <p style="margin: 0 0 24px; line-height: 1.6;">We have received your order and payment proof. Our team will contact you with the delivery or pick-up details. The receipt will be sent after your order is confirmed.</p>

                    <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 18px;">Order Summary</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="padding: 0 0 10px; border-bottom: 1px solid #cbd5e1; text-align: left; color: #475569;">Product</th>
                                <th style="padding: 0 0 10px; border-bottom: 1px solid #cbd5e1; text-align: center; color: #475569;">Qty</th>
                                <th style="padding: 0 0 10px; border-bottom: 1px solid #cbd5e1; text-align: right; color: #475569;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmlItemRows}
                        </tbody>
                    </table>

                    <p style="margin: 0 0 8px;"><strong>Total:</strong> ${escapeHtml(totalLabel)}</p>
                    ${deliveryFee > 0 ? `<p style="margin: 0 0 8px;"><strong>Delivery fee:</strong> ${escapeHtml(deliveryFeeLabel)}</p>` : ""}
                    ${shippingMethod ? `<p style="margin: 0 0 8px;"><strong>Shipping method:</strong> ${escapeHtml(shippingMethod)}</p>` : ""}
                    ${destination ? `<p style="margin: 0 0 8px;"><strong>Destination:</strong> ${escapeHtml(destination)}</p>` : ""}
                    ${contactValue ? `<p style="margin: 0 0 8px;"><strong>${escapeHtml(contactLabel)}:</strong> ${escapeHtml(contactValue)}</p>` : ""}

                    <p style="margin: 24px 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">If any details are incorrect, please reply to this email.</p>
                    ${logoDataUri ? `
                        <div style="margin-top: 24px; text-align: left;">
                            <img src="${logoDataUri}" alt="Solar Chapter" width="120" style="display: block; width: 120px; height: auto; border: 0;" />
                        </div>
                    ` : ""}
                </div>
            </div>
        </div>
    `;

    return {
        subject: "Solar Chapter Order Confirmation",
        html,
        text,
    };
};

const sanitizeEmailHeader = (value) => {
    return String(value || "").replace(/[\r\n]+/g, " ").trim();
};

const formatEmailAddress = ({ email, name }) => {
    const cleanEmail = sanitizeEmailHeader(email);
    const cleanName = sanitizeEmailHeader(name).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    return cleanName ? `"${cleanName}" <${cleanEmail}>` : cleanEmail;
};

const toBase64Url = (value) => {
    return Buffer.from(value, "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
};

const createGmailRawMessage = ({ from, to, subject, html, text }) => {
    const boundary = `solchap_order_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const message = [
        `From: ${from}`,
        `To: ${sanitizeEmailHeader(to)}`,
        `Subject: ${sanitizeEmailHeader(subject)}`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        "Content-Transfer-Encoding: 8bit",
        "",
        text,
        "",
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        "Content-Transfer-Encoding: 8bit",
        "",
        html,
        "",
        `--${boundary}--`,
        "",
    ].join("\r\n");

    return toBase64Url(message);
};

const getGmailAuth = () => {
    const auth = new google.auth.OAuth2(
        getOptionalEnv("GOOGLE_OAUTH_CLIENT_ID"),
        getOptionalEnv("GOOGLE_OAUTH_CLIENT_SECRET")
    );

    auth.setCredentials({
        refresh_token: getOptionalEnv("GOOGLE_OAUTH_REFRESH_TOKEN"),
    });

    return auth;
};

const sendOrderConfirmationEmail = async ({ order }) => {
    const clientId = getOptionalEnv("GOOGLE_OAUTH_CLIENT_ID");
    const clientSecret = getOptionalEnv("GOOGLE_OAUTH_CLIENT_SECRET");
    const refreshToken = getOptionalEnv("GOOGLE_OAUTH_REFRESH_TOKEN");
    const senderEmail = getOptionalEnv("GMAIL_SENDER_EMAIL");
    const senderName = getOptionalEnv("GMAIL_FROM_NAME") || "Solar Chapter";
    const to = String(order.email || "").trim();

    if (!clientId || !clientSecret || !refreshToken || !senderEmail) {
        console.warn("Skipping order confirmation email: missing Gmail API configuration.");
        return { sent: false, skipped: true };
    }

    if (!to) {
        console.warn("Skipping order confirmation email: order has no recipient email.");
        return { sent: false, skipped: true };
    }

    const email = buildOrderConfirmationEmail(order);
    const gmail = google.gmail({ version: "v1", auth: getGmailAuth() });
    const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: createGmailRawMessage({
                from: formatEmailAddress({ email: senderEmail, name: senderName }),
                to,
                subject: email.subject,
                html: email.html,
                text: email.text,
            }),
        },
    });

    return { sent: true, messageId: response.data.id };
};

const getSheetsAuth = () => {
    const email = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const key = normalizePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY"));

    return new google.auth.JWT({
        email,
        key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
};

const getSheetsClient = (auth) => {
    return google.sheets({ version: "v4", auth });
};

const getOAuthDriveClient = () => {
    const auth = new google.auth.OAuth2(
        getRequiredEnv("GOOGLE_OAUTH_CLIENT_ID"),
        getRequiredEnv("GOOGLE_OAUTH_CLIENT_SECRET")
    );

    auth.setCredentials({
        refresh_token: getRequiredEnv("GOOGLE_OAUTH_REFRESH_TOKEN"),
    });

    return google.drive({ version: "v3", auth });
};

const parseRequestBody = async (request) => {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
        return {
            order: await request.json(),
            paymentProof: null,
        };
    }

    const formData = await request.formData();
    const orderValue = formData.get("order");
    const paymentProof = formData.get("paymentProof");

    if (!orderValue) {
        throw new Error("Missing order details.");
    }

    return {
        order: JSON.parse(String(orderValue)),
        paymentProof,
    };
};

const getOrderRows = ({
    items,
    totalPrice,
    currency,
    shippingMethod,
    deliveryArea,
    deliveryCity,
    pickupCity,
    customerName,
    contactType,
    contact,
    email,
    address,
    paymentProofUrl,
}) => {
    const cleanItems = Array.isArray(items)
        ? items
            .map((item) => ({
                productId: String(item?.productId || "").trim(),
                name: String(item?.name || "").trim(),
                quantity: Number(item?.quantity || 0),
            }))
            .filter((item) => item.name && Number.isFinite(item.quantity) && item.quantity > 0)
        : [];

    const cleanTotalPrice = Number(totalPrice);
    const cleanCurrency = String(currency || "IDR").trim();
    const cleanShippingMethod = String(shippingMethod || "").trim();
    const cleanDeliveryArea = String(deliveryArea || "").trim();
    const cleanDeliveryCity = String(deliveryCity || "").trim();
    const cleanPickupCity = String(pickupCity || "").trim();
    const cleanCustomerName = String(customerName || "").trim();
    const cleanContact = String(contact || "").trim();
    const cleanContactType = String(contactType || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanAddress = String(address || "").trim();
    const cleanPaymentProofUrl = String(paymentProofUrl || "").trim();
    const isSelfPickup = cleanShippingMethod.toLowerCase() === "self pick-up";
    const submittedAt = getSubmittedAtWib();

    if (cleanItems.length === 0) {
        throw new Error("Order must include at least one product.");
    }

    if (!Number.isFinite(cleanTotalPrice) || cleanTotalPrice <= 0) {
        throw new Error("Order total must be greater than zero.");
    }

    if (!cleanCustomerName || !cleanContact || !cleanEmail) {
        throw new Error("Name, contact, and email are required.");
    }

    if (!cleanShippingMethod && !cleanAddress) {
        throw new Error("Address is required.");
    }

    if (cleanShippingMethod && !isSelfPickup && (!cleanDeliveryCity || !cleanAddress)) {
        throw new Error("Delivery city and address are required.");
    }

    if (isSelfPickup && !cleanPickupCity) {
        throw new Error("Pick-up city is required.");
    }

    const contactLabel = cleanContactType
        ? `${cleanContactType}: ${cleanContact}`
        : cleanContact;
    const addressLabel = isSelfPickup
        ? `Self Pick-up: ${cleanPickupCity}`
        : cleanAddress;
    const totalPriceLabel = `${cleanCurrency} ${cleanTotalPrice.toLocaleString("en-US")}`;
    const cityLabel = cleanDeliveryArea === "Others"
        ? `Others - ${cleanDeliveryCity}`
        : cleanDeliveryCity;

    if (!isSelfPickup) {
        return cleanItems.map((item) => [
            item.name,
            item.quantity,
            totalPriceLabel,
            cleanCustomerName,
            contactLabel,
            cleanEmail,
            cityLabel,
            addressLabel,
            cleanPaymentProofUrl,
            submittedAt,
        ]);
    }

    return cleanItems.map((item) => [
        item.name,
        item.quantity,
        totalPriceLabel,
        cleanCustomerName,
        contactLabel,
        cleanEmail,
        addressLabel,
        cleanPaymentProofUrl,
        submittedAt,
    ]);
};

const getHeaderIndex = (headers, names, fallbackIndex) => {
    const normalizedNames = names.map(normalizeHeader);
    const index = headers.findIndex((header) => normalizedNames.includes(normalizeHeader(header)));

    return index >= 0 ? index : fallbackIndex;
};

const getOrderedInventoryItems = (items) => {
    const orderedItems = Array.isArray(items)
        ? items
            .map((item) => ({
                productId: String(item?.productId || "").trim(),
                name: String(item?.name || "").trim(),
                quantity: Number(item?.quantity || 0),
            }))
            .filter((item) => (item.productId || item.name) && Number.isFinite(item.quantity) && item.quantity > 0)
        : [];
    const groupedItems = new Map();

    for (const item of orderedItems) {
        const key = item.productId ? `id:${item.productId}` : `name:${normalizeLookupValue(item.name)}`;
        const existingItem = groupedItems.get(key);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            groupedItems.set(key, { ...item });
        }
    }

    return [...groupedItems.values()];
};

const updateInventoryStock = async (sheets, spreadsheetId, items) => {
    const orderedItems = getOrderedInventoryItems(items);

    if (orderedItems.length === 0) {
        return;
    }

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: getSheetRange(INVENTORY_SHEET_NAME, "A:Z"),
    });
    const rows = response.data.values || [];
    const headers = rows[0] || [];
    const productIdColumnIndex = getHeaderIndex(headers, ["product id", "productId", "id"], 0);
    const productNameColumnIndex = getHeaderIndex(headers, ["product name", "productName", "name", "product"], 1);
    const stockColumnIndex = getHeaderIndex(headers, ["stock"], 2);

    if (stockColumnIndex < 0) {
        throw new Error('Inventory sheet must include a "stock" column.');
    }

    const dataRows = rows.slice(1);
    const rowByProductId = new Map();
    const rowByProductName = new Map();

    dataRows.forEach((row, index) => {
        const sheetRowNumber = index + 2;
        const productId = normalizeLookupValue(row[productIdColumnIndex]);
        const productName = normalizeLookupValue(row[productNameColumnIndex]);

        if (productId && !rowByProductId.has(productId)) {
            rowByProductId.set(productId, { row, sheetRowNumber });
        }

        if (productName && !rowByProductName.has(productName)) {
            rowByProductName.set(productName, { row, sheetRowNumber });
        }
    });

    const updates = [];

    for (const item of orderedItems) {
        const inventoryRow = item.productId
            ? rowByProductId.get(normalizeLookupValue(item.productId))
            : rowByProductName.get(normalizeLookupValue(item.name));
        const matchedInventoryRow = inventoryRow || rowByProductName.get(normalizeLookupValue(item.name));

        if (!matchedInventoryRow) {
            throw new Error(`Inventory row not found for ${item.name || item.productId}.`);
        }

        const currentStock = parseStock(matchedInventoryRow.row[stockColumnIndex]);

        if (currentStock === null) {
            throw new Error(`Invalid stock value for ${item.name || item.productId}.`);
        }

        const nextStock = currentStock - item.quantity;

        if (nextStock < 0) {
            throw new Error(`Insufficient stock for ${item.name || item.productId}.`);
        }

        updates.push({
            range: getSheetRange(INVENTORY_SHEET_NAME, `${getColumnLetter(stockColumnIndex + 1)}${matchedInventoryRow.sheetRowNumber}`),
            values: [[nextStock]],
        });
    }

    if (updates.length === 0) {
        return;
    }

    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
            valueInputOption: "USER_ENTERED",
            data: updates,
        },
    });
};

const ensureOrdersSheet = async (sheets, spreadsheetId, sheetName) => {
    const response = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: "sheets.properties.title",
    });
    const sheetExists = response.data.sheets?.some((sheet) => sheet.properties?.title === sheetName);

    if (sheetExists) {
        return;
    }

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: sheetName,
                        },
                    },
                },
            ],
        },
    });
};

const ensureOrdersHeader = async (sheets, spreadsheetId, sheetName) => {
    await ensureOrdersSheet(sheets, spreadsheetId, sheetName);

    const orderHeaders = getOrderHeaders(sheetName);
    const endColumn = getColumnLetter(orderHeaders.length);
    const headerRange = getSheetRange(sheetName, `A1:${endColumn}1`);
    const staleHeaderRange = getSheetRange(sheetName, `${getColumnLetter(orderHeaders.length + 1)}1:U1`);

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: headerRange,
    });

    const existingHeaders = response.data.values?.[0] || [];
    const hasHeaders = existingHeaders.some((header) => String(header || "").trim());

    if (hasHeaders) {
        const headersMatch = orderHeaders.every((header, index) => String(existingHeaders[index] || "").trim() === header);

        if (!headersMatch || existingHeaders.length < orderHeaders.length) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: headerRange,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [orderHeaders],
                },
            });
        }

        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: staleHeaderRange,
        });

        return;
    }

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: headerRange,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [orderHeaders],
        },
    });
};

const uploadPaymentProof = async (drive, paymentProof) => {
    if (!paymentProof || typeof paymentProof.arrayBuffer !== "function") {
        throw new Error("Payment proof image is required.");
    }

    if (!paymentProof.type?.startsWith("image/")) {
        throw new Error("Payment proof must be an image file.");
    }

    if (paymentProof.size > PAYMENT_PROOF_MAX_SIZE_BYTES) {
        throw new Error(`Payment proof must be ${PAYMENT_PROOF_MAX_SIZE_LABEL} or smaller. Please upload your payment proof again.`);
    }

    const buffer = Buffer.from(await paymentProof.arrayBuffer());
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeFileName = String(paymentProof.name || "payment-proof")
        .replace(/[^\w.\-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const fileMetadata = {
        name: `${timestamp}-${safeFileName || "payment-proof"}`,
    };

    if (process.env.GOOGLE_ORDER_PROOFS_FOLDER_ID) {
        fileMetadata.parents = [process.env.GOOGLE_ORDER_PROOFS_FOLDER_ID];
    }

    const response = await drive.files.create({
        requestBody: fileMetadata,
        media: {
            mimeType: paymentProof.type,
            body: Readable.from([buffer]),
        },
        fields: "id, webViewLink",
        supportsAllDrives: true,
    });

    const fileId = response.data.id;

    if (!fileId) {
        throw new Error("Google Drive did not return a file ID.");
    }

    try {
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
            supportsAllDrives: true,
        });
    } catch (error) {
        console.error("Failed to make payment proof publicly readable:", error);
    }

    const linkResponse = await drive.files.get({
        fileId,
        fields: "webViewLink",
        supportsAllDrives: true,
    });

    return linkResponse.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
};

export async function POST(request) {
    try {
        const { order, paymentProof } = await parseRequestBody(request);
        const sheetsAuth = getSheetsAuth();
        const sheets = getSheetsClient(sheetsAuth);
        const drive = getOAuthDriveClient();
        const spreadsheetId = getRequiredEnv("GOOGLE_SHEET_ID");
        const paymentProofUrl = await uploadPaymentProof(drive, paymentProof);
        const sheetName = getOrdersSheetName(order.shippingMethod);
        const rows = getOrderRows({
            ...order,
            paymentProofUrl,
        });
        const appendRange = sheetName === ORDER_SHEET_NAMES.delivery ? "A:J" : "A:I";

        await ensureOrdersHeader(sheets, spreadsheetId, sheetName);

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: getSheetRange(sheetName, appendRange),
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
                values: rows,
            },
        });

        await updateInventoryStock(sheets, spreadsheetId, order.items);

        let emailSent = false;

        try {
            const emailResult = await sendOrderConfirmationEmail({ order });
            emailSent = Boolean(emailResult.sent);
        } catch (error) {
            console.error("Failed to send order confirmation email:", error);
        }

        return Response.json({ success: true, rows: rows.length, emailSent });
    } catch (error) {
        console.error("Failed to save order to Google Sheets:", error);

        return Response.json(
            { error: error.message || "Unable to save order" },
            { status: 500 }
        );
    }
}
