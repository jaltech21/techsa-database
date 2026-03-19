module Api
  module V1
    module Admin
      class MembersController < ApplicationController
        before_action :authenticate_admin!

        # GET  /api/v1/admin/members
        # PATCH /api/v1/admin/members/:id
        # TODO: Implement in Phase 3
      end
    end
  end
end
