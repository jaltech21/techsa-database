module Api
  module V1
    class ProfilesController < ApplicationController
      # PATCH /api/v1/members/profile
      def update
        member = current_member

        if member.update(profile_params)
          render json: { member: member_json(member) }, status: :ok
        else
          render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def profile_params
        permitted = params.require(:member).permit(
          :phone_number, :email, :residential_area, :emergency_contact,
          :other_interests, :password, :password_confirmation,
          areas_of_interest: []
        )
        # Only process password if actually provided
        permitted.delete(:password)              if permitted[:password].blank?
        permitted.delete(:password_confirmation) if permitted[:password_confirmation].blank?
        permitted
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
          position:            member.position,
          executive_number:    member.executive_number,
        }
      end
    end
  end
end
