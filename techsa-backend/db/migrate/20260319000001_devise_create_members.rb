class DeviseCreateMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :members do |t|
      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      ## Custom profile fields
      t.string :first_name,         null: false
      t.string :last_name,          null: false
      t.string :student_id,         null: false

      ## Auto-generated membership ID (e.g. TSA-2026-001)
      t.string :registration_number

      ## Member state
      t.string :status, null: false, default: "pending"
      t.string :role,   null: false, default: "member"

      t.timestamps null: false
    end

    add_index :members, :email,               unique: true
    add_index :members, :student_id,          unique: true
    add_index :members, :registration_number, unique: true
  end
end
