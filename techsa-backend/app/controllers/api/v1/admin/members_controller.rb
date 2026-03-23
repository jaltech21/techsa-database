module Api
  module V1
    module Admin
      class MembersController < ApplicationController
        before_action :authenticate_admin!

        # GET /api/v1/admin/members
        def index
          members = Member.order(created_at: :asc)
          render json: members.map { |m| member_json(m) }
        end

        # PATCH /api/v1/admin/members/:id
        def update
          member = Member.find(params[:id])
          if member.update(member_params)
            render json: member_json(member)
          else
            render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def member_params
          params.require(:member).permit(:status, :executive_number)
        end

        def member_json(member)
          {
            id:                  member.id,
            first_name:          member.first_name,
            last_name:           member.last_name,
            student_id:          member.student_id,
            email:               member.email,
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
            created_at:          member.created_at
          }
        end
      end
    end
  end
end
