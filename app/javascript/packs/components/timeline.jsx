import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title"
};

export default function TimeLineComp(props) {
  const organizationId = props.organizationId
  const MySwal = withReactContent(Swal)
  const date = new Date();
  const [groups,setGroups] = useState([])
  const [items,setItems] = useState([])
  //Aqui se manejan las alertas
  const sweetAlert = (title, textHtml, icon) => {
    MySwal.fire({
      title: <strong>{title}</strong>,
      html: textHtml,
      icon: icon
    })
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
  //Obtendra los datos de la base de datos
  useEffect(() => {
    const fetchData = async () => {
      const url = "/loadTimeLine/" + organizationId;
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
            loadDataTimeline(res.data)
          } else {
            sweetAlert("Error", "Error al cargar Linea de Tiempo", "error")
          }
        })
        .catch(() => {
          sweetAlert("Error", "Error al cargar Linea de Tiempo", "error")
        });
    };
    fetchData();
  }, [organizationId]);

  //Cargara los datos de la timeLine
  const loadDataTimeline = (data) => {
    const groupsD = data.map((row) => (
      { id: row.id_route, title: row.route_name }
    ));
    const itemsD = data.map((row) => {
      const newDate = new Date();
      const dateStart = new Date(row.starts_at);
      const hoursStart = dateStart.getHours();
      const minutesStart = dateStart.getMinutes();
      const dateEnd = new Date(row.ends_at);
      const hoursEnd  = dateEnd.getHours();
      const minutesEnd  = dateEnd.getMinutes();
      return {
        id: row.id_route,
        group: row.id_route,
        color: "white",
        title: returnAsignation(row.driver_name, row.vehicle_plate),
        className: "routeAsignation",
        start: newDate.setHours(hoursStart, minutesStart, 0, 0),
        end: newDate.setHours(hoursEnd, minutesEnd, 0, 0),
        canMove: false,
        canResize: false,
        canChangeGroup: false
      }
    });
    setGroups(groupsD)
    setItems(itemsD)
  }
  

  

  const itemRender = ({ item, itemContext, getItemProps }) => {
    return (
      <div
        {...getItemProps({
          style: {
            color: item.color,
            borderRadius: 4
          }
        })}
      >
        <div
          className="ripple"
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "1rem",
            marginLeft: "1rem"
          }}
        >
          {itemContext.title}
        </div>
      </div>
    );
  };
  return (
    <Timeline
      keys={keys}
      items={items}
      groups={groups}
      style={{ width: '100%' }}
      sidebarContent="Rutas"
      lineHeight={75}
      itemRenderer={itemRender}
      visibleTimeStart={date.setHours(0, 0, 0, 0)}
      visibleTimeEnd={date.setHours(24, 0, 0, 0)}
      itemHeightRatio={0.75}
      showHeader={false}
    />
  );
}
