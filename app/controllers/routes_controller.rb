class RoutesController < ApplicationController
    skip_before_action :verify_authenticity_token
    #Aqui cargaran la rutas
    def loadRoutes
        organizationId = params[:organizationId]
        routes = Route.loadRoutes(organizationId)
        render json: {status: "SUCCESS", data: routes}
    end
    #Aqui se cargaran los cbx de vehiculos y conductores
    def loadVehicleDriver
        organizationId = params[:organizationId]
        vehicle = Vehicle.where(organization_id: organizationId)
        driver = Driver.where(organization_id: organizationId)
        render json: {status: "SUCCESS", cbxVehicle: vehicle, cbxDriver: driver}
    end
    #Aqui estaran las rutas ya asignadas de lo vehiculos o conductores
    def loadRoutesAssigned
        driverId = params[:driverId]
        vehicleId = params[:vehicleId]
        routeId = params[:routeId]
        assignedRoutes =  Route.loadRoutesAssigned(driverId,vehicleId)
        overlapSchedules =  Route.overlapSchedules(driverId,vehicleId,routeId)
        render json: {status: "SUCCESS", data: assignedRoutes, OverlapSchedules: overlapSchedules}
    end

    #Aqui se asignara la ruta al conductor o vehiculo
    def assignRoute
        driverId = params[:driverId]
        vehicleId = params[:vehicleId]
        routeId = params[:routeId]
        overlapSchedules =  Route.overlapSchedules(driverId,vehicleId,routeId)
        if overlapSchedules>0
            render json: {status: "ERROR"}
        else
            route = Route.find(routeId)
            route.vehicle_id = vehicleId === 0 ? nil : vehicleId
            route.driver_id = driverId === 0 ?  nil : driverId
            if route.save
                render json: {status: "SUCCESS"}
            else
                render json: {status: "ERROR"}
            end
        end
    end

    #Aqui se cargara el Time Line
    def loadTimeLine
        organizationId = params[:organizationId]
        routes = Route.loadTimeLine(organizationId)
        render json: {status: "SUCCESS", data: routes}
    end
end
