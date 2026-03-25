class Member < ApplicationRecord
  # Devise modules
  devise :database_authenticatable, :registerable, :validatable, :recoverable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Enums
  enum :status,      { pending: "pending", active: "active", revoked: "revoked" }, prefix: true
  enum :role,        { member: "member",   admin: "admin"   }, prefix: true
  enum :member_type, { general: "general", executive: "executive" },              prefix: true

  # Validations
  validates :first_name, :last_name, :student_id, presence: true
  validates :student_id,          uniqueness: { case_sensitive: false }
  validates :registration_number, uniqueness: true, allow_nil: true
  validates :position,            presence: true, if: -> { member_type_executive? }
  validates :position,            length: { maximum: 100 }, allow_blank: true
  validates :executive_number,    uniqueness: true, allow_nil: true

  # Callbacks
  before_create :generate_registration_number

  # Include role in JWT payload so the frontend can read it
  def jwt_payload
    { "role" => role }
  end

  private

  # Generates a unique registration number in the format TSA-YYYY-{INITIALS}-{RANDOM6}.
  # e.g. TSA-2026-OJ-X8KM3P
  # The 6-character random alphanumeric suffix (36^6 ≈ 2.1 billion possibilities) makes
  # collisions astronomically unlikely; the uniqueness loop handles the residual case.
  def generate_registration_number
    initials = "#{first_name[0]}#{last_name[0]}".upcase
    year     = Time.current.year

    loop do
      random_part = SecureRandom.alphanumeric(6).upcase
      candidate   = "TSA-#{year}-#{initials}-#{random_part}"

      unless Member.exists?(registration_number: candidate)
        self.registration_number = candidate
        break
      end
    end
  end
end
