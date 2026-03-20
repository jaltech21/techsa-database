module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json
      skip_before_action :authenticate_member!

      # POST /api/v1/members
      def create
        member = Member.new(sign_up_params)

        if member.save
          render json: {
            message: "Registration successful",
            member: member_json(member)
          }, status: :created
        else
          render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def sign_up_params
        params.require(:member).permit(:first_name, :last_name, :student_id, :email, :password)
      end

      def member_json(member)
        {
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          student_id: member.student_id,
          registration_number: member.registration_number,
          status: member.status,
          role: member.role
        }
      end
    end
  end
end
