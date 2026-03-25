module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json
      skip_before_action :authenticate_member!

      # POST /api/v1/members
      def create
        member = Member.new(sign_up_params)

        # Validate executive passkey before saving
        if member.member_type_executive?
          passkey_token = params.dig(:member, :executive_passkey).to_s.strip
          passkey = ExecutivePasskey.find_by(token: passkey_token)

          unless passkey && !passkey.used
            error_msg = passkey ? "This executive passkey has already been used." : "Invalid executive passkey."
            render json: { errors: [error_msg] }, status: :unprocessable_entity
            return
          end
        end

        # Check for duplicate registration by full name (case-insensitive)
        first = member.first_name.to_s.strip.downcase
        last  = member.last_name.to_s.strip.downcase
        if Member.where("LOWER(TRIM(first_name)) = ? AND LOWER(TRIM(last_name)) = ?", first, last).exists?
          render json: { errors: ["An account with this name already exists. If you have forgotten your password, use the reset link on the login page."] }, status: :unprocessable_entity
          return
        end

        saved = false
        ActiveRecord::Base.transaction do
          if member.save
            passkey.update!(used: true, used_by_email: member.email) if member.member_type_executive?
            saved = true
          end
        end

        if saved
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
        params.require(:member).permit(
          :first_name, :last_name, :student_id, :email, :password,
          :department, :level, :gender, :date_of_birth,
          :phone_number, :residential_area, :emergency_contact,
          :member_type, :position,
          :other_interests,
          areas_of_interest: []
          # executive_number deliberately omitted — admin-assigned only
        )
      end

      def member_json(member)
        {
          id:                  member.id,
          first_name:          member.first_name,
          last_name:           member.last_name,
          email:               member.email,
          student_id:          member.student_id,
          registration_number: member.registration_number,
          status:              member.status,
          role:                member.role,
          department:          member.department,
          level:               member.level,
          gender:              member.gender,
          date_of_birth:       member.date_of_birth,
          phone_number:        member.phone_number,
          residential_area:    member.residential_area,
          emergency_contact:   member.emergency_contact,
          areas_of_interest:   member.areas_of_interest,
          other_interests:     member.other_interests,
          member_type:         member.member_type,
          position:            member.position
        }
      end
    end
  end
end
