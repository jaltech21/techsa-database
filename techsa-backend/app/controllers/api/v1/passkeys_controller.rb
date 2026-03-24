module Api
  module V1
    class PasskeysController < ApplicationController
      skip_before_action :authenticate_member!

      # POST /api/v1/passkeys/validate
      # Public endpoint — checks a passkey is valid and unused (called during registration)
      def validate
        token = params[:token].to_s.strip
        passkey = ExecutivePasskey.find_by(token: token)

        if passkey && !passkey.used
          render json: { valid: true }
        elsif passkey&.used
          render json: { valid: false, error: "This passkey has already been used." }, status: :unprocessable_entity
        else
          render json: { valid: false, error: "Invalid passkey." }, status: :unprocessable_entity
        end
      end
    end
  end
end
