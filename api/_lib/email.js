const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const FROM_ADDRESS = process.env.RESEND_FROM || 'Lavabow <shop@lavabow.fr>';
const CONTACT_EMAIL = 'shop@lavabow.fr';

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatEur(cents) {
  const amount = (Number(cents) || 0) / 100;
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function deliveryLabel(method) {
  return method === 'shipping' ? 'Livraison à domicile' : 'Remise en main propre';
}

function renderShippingAddressHtml(addr) {
  if (!addr || typeof addr !== 'object') return '';
  const parts = [];
  if (addr.line1) parts.push(escapeHtml(addr.line1));
  if (addr.line2) parts.push(escapeHtml(addr.line2));
  const cityLine = [addr.postal_code, addr.city].filter(Boolean).join(' ');
  if (cityLine) parts.push(escapeHtml(cityLine));
  if (addr.country) parts.push(escapeHtml(addr.country));
  if (parts.length === 0) return '';
  return `<p style="margin:8px 0 0 0;line-height:1.5;">${parts.join('<br>')}</p>`;
}

function renderEmailHtml({ orderId, items, deliveryMethod, shippingCostCents, subtotalCents, totalCents, shippingAddress }) {
  const itemsRows = items
    .map((it) => {
      const lineTotal = Number(it.price_cents_snapshot) * Number(it.quantity);
      return `<tr>
        <td style="padding:8px 0;">${escapeHtml(it.name_snapshot)} × ${escapeHtml(it.quantity)}</td>
        <td style="padding:8px 0;text-align:right;">${escapeHtml(formatEur(lineTotal))}</td>
      </tr>`;
    })
    .join('');

  const addressBlock = deliveryMethod === 'shipping'
    ? `<p style="margin:24px 0 0 0;font-weight:600;">Adresse de livraison</p>${renderShippingAddressHtml(shippingAddress)}`
    : '';

  return `<!doctype html>
<html lang="fr">
<body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 16px 0;">Merci pour votre commande !</h1>
  <p style="margin:0 0 16px 0;">Votre commande a bien été enregistrée. Voici le récapitulatif :</p>

  <p style="margin:16px 0 4px 0;"><strong>Numéro de commande :</strong> ${escapeHtml(orderId)}</p>

  <table style="width:100%;border-collapse:collapse;margin-top:16px;">
    <tbody>${itemsRows}</tbody>
    <tfoot>
      <tr>
        <td style="padding:8px 0;border-top:1px solid #ddd;">Sous-total</td>
        <td style="padding:8px 0;border-top:1px solid #ddd;text-align:right;">${escapeHtml(formatEur(subtotalCents))}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;">${escapeHtml(deliveryLabel(deliveryMethod))}</td>
        <td style="padding:8px 0;text-align:right;">${escapeHtml(formatEur(shippingCostCents))}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-top:2px solid #111;font-weight:700;">Total</td>
        <td style="padding:8px 0;border-top:2px solid #111;text-align:right;font-weight:700;">${escapeHtml(formatEur(totalCents))}</td>
      </tr>
    </tfoot>
  </table>

  ${addressBlock}

  <p style="margin:24px 0 0 0;color:#555;font-size:14px;">
    Une facture officielle vous est envoyée séparément par Stripe.
  </p>
  <p style="margin:16px 0 0 0;color:#555;font-size:14px;">
    Une question ? Écrivez-nous à <a href="mailto:${CONTACT_EMAIL}" style="color:#111;">${CONTACT_EMAIL}</a>.
  </p>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail({ supabase, orderId, toEmail }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('email: RESEND_API_KEY not configured; skipping send', { orderId });
    return { sent: false, reason: 'no_api_key' };
  }
  if (!toEmail) {
    console.error('email: missing recipient', { orderId });
    return { sent: false, reason: 'no_recipient' };
  }

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, delivery_method, shipping_cost_cents, subtotal_cents, total_cents, shipping_address')
    .eq('id', orderId)
    .maybeSingle();
  if (orderErr || !order) {
    console.error('email: order lookup failed', { orderId, error: orderErr });
    return { sent: false, reason: 'order_lookup_failed' };
  }

  const { data: items, error: itemsErr } = await supabase
    .from('order_items')
    .select('name_snapshot, price_cents_snapshot, quantity')
    .eq('order_id', orderId);
  if (itemsErr) {
    console.error('email: order_items lookup failed', { orderId, error: itemsErr });
    return { sent: false, reason: 'items_lookup_failed' };
  }

  const html = renderEmailHtml({
    orderId,
    items: items || [],
    deliveryMethod: order.delivery_method,
    shippingCostCents: order.shipping_cost_cents,
    subtotalCents: order.subtotal_cents,
    totalCents: order.total_cents,
    shippingAddress: order.shipping_address,
  });

  const shortId = String(orderId).slice(0, 8);
  const subject = `Confirmation de votre commande — #${shortId}`;

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [toEmail],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.error('email: Resend API error', { orderId, status: response.status, body: text });
    return { sent: false, reason: 'resend_error', status: response.status };
  }

  return { sent: true };
}
