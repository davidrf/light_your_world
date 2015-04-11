class CreateLights < ActiveRecord::Migration
  def change
    create_table :lights do |t|
      t.string :name
      t.integer :number
    end
  end
end
