class ExecutivePasskey < ApplicationRecord
  validates :token, presence: true, uniqueness: true

  # Generate a random passkey token in the format EXEC-XXXX-XXXX
  def self.generate_token
    loop do
      token = "EXEC-#{SecureRandom.alphanumeric(4).upcase}-#{SecureRandom.alphanumeric(4).upcase}"
      return token unless exists?(token: token)
    end
  end
end
