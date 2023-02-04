class CreateVehicles < ActiveRecord::Migration[5.2]
  def change
    create_table :vehicles do |t|
      t.string :plate
      t.references :organization, foreign_key: true
      t.timestamps
    end
  end
end
