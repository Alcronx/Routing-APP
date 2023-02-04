class Driver < ApplicationRecord
    belongs_to :organization #Un conductor pertenece a una organizacion
    has_many :routes #Un conductor tiene muchas rutas
end
