class Organization < ApplicationRecord
    belongs_to :user #Una organizacion pertenece a un usuario
    has_many :vehicles #Una organizacio tiene muchos vehiculos
    has_many :driver #Una organizacio tiene muchos conductores
    has_many :routes #Una organizacio tiene muchas rutas
end
