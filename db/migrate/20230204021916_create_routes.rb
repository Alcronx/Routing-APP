class CreateRoutes < ActiveRecord::Migration[5.2]
  def change
    create_table :routes do |t|
      t.string :name 
      t.datetime :starts_at
      t.datetime :ends_at
      t.interval  :travel_time
      t.integer :total_stops
      t.string :action
      t.string :status

      t.references :organization, foreign_key: true
      t.references :vehicle, foreign_key: true
      t.references :driver, foreign_key: true
      t.timestamps
    end
  end
end


