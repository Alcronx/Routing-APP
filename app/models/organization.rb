class Organization < ApplicationRecord
    belongs_to :user #Una organizacion pertenece a un usuario
    has_many :vehicles #Una organizacio tiene muchos vehiculos
    has_many :driver #Una organizacio tiene muchos conductores
    has_many :routes #Una organizacio tiene muchas rutas

    #Funcion que carga todas las organaizaciones, son algunas estadisitcas
    def self.loadOrganizations()
        idUsuario = User.first&.id
        organizationsList = Organization.find_by_sql(["
            SELECT org.id, org.name, 
                COUNT(DISTINCT vehicles.id) AS vehicles_number, 
                COUNT(DISTINCT routes.id) AS routes_number, 
                COUNT(DISTINCT drivers.id) AS drivers_number
            FROM organizations org
            LEFT JOIN vehicles ON vehicles.organization_id = org.id
            LEFT JOIN routes ON routes.organization_id = org.id
            LEFT JOIN drivers ON drivers.organization_id = org.id
            WHERE org.user_id = ?
            GROUP BY org.id, org.name
            ORDER BY org.id;
            ", idUsuario]
        )
        return(organizationsList)
    end


end
