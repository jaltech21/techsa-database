require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module TechsaBackend
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true

    # Use ENV var for secret key base (avoids credentials file requirement)
    config.secret_key_base = ENV.fetch("SECRET_KEY_BASE", SecureRandom.hex(64))
  end
end
