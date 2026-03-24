module Api
  module V1
    module Admin
      class PasskeysController < ApplicationController
        before_action :authenticate_admin!

        # GET /api/v1/admin/passkeys
        def index
          passkeys = ExecutivePasskey.order(created_at: :desc)
          render json: passkeys.map { |pk| passkey_json(pk) }
        end

        # POST /api/v1/admin/passkeys
        def create
          token = ExecutivePasskey.generate_token
          passkey = ExecutivePasskey.create!(token: token)
          render json: passkey_json(passkey), status: :created
        end

        private

        def passkey_json(pk)
          {
            id:            pk.id,
            token:         pk.token,
            used:          pk.used,
            used_by_email: pk.used_by_email,
            created_at:    pk.created_at
          }
        end
      end
    end
  end
end
