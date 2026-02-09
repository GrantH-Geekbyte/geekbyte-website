# Vercel Serverless Functions - API

This directory contains Vercel serverless functions for the GeekByte website.

## Contact Form Handler (`contact.js`)

Handles contact form submissions from [contact.html](../contact.html) and sends email notifications via Resend.

### Setup

1. **Sign up for Resend** (if not already done)
   - Go to https://resend.com
   - Sign up for free account (3,000 emails/month on free tier)
   - Verify your domain (geekbyte.biz) for production use
   - For testing, you can use the default sandbox domain

2. **Get your API key**
   - Log in to Resend dashboard
   - Navigate to API Keys: https://resend.com/api-keys
   - Click "Create API Key"
   - Name it: "GeekByte Production"
   - Copy the key (starts with `re_`)

3. **Configure Vercel Environment Variables**
   - Go to Vercel dashboard: https://vercel.com/dashboard
   - Navigate to your project → Settings → Environment Variables
   - Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `RESEND_API_KEY` | `re_xxxxx` (your API key) | Production, Preview |
   | `CONTACT_EMAIL` | `grant@geekbyte.biz` | Production, Preview |

4. **Verify Domain in Resend** (for production emails)
   - In Resend dashboard, go to Domains
   - Add domain: `geekbyte.biz`
   - Follow DNS configuration instructions
   - Add SPF, DKIM, and DMARC records to your DNS provider
   - Verify domain (this ensures emails aren't marked as spam)

   **Note:** Until domain is verified, emails will be sent from Resend's sandbox domain. They'll still work but may have lower deliverability.

### Testing Locally

To test the serverless function locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Create .env file (don't commit this!)
cp .env.example .env
# Edit .env and add your RESEND_API_KEY

# Run local development server
vercel dev

# Test the contact form at http://localhost:3000/contact.html
```

### API Endpoint

**URL:** `/api/contact`

**Method:** `POST`

**Content-Type:** `application/x-www-form-urlencoded` or `multipart/form-data`

**Request Body:**
```
name: string (required)
email: string (required)
company: string (optional)
phone: string (optional)
service: string (required)
message: string (required)
_gotcha: string (honeypot - should be empty)
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "emailId": "abc123"
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "errors": [
    "Name is required",
    "Invalid email format"
  ]
}
```

**Response (Server Error):**
```json
{
  "success": false,
  "error": "Failed to send email. Please try again or contact us directly at info@geekbyte.biz"
}
```

### Spam Protection

The function includes multiple layers of spam protection:

1. **Honeypot field (`_gotcha`)**: Hidden field that bots auto-fill. If filled, submission is silently rejected.
2. **Email validation**: Basic regex validation for email format.
3. **Required field validation**: Name, email, service, and message are required.
4. **Resend built-in spam filtering**: Resend automatically filters spam and validates sender reputation.

### Monitoring & Debugging

**Resend Dashboard:**
- View all sent emails: https://resend.com/emails
- Check delivery status, open rates, and bounces
- View email content and raw logs

**Vercel Logs:**
- Navigate to your project → Deployments → [deployment] → Functions
- View real-time logs for `/api/contact` function
- Check for errors, spam attempts, and successful submissions

**Email Delivery Issues:**
1. Check Resend dashboard for delivery status
2. Verify domain is properly configured (SPF/DKIM)
3. Check spam folder in recipient email
4. Review Vercel function logs for errors
5. Verify `RESEND_API_KEY` environment variable is set

### Cost & Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Up to 100KB per email
- Suitable for contact forms on small business sites

**Resend Paid Plans:**
- If you exceed free tier, upgrade to paid plan
- $20/month: 50,000 emails/month
- See pricing: https://resend.com/pricing

### Security

- API key is stored in Vercel environment variables (never committed to Git)
- Honeypot field prevents basic bot spam
- Email validation prevents malformed addresses
- CORS headers restrict requests to same origin
- Resend handles authentication and encryption

### Support

For issues with:
- **Resend:** https://resend.com/support
- **Vercel:** https://vercel.com/support
- **Contact form:** grant@geekbyte.biz
