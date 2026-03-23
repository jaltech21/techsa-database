class Member < ApplicationRecord
  # Devise modules
  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Enums
  enum :status, { pending: "pending", active: "active", revoked: "revoked" }, prefix: true
  enum :role,   { member: "member",   admin: "admin"   }, prefix: true

  # Validations
  validates :first_name, :last_name, :student_id, presence: true
  validates :student_id,          uniqueness: { case_sensitive: false }
  validates :registration_number, uniqueness: true, allow_nil: true

  # Callbacks
  before_create :generate_registration_number

  # Include role in JWT payload so the frontend can read it
  def jwt_payload
    { "role" => role }
  end

  private

  # Generates a unique registration number in the format TSA-YYYY-XXX.
  # Uses a pessimistic lock on the last matching row to prevent duplicates
  # under concurrent registrations.
  def generate_registration_number
    year = Time.current.year

    # Retry loop in case of a uniqueness race after the lock window
    loop do
      last = Member
               .where("registration_number LIKE ?", "TSA-#{year}-%")
               .order(:registration_number)
               .lock("FOR UPDATE SKIP LOCKED")
               .last

      sequence = last ? last.registration_number.split("-").last.to_i + 1 : 1
      candidate = format("TSA-%d-%03d", year, sequence)

      unless Member.exists?(registration_number: candidate)
        self.registration_number = candidate
        break
      end
    end
  end
end
