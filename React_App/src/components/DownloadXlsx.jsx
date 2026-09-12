import React from "react";
import { useTheme, Button } from "@mui/material";
import * as XLSX from "xlsx";

import { tokens } from "../theme";

const Xlsx = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function Charging(data, mode) {
    return data.filter((item) => item.v42 === mode);
  }

  const downloadXlsx = async () => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/api/data?date=${props.date}&user=${props.user}&start=${props.start}&end=${props.end}`
      );
      const data = await response.json();
      const filteredData = Charging(data, props.mode);

      const driveHeaders = {
        // date: "date",
        timestamp: "Time",
        // v3: "Vehicle Number",

        v6: "Device status",
        v22: "Battery cycle",
        v47: "Gradient",
        v38: "Watt-Hr/km",
        v23: "Driven Gear",
        v24: "AC current",

        v7: "Controller fault",
        v8: "Battery fault",

        v39: "Speed",
        v40: "Motor RPM",
        v5: "Range",
        v19: "Trip",
        v41: "Total distance",
        v42: "Vehicle status",
        v44: "FNER mode",

        v45: "Controller temperature",
        v46: "Motor temperature",
        v4: "Ambient temperature",
        v11: "MosFET-temperature",
        v13: "Battery temperature 1",
        v14: "Battery temperature 2",
        v15: "Battery temperature 3",
        v16: "Battery temperature 4",

        v32: "SOC",
        v34: "Voltage",
        v33: "Current",
        v9: "Total AH",
        v35: "Remaining AH",
        v36: "Power",
        v37: "Kilo Watt-Hr",
        v17: "Low cell voltage",
        v18: "High cell voltage",

        v49: "Latitude",
        v50: "Longitude",

        v51: "v1",
        v52: "v2",
        v53: "v3",
        v54: "v4",
        v55: "v5",
        v56: "v6",
        v57: "v7",
        v58: "v8",
        v59: "v9",
        v60: "v10",
        v61: "v11",
        v62: "v12",
        v63: "v13",
        v64: "v14",
        v65: "v15",
        v66: "v16",
        v67: "v17",
        v68: "v18",
        v69: "v19",
        v70: "v20",
        v71: "v21",
        v72: "v22",
        v73: "v23",
      };

      const chargingHeaders = {
        // date: "date",
        timestamp: "Time",
        // v3: "Vehicle Number",

        v22: "Battery cycle",

        v8: "Battery fault",

        v4: "Ambient temperature",
        v11: "MosFET-temperature",
        v12: "Charger temperature",
        v13: "Battery temperature 1",
        v14: "Battery temperature 2",
        v15: "Battery temperature 3",
        v16: "Battery temperature 4",

        v32: "SOC",
        v34: "Voltage",
        v33: "Current",
        v9: "Total AH",
        v35: "Remaining AH",
        v36: "Power",
        v37: "Kilo Watt-Hr",
        v17: "Low cell voltage",
        v18: "High cell voltage",

        v51: "v1",
        v52: "v2",
        v53: "v3",
        v54: "v4",
        v55: "v5",
        v56: "v6",
        v57: "v7",
        v58: "v8",
        v59: "v9",
        v60: "v10",
        v61: "v11",
        v62: "v12",
        v63: "v13",
        v64: "v14",
        v65: "v15",
        v66: "v16",
        v67: "v17",
        v68: "v18",
        v69: "v19",
        v70: "v20",
        v71: "v21",
        v72: "v22",
        v73: "v23",
      };

      const groupedData = filteredData.reduce((acc, item) => {
        const key = props.mode === 2 ? item.v22 : item.v22;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      });
      
      const headers = props.mode === 2 ? chargingHeaders : driveHeaders;
 
      for (const [key, group] of Object.entries(groupedData)) {
        const mappedData = group.map((item) => {
          const mappedItem = {};
          for (const [fieldKey, fieldValue] of Object.entries(headers)) {
            if (item[fieldKey] !== undefined) {
              mappedItem[fieldValue] = item[fieldKey];
            }
          }
          return mappedItem;
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(mappedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        const fileName = `${props.fileName}${props.mode === 2 ? 'Ch' : 'Dr'}-${key}.xlsx`; 
        XLSX.writeFile(workbook, fileName);
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant="contained" onClick={downloadXlsx}>
      Download
    </Button>
  );
};

export default Xlsx;
