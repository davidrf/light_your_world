class AddUsersToLightEffects < ActiveRecord::Migration
  def change
    add_column :light_effects, :user_id, :integer, null: false
    add_index :light_effects, :user_id
    add_index :light_effects, :name
  end
end
