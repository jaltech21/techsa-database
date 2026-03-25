Rails.application.configure do
  config.enable_reloading = true
  config.eager_load = false
  config.consider_all_requests_local = true
  config.server_timing = true

  config.active_record.migration_error = :page_load
  config.active_record.verbose_query_logs = true

  config.action_mailer.delivery_method = :smtp
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.smtp_settings = {
    address:        "smtp.gmail.com",
    port:           465,
    domain:         "gmail.com",
    user_name:      ENV["GMAIL_USERNAME"],
    password:       ENV["GMAIL_APP_PASSWORD"],
    authentication: :login,
    ssl:            true
  }
end
