import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const { name, email, phone, subject, message } = await req.json();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Admin Email Template - Enhanced
    const adminHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message - Beyond Stays</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Inter', Arial, sans-serif; background: #fafafa; margin: 0; padding: 40px 0;">
  <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px 16px 0 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border-radius: 16px 16px 0 0;">
              <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; display: inline-block;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🌟 New Contact Inquiry</h1>
              </div>
              <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0; font-size: 16px; font-weight: 400;">You've received a new message from Beyond Stays contact form</p>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; padding: 0;">
          <tr>
            <td style="padding: 40px;">
              <!-- Contact Details Card -->
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); padding: 30px; border-radius: 12px; border-left: 4px solid #2a5298; margin-bottom: 30px;">
                <h3 style="color: #1e3c72; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">👤 Contact Information</h3>
                <table width="100%" cellspacing="0" cellpadding="8">
                  <tr>
                    <td width="30%" style="color: #666; font-weight: 500;">Name:</td>
                    <td style="color: #1e3c72; font-weight: 600;">{{name}}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: 500;">Email:</td>
                    <td style="color: #1e3c72; font-weight: 600;">{{email}}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: 500;">Phone:</td>
                    <td style="color: #1e3c72; font-weight: 600;">{{phone}}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: 500;">Subject:</td>
                    <td style="color: #1e3c72; font-weight: 600;">{{subject}}</td>
                  </tr>
                </table>
              </div>

              <!-- Message Card -->
              <div style="background: #fff; border: 1px solid #e8edff; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <h3 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">💬 Message Content</h3>
                <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-left: 3px solid #667eea;">
                  <p style="margin: 0; color: #555; line-height: 1.6; font-size: 15px;">{{message}}</p>
                </div>
              </div>

            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #1e3c72; border-radius: 0 0 16px 16px; color: white;">
          <tr>
            <td style="padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: rgba(255,255,255,0.8);">🏨 Beyond Stays Contact System</p>
              <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.6);">Delivering exceptional travel experiences worldwide</p>
              <p style="margin: 15px 0 0; font-size: 11px; color: rgba(255,255,255,0.5);">© 2024 Beyond Stays. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        .replace("{{name}}", name)
        .replace("{{email}}", email)
        .replace("{{phone}}", phone)
        .replace("{{subject}}", subject)
        .replace("{{message}}", message);

    // Auto-Reply Template - Enhanced
    const userHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thank You - Beyond Stays</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Inter', Arial, sans-serif; background: #fafafa; margin: 0; padding: 40px 0;">
  <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px 16px 0 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 50px 40px 30px; text-align: center; background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%); border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Thank You, {{name}}!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0; font-size: 17px; font-weight: 400;">We're excited to help you plan your next adventure</p>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; padding: 0;">
          <tr>
            <td style="padding: 40px;">
              <!-- Confirmation Message -->
              <div style="text-align: center; margin-bottom: 40px;">
                <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">We've successfully received your message and our travel experts will get back to you within <strong style="color: #00b09b;">24 hours</strong>.</p>
              </div>

              <!-- Summary Card -->
              <div style="background: linear-gradient(135deg, #f8fff8 0%, #f0fff0 100%); padding: 30px; border-radius: 12px; border: 1px solid #e1f5e1; margin-bottom: 30px;">
                <h3 style="color: #2d5016; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">📋 Request Summary</h3>
                <table width="100%" cellspacing="0" cellpadding="10">
                  <tr>
                    <td width="35%" style="color: #666; font-weight: 500;">Subject:</td>
                    <td style="color: #2d5016; font-weight: 600;">{{subject}}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: 500;">Phone:</td>
                    <td style="color: #2d5016; font-weight: 600;">{{phone}}</td>
                  </tr>
                </table>
              </div>

              <!-- Message Preview -->
              <div style="background: #fafafa; padding: 25px; border-radius: 12px; border-left: 4px solid #00b09b;">
                <h4 style="color: #2d5016; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Your Message:</h4>
                <p style="margin: 0; color: #666; line-height: 1.6; font-style: italic; font-size: 15px;">"{{message}}"</p>
              </div>

              <!-- Next Steps -->
              <div style="background: #fff8e1; padding: 25px; border-radius: 12px; margin-top: 30px; border: 1px solid #ffe082;">
                <h4 style="color: #5d4037; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📅 What Happens Next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                  <li>Our travel expert will review your inquiry</li>
                  <li>We'll contact you to discuss your requirements</li>
                  <li>Receive personalized travel recommendations</li>
                  <li>Finalize your perfect travel experience</li>
                </ul>
              </div>
            </td>
          </tr>
        </table>

        <!-- Contact Info -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #2d5016; color: white;">
          <tr>
            <td style="padding: 30px 40px; text-align: center;">
              <h4 style="margin: 0 0 15px 0; font-size: 16px; color: rgba(255,255,255,0.9);">🌴 Beyond Stays - Making Travel Beautiful Again</h4>
              <p style="margin: 8px 0; font-size: 14px; color: rgba(255,255,255,0.8);">✈️ Website: <a href="https://travelwithbeyondstays.com/" style="color: #96c93d; text-decoration: none;">travelwithbeyondstays.com</a></p>
              <p style="margin: 8px 0; font-size: 14px; color: rgba(255,255,255,0.8);">📧 Support: <a href="mailto:support@travelwithbeyondstays.com" style="color: #96c93d; text-decoration: none;">beyondstayspvtltd@gmail.com</a></p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.6);">This is an automated email. Please do not reply to this message.</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        .replace("{{name}}", name)
        .replace("{{phone}}", phone)
        .replace("{{subject}}", subject)
        .replace("{{message}}", message);

    try {
        // Send to Admin
        await transporter.sendMail({
            from: `"Beyond Stays Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECEIVER,
            subject: `🌟 New Inquiry: ${subject}`,
            html: adminHtml,
        });

        // Send Auto-reply to user
        await transporter.sendMail({
            from: `"Beyond Stays" <no-reply@beyondstays.com>`,
            to: email,
            subject: "✅ We've Received Your Message - Beyond Stays",
            html: userHtml,
        });

        return NextResponse.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error sending email" }, { status: 500 });
    }
}