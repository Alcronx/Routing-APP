class User < ApplicationRecord
    has_many :organizations #Se establece la relacion con el modelo organizations
end
