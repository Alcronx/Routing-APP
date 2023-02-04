class CreateDrivers < ActiveRecord::Migration[5.2]
  def change
    create_table :drivers do |t|
      t.string :name
      t.string :last_name
      t.references :organization, foreign_key: true
      
      t.timestamps
    end
  end
end
