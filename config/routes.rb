Rails.application.routes.draw do
  get 'loadOrganizations', to: 'organization#loadOrganizations'
  get 'loadRoutes/:organizationId', to: 'routes#loadRoutes'
  get 'loadVehicleDriver/:organizationId', to: 'routes#loadVehicleDriver'
  get 'loadRoutesAssigned/:routeId/:vehicleId/:driverId', to: 'routes#loadRoutesAssigned' 
  post 'assignRoute', to: 'routes#assignRoute'
  get 'loadTimeLine/:organizationId', to: 'routes#loadTimeLine'

  root 'home#index'
  match "*path", to: "home#index", via: :all
end
