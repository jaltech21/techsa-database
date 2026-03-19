class Member < ApplicationRecord
  # Devise modules
  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Enums
  enum status: { pending: "pending", active: "active" }, _prefix: true
  enum role: { member: "member", admin: "admin" }, _prefix: true

  # Validations
  validates :first_name, :last_name, :student_id, presence: true
  validates :student_id, uniqueness: true
  validates :registration_number, uniqueness: true, allow_nil: true

  # Callbacks
  before_create :generate_registration_number

  private

  def generate_registration_number
    # TODO: Implement in Phase 1 — format: TSA-YYYY-XXX (e.g. TSA-2026-001)
  end
end
