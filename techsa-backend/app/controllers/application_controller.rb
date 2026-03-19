class ApplicationController < ActionController::API
  before_action :authenticate_member!

  private

  def authenticate_admin!
    authenticate_member!
    render json: { error: "Forbidden" }, status: :forbidden unless current_member&.admin?
  end
end
