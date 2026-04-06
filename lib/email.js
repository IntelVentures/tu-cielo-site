// lib/email.js
// Transactional email via Resend for tucielofinancing.com form submissions.
// Sending domain: mail.tucielofinancing.com
// Server-side only — never import in client components.

import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.RESEND_FROM_ADDRESS || "noreply@mail.tucielofinancing.com";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

// ── Admin notification: new PreQual submission ────────────────────────────────

export async function sendPreQualAdminNotification(data, projectCode) {
  if (!ADMIN_EMAILS.length) return;

  const contactName = [data.contact_first_name, data.contact_last_name]
    .filter(Boolean)
    .join(" ") || "—";

  const fmtCurrency = (val) => {
    const n = parseFloat(val);
    if (!val || isNaN(n)) return "—";
    return "$" + n.toLocaleString("en-US");
  };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#1a3c6b,#2a6ab0);padding:30px;text-align:center;border-radius:10px 10px 0 0;">
        <h1 style="color:white;margin:0;font-size:24px;">New HOA Prequalification</h1>
        <p style="color:#cce0ff;margin:8px 0 0;font-size:14px;">TuCielo Financing — Internal Notification</p>
      </div>
      <div style="background:#f9f9f9;padding:20px;">
        ${projectCode ? `<p style="font-size:13px;color:#5a7090;margin:0 0 16px;">Project Code: <strong style="color:#1975E3;font-family:monospace;">${projectCode}</strong></p>` : ""}
        <div style="background:white;padding:20px;border-radius:8px;border-left:4px solid #2a6ab0;margin-bottom:20px;">
          <h3 style="color:#2a6ab0;margin-top:0;">Association Details</h3>
          <p style="margin:5px 0;"><strong>Association:</strong> ${data.hoa_name || "N/A"}</p>
          <p style="margin:5px 0;"><strong>Contact:</strong> ${contactName}</p>
          <p style="margin:5px 0;"><strong>Title:</strong> ${data.contact_title || "N/A"}</p>
          <p style="margin:5px 0;"><strong>Email:</strong> <a href="mailto:${data.hoa_email}" style="color:#2a6ab0;">${data.hoa_email || "N/A"}</a></p>
          <p style="margin:5px 0;"><strong>Phone:</strong> ${data.contact_phone || "N/A"}</p>
          ${data.coupon_code ? `<p style="margin:5px 0;"><strong>Referral Code:</strong> ${data.coupon_code}</p>` : `<p style="margin:5px 0;"><strong>Source:</strong> Direct (no referral)</p>`}
        </div>
        <div style="background:white;padding:20px;border-radius:8px;border-left:4px solid #28a745;margin-bottom:20px;">
          <h3 style="color:#28a745;margin-top:0;">Financial Summary</h3>
          <p style="margin:5px 0;"><strong>Project Size:</strong> ${fmtCurrency(data.estimated_amount)}</p>
          <p style="margin:5px 0;"><strong>Units:</strong> ${data.units_count || "N/A"}</p>
          <p style="margin:5px 0;"><strong>Annual Budget:</strong> ${fmtCurrency(data.annual_budget)}</p>
          <p style="margin:5px 0;"><strong>Delinquency:</strong> ${data.delinquency_rate ? data.delinquency_rate + "%" : "N/A"}</p>
          <p style="margin:5px 0;"><strong>Outstanding Loans:</strong> ${fmtCurrency(data.outstanding_loans)}</p>
          <p style="margin:5px 0;"><strong>Disputes:</strong> ${data.disputes || "None"}</p>
          <p style="margin:5px 0;"><strong>Professionally Managed:</strong> ${data.professionally_managed || "N/A"}</p>
          <p style="margin:5px 0;"><strong>SIRS Report:</strong> ${data.sirs_report || "N/A"}</p>
        </div>
        <div style="background:white;padding:20px;border-radius:8px;border-left:4px solid #6c757d;margin-bottom:20px;">
          <h3 style="color:#6c757d;margin-top:0;">Project Details</h3>
          <p style="margin:5px 0;">${data.project_description || "No description provided."}</p>
          ${data.property_address ? `<p style="margin:5px 0;"><strong>Address:</strong> ${[data.property_address, data.city, data.state, data.zip].filter(Boolean).join(", ")}</p>` : ""}
        </div>
        <div style="background:#1a3c6b;padding:20px;text-align:center;border-radius:8px;">
          <p style="margin:0 0 12px;color:white;font-weight:bold;font-size:16px;">Review in Admin Dashboard</p>
          <a href="https://portal.tucielofinancing.com/admin/projects" style="display:inline-block;background:white;color:#1a3c6b;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:bold;">
            Open Dashboard
          </a>
        </div>
      </div>
      <p style="color:#999;font-size:11px;text-align:center;padding:15px;margin:0;">
        Automatically sent by TuCielo Financing web forms.<br>
        <a href="https://www.tucielofinancing.com" style="color:#2a6ab0;">www.tucielofinancing.com</a>
      </p>
    </div>`;

  const resend = getResend();
  for (const email of ADMIN_EMAILS) {
    try {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: `New HOA Prequalification — ${data.hoa_name || "Unknown HOA"}`,
        html,
      });
    } catch (err) {
      console.error(`Admin notification failed for ${email}:`, err?.message);
    }
  }
}

// ── User confirmation: application received ───────────────────────────────────

export async function sendPreQualUserConfirmation(data) {
  if (!data.hoa_email) return;

  const contactName = [data.contact_first_name, data.contact_last_name]
    .filter(Boolean)
    .join(" ") || "there";

  const fmtCurrency = (val) => {
    const n = parseFloat(val);
    if (!val || isNaN(n)) return "N/A";
    return "$" + n.toLocaleString("en-US");
  };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#1a3c6b,#2a6ab0);padding:30px;text-align:center;border-radius:10px 10px 0 0;">
        <h1 style="color:white;margin:0;font-size:24px;">Application Received</h1>
        <p style="color:#cce0ff;margin:10px 0 0;">Thank you, ${contactName}!</p>
      </div>
      <div style="padding:30px;background:#f9f9f9;">
        <p style="font-size:16px;color:#333;line-height:1.6;">
          We've received your HOA Prequalification Application for <strong>${data.hoa_name || "your association"}</strong>.
          Our team will review your submission and be in touch shortly.
        </p>
        <div style="background:white;padding:20px;border-radius:8px;border-left:4px solid #2a6ab0;margin:20px 0;">
          <h3 style="color:#2a6ab0;margin-top:0;">Application Summary</h3>
          <p style="margin:5px 0;"><strong>Association:</strong> ${data.hoa_name || "N/A"}</p>
          <p style="margin:5px 0;"><strong>Estimated Project Size:</strong> ${fmtCurrency(data.estimated_amount)}</p>
          <p style="margin:5px 0;"><strong>Number of Units:</strong> ${data.units_count || "N/A"}</p>
        </div>
        <h3 style="color:#333;">What Happens Next?</h3>
        <ol style="color:#555;line-height:1.9;padding-left:20px;">
          <li>Our team will review your prequalification details</li>
          <li>We'll verify your association's financial and project information</li>
          <li>A TuCielo specialist will contact you within 1-2 business days</li>
          <li>If qualified, we'll walk you through available HOA financing options</li>
        </ol>
        <div style="background:#fff3cd;padding:15px;border-radius:8px;border-left:4px solid #ffc107;margin:20px 0;">
          <p style="margin:0;color:#856404;font-size:14px;">
            <strong>Note:</strong> Please check your spam folder if you don't hear from us within 2 business days.
          </p>
        </div>
        <p style="color:#555;font-size:14px;margin-top:20px;">
          Questions? Reach us at:<br>
          <a href="mailto:hello@tucielofinancing.com" style="color:#2a6ab0;">hello@tucielofinancing.com</a>
        </p>
      </div>
      <div style="background:#1a3c6b;padding:20px;text-align:center;border-radius:0 0 10px 10px;">
        <p style="margin:0;color:#cce0ff;font-size:12px;">
          TuCielo Financing — HOA Loan Solutions<br>
          <a href="https://www.tucielofinancing.com" style="color:white;">www.tucielofinancing.com</a>
        </p>
      </div>
    </div>`;

  try {
    await getResend().emails.send({
      from: FROM,
      to: data.hoa_email,
      subject: "Your HOA Prequalification Was Received — TuCielo Financing",
      html,
    });
  } catch (err) {
    console.error("User confirmation email failed:", err?.message);
  }
}

// ── Admin notification: new HOA Loan Application ──────────────────────────────

export async function sendLoanAppAdminNotification(data) {
  if (!ADMIN_EMAILS.length) return;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#1975E3;">New HOA Financing Application</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px;color:#5a7090;">HOA Name</td><td style="padding:8px;font-weight:bold;">${data.hoaName || "N/A"}</td></tr>
        <tr><td style="padding:8px;color:#5a7090;">Contact</td><td style="padding:8px;">${data.contactName || "N/A"}</td></tr>
        <tr><td style="padding:8px;color:#5a7090;">Email</td><td style="padding:8px;">${data.email || "N/A"}</td></tr>
        <tr><td style="padding:8px;color:#5a7090;">Phone</td><td style="padding:8px;">${data.phone || "N/A"}</td></tr>
        <tr><td style="padding:8px;color:#5a7090;">Project Type</td><td style="padding:8px;">${data.projectType || "N/A"}</td></tr>
        <tr><td style="padding:8px;color:#5a7090;">Project Cost</td><td style="padding:8px;">${data.projectCost || "N/A"}</td></tr>
      </table>
      <p style="color:#999;font-size:12px;">Check the admin dashboard for full details.</p>
    </div>`;

  const resend = getResend();
  for (const email of ADMIN_EMAILS) {
    try {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: `New HOA Financing Application — ${data.hoaName || "Unknown HOA"}`,
        html,
      });
    } catch (err) {
      console.error(`Loan app notification failed for ${email}:`, err?.message);
    }
  }
}
