class CreateLightShows < ActiveRecord::Migration
  def change
    create_table :light_shows do |t|
      t.string :name, null: false
      t.integer :user_id, null: false
    end
  end
end
