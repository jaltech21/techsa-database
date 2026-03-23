# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_03_23_000001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti", unique: true
  end

  create_table "members", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "student_id", null: false
    t.string "registration_number"
    t.string "status", default: "pending", null: false
    t.string "role", default: "member", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "department"
    t.string "level"
    t.string "gender"
    t.date "date_of_birth"
    t.string "phone_number"
    t.string "residential_area"
    t.string "emergency_contact"
    t.text "areas_of_interest", default: [], array: true
    t.string "other_interests"
    t.string "member_type", default: "general", null: false
    t.string "position"
    t.string "executive_number"
    t.index ["email"], name: "index_members_on_email", unique: true
    t.index ["executive_number"], name: "index_members_on_executive_number", unique: true
    t.index ["registration_number"], name: "index_members_on_registration_number", unique: true
    t.index ["student_id"], name: "index_members_on_student_id", unique: true
  end
end
