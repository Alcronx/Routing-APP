class Route < ApplicationRecord
    belongs_to :organization #Una ruta Pertenece a una roganizacion
    belongs_to :vehicle,  optional: true  #Una ruta Pertenece a un vehiculo
    belongs_to :driver, optional: true  #Una ruta Pertenece a un conductor

    #Funcion que trae las rutas de cada organizacions
    def self.loadRoutes(organizationId)
        routeList = Route.left_joins(:driver, :vehicle).where(organization_id: organizationId).order('id ASC')
        routeArray = []
        routeList.each do |route|
            starts_at = Time.parse(route.starts_at.to_s).strftime("%H:%M")
            ends_at = Time.parse(route.ends_at.to_s).strftime("%H:%M")
            travel_time =  Time.parse(route.travel_time).hour.to_s+"H "+Time.parse(route.travel_time).min.to_s+"M"
            routeArray.push(
                {    
                    :id_route => route.id,
                    :id_organization => route.organization_id ,
                    :vehicle_id =>  route.vehicle_id ,
                    :driver_id =>  route.driver_id ,
                    :route_name  =>  route.name ,
                    :starts_at  =>  starts_at ,
                    :ends_at  =>  ends_at ,
                    :travel_time => travel_time,
                    :total_stops  =>  route.total_stops ,
                    :action  =>  route.action ,
                    :status  =>  route.status ,
                    :driver_name => route.driver&.name,
                    :vehicle_plate => route.vehicle&.plate
                }
            )
        end
        return(routeArray)
    end

    def self.loadRoutesAssigned(driverId,vehicleId)
        routeList = Route.where("vehicle_id = ? or driver_id = ?", vehicleId, driverId).order('id ASC')
        routeArray = []
        routeList.each do |route|
            starts_at = Time.parse(route.starts_at.to_s).strftime("%H:%M")
            ends_at = Time.parse(route.ends_at.to_s).strftime("%H:%M")
            travel_time =  Time.parse(route.travel_time).hour.to_s+"H "+Time.parse(route.travel_time).min.to_s+"M"
            routeArray.push(
                {    
                    :route_name  =>  route.name ,
                    :starts_at  =>  starts_at ,
                    :ends_at  =>  ends_at ,
                    :travel_time => travel_time,
                    :total_stops  =>  route.total_stops ,
                    :action  =>  route.action ,
                    :driver_name => route.driver&.name,
                    :vehicle_plate => route.vehicle&.plate
                }
            )
        end
        return(routeArray)
    end

    def self.overlapSchedules(driverId,vehicleId,routeId)
        routeList = Route.find_by_sql(["
                SELECT 
                    (	
                        SELECT COUNT(rou.id)
                        FROM routes rou 
                        WHERE vehicle_id = ? or driver_id = ?
                        AND TSRANGE(rou.starts_at, rou.ends_at) && TSRANGE(ro.starts_at, ro.ends_at)
                    ) as result
                FROM routes ro
                WHERE id = ?;
            ", driverId,vehicleId,routeId]
        ).first
        result = routeList&.result
        return(result)
    end

end



