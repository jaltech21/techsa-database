Devise.setup do |config|
  config.mailer_sender = "no-reply@techsa.org"

  # Load the ActiveRecord ORM adapter — required in manually scaffolded apps
  require "devise/orm/active_record"

  # API-only mode: disable browser-based redirect formats
  config.navigational_formats = []

  config.jwt do |jwt|
    jwt.secret = ENV.fetch("DEVISE_JWT_SECRET_KEY")

    # Issue a token on login
    jwt.dispatch_requests = [
      ["POST", %r{^/api/v1/members/sign_in$}]
    ]

    # Add token to the denylist on logout
    jwt.revocation_requests = [
      ["DELETE", %r{^/api/v1/members/sign_out$}]
    ]

    jwt.expiration_time = 24.hours.to_i
  end
end
