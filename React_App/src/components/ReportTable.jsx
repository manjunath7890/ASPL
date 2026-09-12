import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const columns = [
  { id: 'name', label: 'Parameter', minWidth: 170 },
  { id: 'code', label: 'Value', minWidth: 100 },
];

function createData(name, code) {
  return { name, code };
}



function ReportTable({data}) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const rows = [
    createData('Gradient Angle',`${data ? data.avgGradient : '---'} °`),
    createData('Ambient Temperature', `${data ? data.ambTemperature : '---'} °C`),
    createData('High Voltage', `${data ? data.initVoltage : '---'} v`),
    createData('Low Voltage', `${data ? data.finalVoltage : '---'} v`),
    createData('AH Consumed', `${data ? data.AHConsumed : '---'} AH`),
    createData('Battery Cycles', `${data ? data.cycles : '---'} cycles`),
    createData('Battery Fault code', `${data ? data.batteryFault : '---'}`),
    createData('Controller Fault code', `${data ? data.controllerFault : '---'}`),
    createData('Controller Current', `${data ? data.contCurrentAvg: '---'} [${data ? data.contCurrentMax: '---'}] A`),
    createData('Max MOS Temperature', `${data ? data.maxMosTemperature : '---'} °C`),
    createData('High Cell Voltage', `${data ? data.highCellVoltage : '---'} v`),
    createData('Low Cell Voltage', `${data ? data.lowCellVoltage : '---'} v`),
  ];

  return (
      <TableContainer sx={{ width: "100%", overflow: "hidden", height: "100%", borderRadius: "0.5rem" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontSize: "1.3rem",
                    paddingTop: "0.6rem",
                    paddingBottom: "0.6rem",
                    background: colors.palette[300],
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    sx={{ height: "10px" }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            fontSize: "0.9rem",
                            paddingTop: "0.3rem",
                            paddingBottom: "0.3rem",
                          }}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
  );
}

export default ReportTable;
