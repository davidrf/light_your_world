class ChangeLightEffectOnColumnToInteger < ActiveRecord::Migration
  def up
    change_column :light_effects, :on, 'integer USING CAST("on" AS integer)'
  end

  def down
    change_column :light_effects, :on, 'boolean USING CAST("on" AS boolean)'
  end
end
