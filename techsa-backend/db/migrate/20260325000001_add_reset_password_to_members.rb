class AddResetPasswordToMembers < ActiveRecord::Migration[7.1]
  def change
    add_column :members, :reset_password_token, :string
    add_column :members, :reset_password_sent_at, :datetime
    add_index  :members, :reset_password_token, unique: true
  end
end
