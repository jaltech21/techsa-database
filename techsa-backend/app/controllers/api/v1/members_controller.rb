module Api
  module V1
    class MembersController < ApplicationController
      # GET /api/v1/members/me
      def me
        render json: {
          member: {
            id: current_member.id,
            first_name: current_member.first_name,
            last_name: current_member.last_name,
            email: current_member.email,
            student_id: current_member.student_id,
            registration_number: current_member.registration_number,
            status: current_member.status,
            role: current_member.role
          }
        }, status: :ok
      end
    end
  end
end
