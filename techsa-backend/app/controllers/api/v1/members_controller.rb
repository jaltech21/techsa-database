module Api
  module V1
    class MembersController < ApplicationController
      # GET /api/v1/members/me
      def me
        m = current_member
        render json: {
          member: {
            id:                  m.id,
            first_name:          m.first_name,
            last_name:           m.last_name,
            email:               m.email,
            student_id:          m.student_id,
            registration_number: m.registration_number,
            status:              m.status,
            role:                m.role,
            department:          m.department,
            level:               m.level,
            gender:              m.gender,
            date_of_birth:       m.date_of_birth,
            phone_number:        m.phone_number,
            residential_area:    m.residential_area,
            emergency_contact:   m.emergency_contact,
            areas_of_interest:   m.areas_of_interest,
            other_interests:     m.other_interests
          }
        }, status: :ok
      end
    end
  end
end
