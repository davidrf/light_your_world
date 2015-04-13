class CreateLightSequences < ActiveRecord::Migration
  def change
    create_table :light_sequences do |t|
      t.integer :milliseconds, null: false
      t.integer :light_id, null: false
      t.integer :light_effect_id, null: false
      t.integer :light_show_id, null: false
    end
  end
end
