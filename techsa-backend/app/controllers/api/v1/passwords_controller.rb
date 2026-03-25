module Api
  module V1
    class PasswordsController < ApplicationController
      skip_before_action :authenticate_member!

      # POST /api/v1/members/password
      # Always returns 200 to prevent user enumeration.
      def create
        email  = params.dig(:member, :email)&.strip&.downcase
        member = Member.find_by(email: email)

        if member
          raw_token, hashed_token = Devise.token_generator.generate(Member, :reset_password_token)
          member.update!(
            reset_password_token:   hashed_token,
            reset_password_sent_at: Time.now.utc
          )
          reset_url = "#{ENV.fetch('FRONTEND_URL')}/reset-password?token=#{raw_token}"
          begin
            MemberMailer.reset_password_email(member, reset_url).deliver_now
            Rails.logger.info("Password reset email sent to #{member.email}")
          rescue StandardError => e
            Rails.logger.error("Password reset email failed: #{e.class} - #{e.message}")
          end
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
    end
  end
end
