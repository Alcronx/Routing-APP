# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_02_04_021916) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "drivers", force: :cascade do |t|
    t.string "name"
    t.string "last_name"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_drivers_on_organization_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_organizations_on_user_id"
  end

  create_table "routes", force: :cascade do |t|
    t.string "name"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.interval "travel_time"
    t.integer "total_stops"
    t.string "action"
    t.string "status"
    t.bigint "organization_id"
    t.bigint "vehicle_id"
    t.bigint "driver_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["driver_id"], name: "index_routes_on_driver_id"
    t.index ["organization_id"], name: "index_routes_on_organization_id"
    t.index ["vehicle_id"], name: "index_routes_on_vehicle_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password"
    t.string "national_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "vehicles", force: :cascade do |t|
    t.string "plate"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_vehicles_on_organization_id"
  end

  add_foreign_key "drivers", "organizations"
  add_foreign_key "organizations", "users"
  add_foreign_key "routes", "drivers"
  add_foreign_key "routes", "organizations"
  add_foreign_key "routes", "vehicles"
  add_foreign_key "vehicles", "organizations"
end
