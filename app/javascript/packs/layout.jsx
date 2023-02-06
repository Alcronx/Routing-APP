import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Link, Outlet } from "react-router-dom";
import Grid from '@mui/material/Grid';


export default function Layout() {
  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar sx={{ ml: 2 }} disableGutters>
          <LocalShippingIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Link
              to="/"
              className="logo"
            >
              Routing-App
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Link
              to="/"
              state={{ idUsuario: "1" }}
              className="linkButton"
            >
              Organizaciones
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Aqui es donde cargaran los componentes hijos */}
      <Grid container justifyContent="center">
        <Grid container sx={{ mt: 3, ml:2, mr:2 }}>
          <Outlet/>
        </Grid>
      </Grid>      
    </>
  );
}
