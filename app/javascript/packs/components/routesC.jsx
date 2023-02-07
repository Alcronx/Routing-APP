import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { useLocation, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import { GoogleMap, useLoadScript, Polygon, Marker } from '@react-google-maps/api';
import TimeLineComp from './timeline';



export default function RoutesC() {
  const { state } = useLocation();
  const [data, setData] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [driver, setDriver] = useState([]);
  const [load, setLoad] = useState(true);
  const MySwal = withReactContent(Swal)
  const [open, setOpen] = useState(false);
  const [actualRoute, setActualRoute] = useState({});
  const [recharge, setRecharge] = useState(true);
  const navigate = useNavigate();
  const handleClickOpen = (route) => {
    setOpen(true);
    setActualRoute(route)
  };
  const handleClose = () => { setOpen(false); };
  //Se cargara la api de google Maps
  const { isLoaded } = useLoadScript({ googleMapsApiKey: "AIzaSyDlQEvOWsnb6PaLK5-8xWxrFomsy3AV0Ag" });
  //funcion para parametirar sweet aelrt
  const assignRoute = (driverV, vehicleV, routeId) => {
    setOpen(false);
    const url = "/assignRoute";
    let data = {
      driverId: driverV,
      vehicleId: vehicleV,
      routeId: routeId,
    };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.status == "SUCCESS") {
          setRecharge(!recharge)
        } else {
          sweetAlert("Error", "Error al Asignar Ruta", "error")
        }
      }).catch((e) => {
        let error = e;
        sweetAlert("Error", "Error al Asignar Ruta", "error")
      });
  }

  //Aqui se manejan las alertas
  const sweetAlert = (title, textHtml, icon) => {
    MySwal.fire({
      title: <strong>{title}</strong>,
      html: textHtml,
      icon: icon
    })
  }

  //Modulo de asignacion
  function DialogComponent() {
    const [driverV, setDriverV] = useState(actualRoute.driver_id || 0);
    const [vehicleV, setVehicleV] = useState(actualRoute.vehicle_id || 0);
    const [assignedRoutes, setAssignedRoutes] = useState([]);
    const [overlapSchedules, setOverlapSchedules] = useState(0);
    const routeId = actualRoute.id_route || 0;
    useEffect(() => {
      const fetchData = async () => {
        const url = "/loadRoutesAssigned/" + routeId + "/" + vehicleV + "/" + driverV;
        await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.status == "SUCCESS") {
              setAssignedRoutes(res.data)
              setOverlapSchedules(res.OverlapSchedules || 0)
            } else {
              sweetAlert("Error", "Error al cargar Rutas Asignadas", "error")
            }
          })
          .catch(() => {
            sweetAlert("Error", "Error al cargar Rutas Asignadas", "error")
          });
      };
      fetchData();
    }, [driverV, vehicleV]);
    return (
      <>
        <Dialog
          open={open}
          maxWidth={"lg"}
          fullWidth={true}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Asignacion de Rutas
          </DialogTitle>
          <DialogContent>
            {overlapSchedules > 0 && <Alert severity="warning">Existe un Tope Horario de {overlapSchedules} Ruta/s</Alert>}
            <Grid container spacing={6} sx={{ mt: 1 }} justifyContent="space-around">
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="1">Conductor</InputLabel>
                  <Select
                    labelId="1"
                    id="1"
                    value={driverV}
                    label="Age"
                    onChange={(e) => {
                      setDriverV(e.target.value)
                    }}
                  >
                    <MenuItem key={0} value={0}>Sin Asignar</MenuItem>;
                    {
                      driver.map(function (i) {
                        return <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>;
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="2">Vehiculo</InputLabel>
                  <Select
                    labelId="2"
                    id="2"
                    value={vehicleV}
                    label="Age"
                    onChange={(e) => {
                      setVehicleV(e.target.value)
                    }}
                  >

                    <MenuItem key={0} value={0}>Sin Asignar</MenuItem>;
                    {
                      vehicle.map(function (i) {
                        return <MenuItem key={i.id} value={i.id}>{i.plate}</MenuItem>;
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <DialogTitle id="responsive-dialog-title">
              Rutas Asignadas
            </DialogTitle>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead className='table-head'>
                  <TableRow>
                    <TableCell align="center">Nombre</TableCell>
                    <TableCell align="center">Hora</TableCell>
                    <TableCell align="center">Tiempo</TableCell>
                    <TableCell align="center"><LocationOnIcon /></TableCell>
                    <TableCell align="center">Acción</TableCell>
                    <TableCell align="center">Conductor</TableCell>
                    <TableCell align="center">Vehiculo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={"subHead"} key={"actualRouteTR"}>
                    <TableCell align="center" colSpan={7}><p>Ruta Actual</p></TableCell >
                  </TableRow>
                  <TableRow className={"row-v2"} key={"actualRoute"}>
                    <TableCell align="center">{actualRoute.route_name}</TableCell >
                    <TableCell align="center">{actualRoute.starts_at} - {actualRoute.ends_at}</TableCell >
                    <TableCell align="center">{actualRoute.travel_time}</TableCell >
                    <TableCell align="center">{actualRoute.total_stops}</TableCell >
                    <TableCell align="center">{actualRoute.action}</TableCell >
                    <TableCell align="center">{actualRoute.driver_name || "Sin Asignar"}</TableCell >
                    <TableCell align="center">{actualRoute.vehicle_plate || "Sin Asignar"}</TableCell >
                  </TableRow>
                  <TableRow className={"subHead"} key={"assignedRow"}>
                    <TableCell align="center" colSpan={7}><p>Rutas Asignadas</p></TableCell >
                  </TableRow>
                  {assignedRoutes.map((row, index) => (
                    <TableRow className={index % 2 === 0 ? "row-v1" : "row-v2"} key={index}>
                      <TableCell align="center">{row.route_name}</TableCell >
                      <TableCell align="center">{row.starts_at} - {row.ends_at}</TableCell >
                      <TableCell align="center">{row.travel_time}</TableCell >
                      <TableCell align="center">{row.total_stops}</TableCell >
                      <TableCell align="center">{row.action}</TableCell >
                      <TableCell align="center">{row.driver_name || "Sin Asignar"}</TableCell >
                      <TableCell align="center">{row.vehicle_plate || "Sin Asignar"}</TableCell >
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={() => (assignRoute(driverV, vehicleV, routeId))} disabled={overlapSchedules > 0} autoFocus>
              Asignar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
  //Se cargaran la lista de rutas y vehiculos
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      const url = "/loadRoutes/" + state.organizationId;
      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.status == "SUCCESS") {
            setData(res.data)
            setLoad(false);
          } else {
            sweetAlert("Error", "Error al cargar Rutas", "error")
            setLoad(false);
          }
        })
        .catch(() => {
          sweetAlert("Error", "Error al cargar Rutas", "error")
          setLoad(false);
        });
    };
    fetchData();
  }, [state.organizationId, recharge]);

  useEffect(() => {
    const fetchData = async () => {
      const url = "/loadVehicleDriver/" + state.organizationId;
      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.status == "SUCCESS") {
            setVehicle(res.cbxVehicle)
            setDriver(res.cbxDriver)
          } else {
            sweetAlert("Error", "Error al cargar Vehiculos o Conductores", "error")
          }
        })
        .catch(() => {
          sweetAlert("Error", "Error al cargar Vehiculos o Conductores", "error")
        });
    };
    fetchData();
  }, [state.organizationId, recharge]);
  //Retornara el Estado de la ruta
  const returnStatus = (status) => {
    switch (status) {
      case "0":
        return "Disponible"
      case "1":
        return "Enviada"
      default:
        return "Valor No Registraado"
    }
  }

  //Retornara El mensaje de asignacion
  const returnAsignation = (driver, vehicle) => {
    let existsV = vehicle === null ? false : true
    let existsD = driver === null ? false : true
    switch (true) {
      case existsV && existsD:
        return driver + " / " + vehicle;
      case !existsV && !existsD:
        return "Sin Asignar";
      case existsV || existsD:
        return vehicle || driver;
      default:
        return "No Asignado";
    }
  }
  return (
    load ? (
      <CircularProgress />
    )
      :
      (
        <Grid container justifyContent="center">
          <Grid container item direction="row" justifyContent="space-between" alignItems="stretch" sx={{ mt: 3, ml: 2, mr: 2 }}>
            <Grid container item justifyContent="space-between" xs={12} height={"380px"} spacing={2} sx={{ mb: 8 }}>
              <Grid item xs={8}>
                <Grid container alignItems={"center"}>
                  <ArrowBackIcon className='icons' fontSize="large" color="primary" onClick={() => { navigate(-1) }} />
                  <h2 style={{ marginLeft: "30px" }}>RUTAS</h2>
                </Grid>
                <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                    <TableHead className='table-head'>
                      <TableRow>
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Hora</TableCell>
                        <TableCell align="center">Tiempo</TableCell>
                        <TableCell align="center"><LocationOnIcon /></TableCell>
                        <TableCell align="center">Acción</TableCell>
                        <TableCell align="center">Estado Ruta</TableCell>
                        <TableCell align="center">Asignacion</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      {data.map((row, index) => (
                        <TableRow className={index % 2 === 0 ? "row-v1" : "row-v2"} key={index}>
                          <TableCell align="center">{row.route_name}</TableCell >
                          <TableCell align="center">{row.starts_at} - {row.ends_at}</TableCell >
                          <TableCell align="center">{row.travel_time}</TableCell >
                          <TableCell align="center">{row.total_stops}</TableCell >
                          <TableCell align="center">{row.action}</TableCell >
                          <TableCell align="center">{returnStatus(row.status)}</TableCell >
                          <TableCell align="center">
                            <Button variant="outlined" key={index} sx={{ width: "70%" }}
                              onClick={() => (handleClickOpen(row))}>
                              {returnAsignation(row.driver_name, row.vehicle_plate)}
                            </Button>
                          </TableCell >
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item container xs={4} justifyContent={"center"} alignItems={"center"}>
                {isLoaded ? <Map /> : <CircularProgress />}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TimeLineComp organizationId={state.organizationId} />
            </Grid>
            <DialogComponent />
          </Grid>
        </Grid>
      )
  );
};

const route1 = [
  { lat: -33.510191, lng: -70.757234 },
  { lat: -33.509100, lng: -70.769637 },
  { lat: -33.503553, lng: -70.765860 },
  { lat: -33.503625, lng: -70.757363 },
]

const route2 = [
  { lat: -33.510191, lng: -70.757234 },
  { lat: -33.511783, lng: -70.757835 },
  { lat: -33.520085, lng: -70.757448 },
]

function optionsList(color) {
  return ({
    fillColor: color,
    fillOpacity: 0.2,
    strokeColor: color,
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1
  }
  )
}


function Map() {
  return (
    <GoogleMap zoom={14} center={{ lat: -33.510191, lng: -70.757234 }} mapContainerClassName="map-container">
      {route1.map((i, index) => (
        <Marker key={"route1" + index} position={i} icon={{ url: require("../assets/images/LocationRed.png") }} />
      ))}
      {route2.map((i, index) => (
        <Marker key={"route2" + index} position={i} icon={{ url: require("../assets/images/LocationBlue.png") }} />
      ))}
      <Polygon
        paths={route1}
        key={1}
        options={optionsList("red")}
      />
      <Polygon
        paths={route2}
        key={2}
        options={optionsList("#5eacef")}
      />
    </GoogleMap>
  )
}



