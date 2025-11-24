import { ENV } from "./_core/env";

/**
 * Email service using n8n webhook for sending notifications
 * 
 * This service sends emails through the configured n8n chatbot webhook.
 * The webhook should be configured to handle email sending operations.
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: "pickup" | "delivery";
  deliveryDate: Date;
  deliveryTime: string;
  deliveryAddress?: string;
  language: string;
}

export interface ReservationConfirmationData {
  reservationId: number;
  customerName: string;
  customerEmail: string;
  eventType: string;
  eventDate: Date;
  eventTime: string;
  guestCount: number;
  venue?: string;
  specialRequirements?: string;
  dietaryRestrictions?: string;
  language: string;
}

/**
 * Send an email using the n8n webhook
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const webhookUrl = ENV.n8nChatbotWebhookUrl;
  
  if (!webhookUrl) {
    console.warn("[Email Service] N8N webhook URL not configured. Email not sent.");
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "send_email",
        email: {
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
        },
      }),
    });

    if (!response.ok) {
      console.error("[Email Service] Failed to send email:", response.statusText);
      return false;
    }

    console.log(`[Email Service] Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error("[Email Service] Error sending email:", error);
    return false;
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
  const isEnglish = data.language === "en";
  
  const subject = isEnglish
    ? `Order Confirmation #${data.orderNumber} - Les Touillés`
    : `Confirmation de commande #${data.orderNumber} - Les Touillés`;

  const html = generateOrderConfirmationHTML(data, isEnglish);

  return sendEmail({
    to: data.customerEmail,
    subject,
    html,
  });
}

/**
 * Send reservation confirmation email
 */
export async function sendReservationConfirmation(data: ReservationConfirmationData): Promise<boolean> {
  const isEnglish = data.language === "en";
  
  const subject = isEnglish
    ? `Reservation Confirmation #${data.reservationId} - Les Touillés`
    : `Confirmation de réservation #${data.reservationId} - Les Touillés`;

  const html = generateReservationConfirmationHTML(data, isEnglish);

  return sendEmail({
    to: data.customerEmail,
    subject,
    html,
  });
}

/**
 * Generate HTML for order confirmation email
 */
function generateOrderConfirmationHTML(data: OrderConfirmationData, isEnglish: boolean): string {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (date: Date) => date.toLocaleDateString(isEnglish ? "en-CA" : "fr-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const deliveryMethodText = data.deliveryMethod === "pickup"
    ? (isEnglish ? "Pickup" : "Ramassage")
    : (isEnglish ? "Delivery" : "Livraison");

  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.price)}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="${isEnglish ? 'en' : 'fr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEnglish ? 'Order Confirmation' : 'Confirmation de commande'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Les Touillés</h1>
      <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 16px;">${isEnglish ? 'Catering & Gourmet Meals' : 'Traiteur & Repas Gourmands'}</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 20px;">
      <h2 style="color: #059669; margin: 0 0 16px 0; font-size: 24px;">
        ${isEnglish ? 'Thank you for your order!' : 'Merci pour votre commande !'}
      </h2>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        ${isEnglish ? 'Hello' : 'Bonjour'} ${data.customerName},
      </p>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        ${isEnglish
          ? 'Your order has been successfully received. Here are the details:'
          : 'Votre commande a été reçue avec succès. Voici les détails :'}
      </p>

      <!-- Order Details -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #059669; margin: 0 0 12px 0; font-size: 18px;">
          ${isEnglish ? 'Order' : 'Commande'} #${data.orderNumber}
        </h3>
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          ${isEnglish ? 'Placed on' : 'Passée le'} ${formatDate(new Date())}
        </p>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">
              ${isEnglish ? 'Item' : 'Article'}
            </th>
            <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600;">
              ${isEnglish ? 'Qty' : 'Qté'}
            </th>
            <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600;">
              ${isEnglish ? 'Price' : 'Prix'}
            </th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right; color: #6b7280;">
              ${isEnglish ? 'Subtotal:' : 'Sous-total :'}
            </td>
            <td style="padding: 12px; text-align: right; color: #374151;">${formatPrice(data.subtotal)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right; color: #6b7280;">
              ${isEnglish ? 'Tax:' : 'Taxes :'}
            </td>
            <td style="padding: 12px; text-align: right; color: #374151;">${formatPrice(data.tax)}</td>
          </tr>
          ${data.deliveryFee > 0 ? `
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right; color: #6b7280;">
              ${isEnglish ? 'Delivery Fee:' : 'Frais de livraison :'}
            </td>
            <td style="padding: 12px; text-align: right; color: #374151;">${formatPrice(data.deliveryFee)}</td>
          </tr>
          ` : ''}
          <tr style="border-top: 2px solid #059669;">
            <td colspan="2" style="padding: 12px; text-align: right; color: #059669; font-weight: 700; font-size: 18px;">
              ${isEnglish ? 'Total:' : 'Total :'}
            </td>
            <td style="padding: 12px; text-align: right; color: #059669; font-weight: 700; font-size: 18px;">
              ${formatPrice(data.total)}
            </td>
          </tr>
        </tfoot>
      </table>

      <!-- Delivery Information -->
      <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 16px; margin-bottom: 24px;">
        <h3 style="color: #059669; margin: 0 0 12px 0; font-size: 16px;">
          ${isEnglish ? 'Delivery Information' : 'Informations de livraison'}
        </h3>
        <p style="color: #374151; margin: 0 0 8px 0;">
          <strong>${isEnglish ? 'Method:' : 'Méthode :'}</strong> ${deliveryMethodText}
        </p>
        <p style="color: #374151; margin: 0 0 8px 0;">
          <strong>${isEnglish ? 'Date:' : 'Date :'}</strong> ${formatDate(data.deliveryDate)}
        </p>
        <p style="color: #374151; margin: 0;">
          <strong>${isEnglish ? 'Time:' : 'Heure :'}</strong> ${data.deliveryTime}
        </p>
        ${data.deliveryAddress ? `
        <p style="color: #374151; margin: 8px 0 0 0;">
          <strong>${isEnglish ? 'Address:' : 'Adresse :'}</strong><br>
          ${data.deliveryAddress}
        </p>
        ` : ''}
      </div>

      <p style="color: #374151; line-height: 1.6; margin: 0 0 16px 0;">
        ${isEnglish
          ? 'If you have any questions about your order, please don\'t hesitate to contact us.'
          : 'Si vous avez des questions concernant votre commande, n\'hésitez pas à nous contacter.'}
      </p>

      <p style="color: #374151; line-height: 1.6; margin: 0;">
        ${isEnglish ? 'Best regards,' : 'Cordialement,'}<br>
        <strong>${isEnglish ? 'The Les Touillés Team' : 'L\'équipe Les Touillés'}</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0; font-size: 14px;">
        Les Touillés - ${isEnglish ? 'Catering & Gourmet Meals' : 'Traiteur & Repas Gourmands'}
      </p>
      <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
        ${isEnglish
          ? 'This email was sent to confirm your order. Please do not reply to this email.'
          : 'Cet email a été envoyé pour confirmer votre commande. Veuillez ne pas répondre à cet email.'}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate HTML for reservation confirmation email
 */
function generateReservationConfirmationHTML(data: ReservationConfirmationData, isEnglish: boolean): string {
  const formatDate = (date: Date) => date.toLocaleDateString(isEnglish ? "en-CA" : "fr-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eventTypeLabels: Record<string, { fr: string; en: string }> = {
    wedding: { fr: "Mariage", en: "Wedding" },
    corporate: { fr: "Événement corporatif", en: "Corporate Event" },
    private_party: { fr: "Fête privée", en: "Private Party" },
    other: { fr: "Autre", en: "Other" },
  };

  const eventTypeText = eventTypeLabels[data.eventType]?.[isEnglish ? "en" : "fr"] || data.eventType;

  return `
<!DOCTYPE html>
<html lang="${isEnglish ? 'en' : 'fr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEnglish ? 'Reservation Confirmation' : 'Confirmation de réservation'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Les Touillés</h1>
      <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 16px;">${isEnglish ? 'Catering & Gourmet Meals' : 'Traiteur & Repas Gourmands'}</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 20px;">
      <h2 style="color: #059669; margin: 0 0 16px 0; font-size: 24px;">
        ${isEnglish ? 'Reservation Received!' : 'Réservation reçue !'}
      </h2>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        ${isEnglish ? 'Hello' : 'Bonjour'} ${data.customerName},
      </p>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        ${isEnglish
          ? 'Thank you for choosing Les Touillés for your event! We have received your reservation request and will contact you shortly to confirm the details.'
          : 'Merci d\'avoir choisi Les Touillés pour votre événement ! Nous avons bien reçu votre demande de réservation et nous vous contacterons sous peu pour confirmer les détails.'}
      </p>

      <!-- Reservation Details -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #059669; margin: 0 0 12px 0; font-size: 18px;">
          ${isEnglish ? 'Reservation' : 'Réservation'} #${data.reservationId}
        </h3>
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          ${isEnglish ? 'Submitted on' : 'Soumise le'} ${formatDate(new Date())}
        </p>
      </div>

      <!-- Event Details -->
      <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 16px; margin-bottom: 24px;">
        <h3 style="color: #059669; margin: 0 0 12px 0; font-size: 16px;">
          ${isEnglish ? 'Event Details' : 'Détails de l\'événement'}
        </h3>
        <p style="color: #374151; margin: 0 0 8px 0;">
          <strong>${isEnglish ? 'Type:' : 'Type :'}</strong> ${eventTypeText}
        </p>
        <p style="color: #374151; margin: 0 0 8px 0;">
          <strong>${isEnglish ? 'Date:' : 'Date :'}</strong> ${formatDate(data.eventDate)}
        </p>
        <p style="color: #374151; margin: 0 0 8px 0;">
          <strong>${isEnglish ? 'Time:' : 'Heure :'}</strong> ${data.eventTime}
        </p>
        <p style="color: #374151; margin: 0;">
          <strong>${isEnglish ? 'Number of Guests:' : 'Nombre d\'invités :'}</strong> ${data.guestCount}
        </p>
        ${data.venue ? `
        <p style="color: #374151; margin: 8px 0 0 0;">
          <strong>${isEnglish ? 'Venue:' : 'Lieu :'}</strong> ${data.venue}
        </p>
        ` : ''}
        ${data.dietaryRestrictions ? `
        <p style="color: #374151; margin: 8px 0 0 0;">
          <strong>${isEnglish ? 'Dietary Restrictions:' : 'Restrictions alimentaires :'}</strong><br>
          ${data.dietaryRestrictions}
        </p>
        ` : ''}
        ${data.specialRequirements ? `
        <p style="color: #374151; margin: 8px 0 0 0;">
          <strong>${isEnglish ? 'Special Requirements:' : 'Exigences particulières :'}</strong><br>
          ${data.specialRequirements}
        </p>
        ` : ''}
      </div>

      <!-- Next Steps -->
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px;">
        <h3 style="color: #f59e0b; margin: 0 0 12px 0; font-size: 16px;">
          ${isEnglish ? 'Next Steps' : 'Prochaines étapes'}
        </h3>
        <p style="color: #374151; margin: 0; line-height: 1.6;">
          ${isEnglish
            ? 'Our team will review your request and contact you within 24-48 hours to discuss your menu preferences, finalize pricing, and confirm all details for your event.'
            : 'Notre équipe examinera votre demande et vous contactera dans les 24 à 48 heures pour discuter de vos préférences de menu, finaliser les prix et confirmer tous les détails de votre événement.'}
        </p>
      </div>

      <p style="color: #374151; line-height: 1.6; margin: 0 0 16px 0;">
        ${isEnglish
          ? 'If you have any questions or need to make changes to your reservation, please don\'t hesitate to contact us.'
          : 'Si vous avez des questions ou si vous devez apporter des modifications à votre réservation, n\'hésitez pas à nous contacter.'}
      </p>

      <p style="color: #374151; line-height: 1.6; margin: 0;">
        ${isEnglish ? 'Best regards,' : 'Cordialement,'}<br>
        <strong>${isEnglish ? 'The Les Touillés Team' : 'L\'équipe Les Touillés'}</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0; font-size: 14px;">
        Les Touillés - ${isEnglish ? 'Catering & Gourmet Meals' : 'Traiteur & Repas Gourmands'}
      </p>
      <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
        ${isEnglish
          ? 'This email was sent to confirm your reservation request. Please do not reply to this email.'
          : 'Cet email a été envoyé pour confirmer votre demande de réservation. Veuillez ne pas répondre à cet email.'}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
