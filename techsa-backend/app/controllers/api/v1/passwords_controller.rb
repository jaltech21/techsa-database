require "net/http"
require "json"

module Api
  module V1
    class PasswordsController < ApplicationController
      skip_before_action :authenticate_member!

      # POST /api/v1/members/password
      # Always returns 200 to prevent user enumeration.
      def create
        email  = params.dig(:member, :email)&.strip&.downcase
        member = Member.find_by(email: email)
        Rails.logger.info("[PasswordReset] lookup email=#{email.inspect} found=#{!member.nil?}")

        if member
          raw_token, hashed_token = Devise.token_generator.generate(Member, :reset_password_token)
          member.update!(
            reset_password_token:   hashed_token,
            reset_password_sent_at: Time.now.utc
          )
          reset_url = "#{ENV.fetch('FRONTEND_URL')}/reset-password?token=#{raw_token}"
          deliver_via_resend(member, reset_url)
        end

        render json: { message: "If that email is registered, reset instructions have been sent." }, status: :ok
      end

      # PUT /api/v1/members/password
      def update
        member = Member.reset_password_by_token(resource_params)

        if member.errors.empty?
          render json: { message: "Password has been reset successfully." }, status: :ok
        else
          render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def resource_params
        params.require(:member).permit(:password, :password_confirmation, :reset_password_token)
      end

      def deliver_via_resend(member, reset_url)
        uri  = URI("https://api.resend.com/emails")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true

        request = Net::HTTP::Post.new(uri)
        request["Authorization"] = "Bearer #{ENV['RESEND_API_KEY']}"
        request["Content-Type"]  = "application/json"
        request.body = {
          from:    "TECHSA <onboarding@resend.dev>",
          to:      member.email,
          subject: "Reset your TECHSA password",
          html:    reset_email_html(member.first_name, reset_url)
        }.to_json

        response = http.request(request)
        if response.code.to_i == 200
          Rails.logger.info("[PasswordReset] Resend email sent to #{member.email}")
        else
          Rails.logger.error("[PasswordReset] Resend API error #{response.code}: #{response.body}")
        end
      rescue StandardError => e
        Rails.logger.error("[PasswordReset] Resend request failed: #{e.class} - #{e.message}")
      end

      def reset_email_html(name, reset_url)
        <<~HTML
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:36px 32px;background:#f9fafb;border-radius:12px;">
            <h2 style="color:#4f46e5;font-size:22px;margin:0 0 4px;">TECHSA</h2>
            <p style="color:#6b7280;font-size:13px;margin:0 0 28px;">Tech Students Association</p>
            <h3 style="color:#1f2937;margin:0 0 12px;">Password Reset Request</h3>
            <p style="color:#374151;line-height:1.6;">Hi #{name},</p>
            <p style="color:#374151;line-height:1.6;">We received a request to reset your password. Click the button below to choose a new one:</p>
            <a href="#{reset_url}"
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
  end
end
