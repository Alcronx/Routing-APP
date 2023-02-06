import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Organization from "./components/organization";
import RoutesC from "./components/routesC";
import Layout from "./layout";


//Una vez creado el div Routing-app, se cargara toda la logica
ReactDOM.createRoot(document.getElementById("Routing-app")).render(
  //<React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Este es el componente padra */}
        <Route path="/" element={<Layout />}>
          {/* Aqui se cargaran las rutas hijas que heredaran todo de Layout */}
          <Route index element={<Organization />} />
          <Route path="/Rutas" element={<RoutesC/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  //</React.StrictMode>
);




