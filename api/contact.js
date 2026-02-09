/**
 * Vercel Serverless Function: Contact Form Handler
 *
 * Handles contact form submissions from contact.html
 * Validates input, sends email via Resend API, returns JSON response
 *
 * Environment Variables Required:
 * - RESEND_API_KEY: API key from resend.com
 * - CONTACT_EMAIL: Email address to receive form submissions (default: grant@geekbyte.biz)
 *
 * Resend Setup:
 * 1. Sign up at https://resend.com (free tier: 3,000 emails/month)
 * 2. Generate API key from dashboard
 * 3. Add to Vercel environment variables: Settings → Environment Variables
 * 4. Key: RESEND_API_KEY, Value: re_xxxxx
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'grant@geekbyte.biz';

// Allow CORS for same-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Main handler function
 */
export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  // Check for API key
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable not set');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error. Please contact support.'
    });
  }

  try {
    // Parse form data (Vercel automatically parses body for JSON and form data)
    const { name, email, company, phone, service, message, _gotcha } = req.body;

    // Honeypot spam protection: if _gotcha field is filled, it's likely a bot
    if (_gotcha && _gotcha.trim() !== '') {
      console.log('Honeypot triggered - likely spam submission');
      // Return success to bot but don't send email
      return res.status(200).json({
        success: true,
        message: 'Form submitted successfully'
      });
    }

    // Validate required fields
    const errors = [];
    if (!name || name.trim() === '') errors.push('Name is required');
    if (!email || email.trim() === '') errors.push('Email is required');
    if (!service || service.trim() === '') errors.push('Service selection is required');
    if (!message || message.trim() === '') errors.push('Message is required');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }

    // Build email content
    const emailSubject = `Contact Form: ${service} - ${name}`;
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Service Interest:</strong> ${service}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Submitted from geekbyte.biz contact form</p>
    `;

    const emailText = `
New Contact Form Submission

From: ${name} (${email})
${company ? `Company: ${company}` : ''}
${phone ? `Phone: ${phone}` : ''}
Service Interest: ${service}

Message:
${message}

---
Submitted from geekbyte.biz contact form
    `.trim();

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Geekbyte Contact Form <noreply@geekbyte.biz>',
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again or contact us directly at info@geekbyte.biz'
      });
    }

    console.log('Email sent successfully:', resendData.id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      emailId: resendData.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request. Please try again.'
    });
  }
}
