import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Paper from '@mui/material/Paper';
import Swal from 'sweetalert2';
import {Link} from "react-router-dom";
import withReactContent from 'sweetalert2-react-content'

export default function Organization() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const MySwal = withReactContent(Swal)

  //funcion para parametirar sweet aelrt
  const sweetAlert =  (title, textHtml, icon) => {
    MySwal.fire({
      title: <strong>{title}</strong>,
      html: textHtml,
      icon: icon
    })
  }

  //Se cargaran los datos de las organizaciones
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      const url = "/loadOrganizations";
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
            sweetAlert("Error","Error al cargar Organizaciones","error")
            setLoad(false);
          }
        })
        .catch(() => {
          sweetAlert("Error","Error al cargar Organizaciones","error")
          setLoad(false);
        });
    };
    fetchData();
  }, []);


  return (
    load ? (
      <CircularProgress />
    )
      :
      (
        <>
          <h1>Lista Organizaciones</h1>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead className='table-head'>
                <TableRow>
                  <TableCell align="center">Nombre Organizacion</TableCell>
                  <TableCell align="center">Vehiculos Asignados</TableCell>
                  <TableCell align="center">Conductores Asignados</TableCell>
                  <TableCell align="center">Rutas Asignados</TableCell>
                  <TableCell align="center">Opciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                
                {data.map((row, index) => (
                  <TableRow className={index % 2 === 0 ? "row-v1" : "row-v2"} key={index}>
                    <TableCell align="center">{row.name}</TableCell >
                    <TableCell align="center">{row.vehicles_number}</TableCell >
                    <TableCell align="center">{row.routes_number}</TableCell >
                    <TableCell align="center">{row.drivers_number}</TableCell >
                    <TableCell align="center">
                    <Link
                      to="/Rutas"
                      state={{ organizationId: row.id }}
                    >
                      <VisibilityIcon className='icons' fontSize="large" color="primary"/>
                    </Link>
                    </TableCell >
                  </TableRow>

                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )

  );
}
