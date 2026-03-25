class AddPhoneNumberUniquenessToMembers < ActiveRecord::Migration[7.1]
  def change
    # PostgreSQL naturally allows multiple NULLs on a unique index,
    # so members without a phone number are unaffected.
    add_index :members, :phone_number, unique: true
  end
end
