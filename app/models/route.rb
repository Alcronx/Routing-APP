class Route < ApplicationRecord
    belongs_to :organization #Una ruta Pertenece a una roganizacion
    belongs_to :vehicle #Una ruta Pertenece a un vehiculo
    belongs_to :driver, foreign_key: #Una ruta Pertenece a un conductor
end
