class CreateExecutivePasskeys < ActiveRecord::Migration[7.2]
  def change
    create_table :executive_passkeys do |t|
      t.string  :token,         null: false
      t.boolean :used,          null: false, default: false
      t.string  :used_by_email

      t.timestamps
    end

    add_index :executive_passkeys, :token, unique: true
  end
end
