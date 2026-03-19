# Devise + JWT configuration
# TODO: Full configuration to be completed in Phase 1

Devise.setup do |config|
  config.mailer_sender = "no-reply@techsa.org"
  config.navigational_formats = []

  config.jwt do |jwt|
    jwt.secret = ENV.fetch("DEVISE_JWT_SECRET_KEY")
    jwt.dispatch_requests = [
      ["POST", %r{^/api/v1/members/sign_in$}]
    ]
    jwt.revocation_requests = [
      ["DELETE", %r{^/api/v1/members/sign_out$}]
    ]
    jwt.expiration_time = 24.hours.to_i
  end
end
