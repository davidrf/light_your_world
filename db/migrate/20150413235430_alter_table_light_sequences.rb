class AlterTableLightSequences < ActiveRecord::Migration
  def up
    rename_column :light_sequences, :milliseconds, :scheduled_time
    add_column :light_sequences, :transition_time, :integer
    add_column :light_sequences, :on, :integer
  end

  def down
    rename_column :light_sequences, :scheduled_time, :milliseconds
    remove_column :light_sequences, :transition_time
    remove_column :light_sequences, :on
  end
end
