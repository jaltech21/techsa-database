class AddExecutiveFieldsToMembers < ActiveRecord::Migration[7.2]
  def change
    add_column :members, :member_type,      :string, null: false, default: "general"
    add_column :members, :position,         :string
    add_column :members, :executive_number, :string
    add_index  :members, :executive_number, unique: true
  end
end
