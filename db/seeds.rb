#Se creara al Usuario Por defecto
User.create!([
    {email: "ad.sanchez@duocuc.cl", password: "123", national_id: "19985537-9"},
])
#Se crearan las 2 Organizaciones pertenecientes a este Usuario
user = User.first
Organization.create!([
    {name: "Routing", user_id: user.id},
    {name: "Pricing", user_id: user.id},
])
#Se crearan los vehiculos para cada organizacion
routing = Organization.first
pricing = Organization.second 

Vehicle.create!([
  #Routing
  {plate: "VE1", organization_id: routing.id},
  {plate: "VE2", organization_id: routing.id},
  {plate: "VE3", organization_id: routing.id},
  {plate: "VE4", organization_id: routing.id},
  {plate: "VE5", organization_id: routing.id},
  #Princing
  {plate: "VE6", organization_id: pricing.id},
  {plate: "VE7", organization_id: pricing.id},
  {plate: "VE8", organization_id: pricing.id},
])
#Se crearan los Conductores para cada organizacion

Driver.create!([
  #Routing
  {name: "Carlos", last_name: "Sanchez", organization_id: routing.id},
  {name: "Adan", last_name: "Muñoz", organization_id: routing.id},
  {name: "Diego", last_name: "Paredes", organization_id: routing.id},
  #Princing
  {name: "Andrea", last_name: "Rojas", organization_id: pricing.id},
  {name: "Mauro", last_name: "Sepulveda", organization_id: pricing.id},
])

#Se crearan la rutas
diego = Driver.third #Se obtendra al conductor diego
ve1 = Vehicle.first #Se obtendra al vahiculo VE1
Route.create!([
  #Routing
  { 
    name: "Ruta 1",
    starts_at: Time.now.change(hour: 9, min: 0, sec: 0), 
    ends_at: Time.now.change(hour: 11, min: 30, sec: 0),
    travel_time: 2.hour + 30.minutes, 
    total_stops: 3, 
    action: "Recogida", 
    status: "0", 
    organization_id: routing.id
  },
  { 
    name: "Ruta 2",
    starts_at: Time.now.change(hour: 9, min: 0, sec: 0), 
    ends_at: Time.now.change(hour: 10, min: 10, sec: 0),
    travel_time: 1.hour + 10.minutes, 
    total_stops: 2, 
    action: "Recogida", 
    status: "0", 
    organization_id: routing.id
  },
  { 
    name: "Ruta 3",
    starts_at: Time.now.change(hour: 11, min: 0, sec: 0), 
    ends_at: Time.now.change(hour: 13, min: 30, sec: 0),
    travel_time: 2.hour + 30.minutes, 
    total_stops: 7, 
    action: "Recogida", 
    status: "1",
    driver_id: diego.id,
    vehicle_id: ve1.id,
    organization_id: routing.id,
  },
])




