class AddProfileFieldsToMembers < ActiveRecord::Migration[7.2]
  def change
    add_column :members, :department,        :string
    add_column :members, :level,             :string
    add_column :members, :gender,            :string
    add_column :members, :date_of_birth,     :date
    add_column :members, :phone_number,      :string
    add_column :members, :residential_area,  :string
    add_column :members, :emergency_contact, :string
    add_column :members, :areas_of_interest, :text, array: true, default: []
    add_column :members, :other_interests,   :string
  end
end
