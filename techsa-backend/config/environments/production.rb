Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.log_level = :info
  config.log_tags = [:request_id]
  config.active_record.dump_schema_after_migration = false
  config.force_ssl = true

  config.action_mailer.delivery_method = :smtp
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.smtp_settings = {
    address:              "smtp.gmail.com",
    port:                 587,
    domain:               "gmail.com",
    user_name:            ENV["GMAIL_USERNAME"],
    password:             ENV["GMAIL_APP_PASSWORD"],
    authentication:       :plain,
    enable_starttls_auto: true
  }
end
