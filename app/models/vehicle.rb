class Vehicle < ApplicationRecord
    belongs_to :organization #Un vehiculo pertenece a una organizacion
    has_many :routes #Un vehiculo tiene muchas rutas
end
