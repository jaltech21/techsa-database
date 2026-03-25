class MemberMailer < ApplicationMailer
  def reset_password_email(member, reset_url)
    @member    = member
    @reset_url = reset_url
    mail(to: member.email, subject: "Reset your TECHSA password") do |format|
      format.html { render html: reset_email_html(member.first_name, reset_url).html_safe }
    end
  end

  private

  def reset_email_html(name, url)
    <<~HTML
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:36px 32px;background:#f9fafb;border-radius:12px;">
        <h2 style="color:#4f46e5;font-size:22px;margin:0 0 4px;">TECHSA</h2>
        <p style="color:#6b7280;font-size:13px;margin:0 0 28px;">Tech Students Association</p>
        <h3 style="color:#1f2937;margin:0 0 12px;">Password Reset Request</h3>
        <p style="color:#374151;line-height:1.6;">Hi #{name},</p>
        <p style="color:#374151;line-height:1.6;">We received a request to reset your password. Click the button below to choose a new one:</p>
        <a href="#{url}"
           style="display:inline-block;background:#4f46e5;color:#ffffff;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;margin:20px 0;font-size:15px;">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:13px;line-height:1.6;">This link expires in <strong>6 hours</strong>. If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />
        <p style="color:#9ca3af;font-size:12px;">TECHSA &mdash; Tech Students Association</p>
      </div>
    HTML
  end
end
