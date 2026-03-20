# Seed file — creates the initial admin user
# Run with: rails db:seed

admin_email    = ENV.fetch("ADMIN_SEED_EMAIL", "admin@techsa.org")
admin_password = ENV.fetch("ADMIN_SEED_PASSWORD")

if Member.exists?(email: admin_email)
  puts "Admin user already exists (#{admin_email}) — skipping."
else
  Member.create!(
    first_name: "Admin",
    last_name:  "TECHSA",
    student_id: "ADMIN-001",
    email:      admin_email,
    password:   admin_password,
    role:       :admin,
    status:     :active
  )
  puts "Admin user created: #{admin_email}"
end
