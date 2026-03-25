class ApplicationMailer < ActionMailer::Base
  default from: "TECHSA <#{ENV.fetch('GMAIL_USERNAME', 'no-reply@techsa.org')}>"
  layout false
end
