module Api
  module V1
    class SessionsController < Devise::SessionsController
      respond_to :json
      skip_before_action :authenticate_member!

      private

      # Called on successful sign-in — JWT is added to the Authorization response header
      # automatically by devise-jwt; we only need to return the member body.
      def respond_with(resource, _opts = {})
        if resource.status_revoked?
          render json: { error: "Your membership has been revoked. Please contact TECHSA administration." }, status: :forbidden
          return
        end
        render json: {
          message: "Logged in successfully",
          member: member_json(resource)
        }, status: :ok
      end

      # Called on sign-out
      def respond_to_on_destroy
        if current_member
          render json: { message: "Logged out successfully" }, status: :ok
        else
          render json: { message: "No active session found" }, status: :unauthorized
        end
      end

      def member_json(member)
        {
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          registration_number: member.registration_number,
          status: member.status,
          role: member.role
        }
      end
    end
  end
end
