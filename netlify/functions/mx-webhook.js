// Receives MX Merchant notifications (PaymentSuccess / PaymentFail / RefundCreated / Chargeback).
// Subscribe once via the MX Checkout API:
//   PUT https://api.mxmerchant.com/checkout/v3/subscription
//   { "eventType":"PaymentSuccess", "merchantId":<id>, "sendWebhook":true, "sendEmail":false, "sendSMS":false,
//     "inviteUsers":"", "callbackUrl":"https://<site>/.netlify/functions/mx-webhook?key=<MX_WEBHOOK_KEY>", "sources":"Link2Pay" }
// The payload schema and signature scheme are not published on the pages we read, so this stores the raw
// body, checks the shared key in the query string, and relays a PAID notice to the kitchen inbox.
// Env: MX_WEBHOOK_KEY (required to accept), RESEND_API_KEY, ORDER_EMAIL_TO, ORDER_EMAIL_FROM.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "method-not-allowed" };
  const key = (event.queryStringParameters || {}).key;
  if (!process.env.MX_WEBHOOK_KEY || key !== process.env.MX_WEBHOOK_KEY) return { statusCode: 401, body: "unauthorized" };

  let payload = {}; try { payload = JSON.parse(event.body || "{}"); } catch { payload = { raw: event.body }; }
  const pick = (...keys) => { for (const k of keys) { const v = k.split(".").reduce((o, p) => (o && o[p] != null ? o[p] : undefined), payload); if (v != null) return v; } return undefined; };
  const eventType = pick("eventType", "type", "event") || "unknown";
  const amount = pick("amount", "payment.amount", "data.amount");
  const memo = pick("meta", "memo", "payment.meta", "data.memo") || "";
  const po = pick("PONumber", "poNumber", "purchaseOrder", "payment.PONumber") || "";
  const status = pick("status", "payment.status") || "";
  const orderNo = (String(po || memo).match(/Z-\d{6}-[A-Z0-9]{4}/) || [])[0] || "(no order number in payload)";

  console.log(JSON.stringify({ eventType, status, amount, orderNo, receivedAt: new Date().toISOString() }));
  console.log(event.body);

  if (process.env.RESEND_API_KEY && process.env.ORDER_EMAIL_TO) {
    const subject = `${eventType === "PaymentSuccess" ? "PAID" : eventType.toUpperCase()} · ${orderNo}${amount ? " · $" + amount : ""}`;
    const text = `MX Merchant notification\n\nEvent: ${eventType}\nStatus: ${status}\nAmount: ${amount}\nOrder: ${orderNo}\nMemo: ${memo}\n\nRaw payload:\n${event.body}`;
    try {
      await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.ORDER_EMAIL_FROM || "Zamani Orders <onboarding@resend.dev>", to: process.env.ORDER_EMAIL_TO.split(",").map(s => s.trim()), subject, text }) });
    } catch (e) { console.error("resend-failed", e); }
  }
  return { statusCode: 200, body: "ok" };
};
