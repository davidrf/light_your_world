class CreateLightEffects < ActiveRecord::Migration
  def change
    create_table :light_effects do |t|
      t.boolean :on
      t.integer :hue, null: false
      t.integer :brightness, null: false
      t.integer :saturation, null: false
      t.integer :transition_time, null: false
    end
  end
end
