class AddBridgeUrlToUsers < ActiveRecord::Migration
  def change
    add_column :users, :bridge_url, :string, null: false
  end
end
