class AddNameToLightEffects < ActiveRecord::Migration
  def change
    add_column :light_effects, :name, :string, null: false
  end
end
