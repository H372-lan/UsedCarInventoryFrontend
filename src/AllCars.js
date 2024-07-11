import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { FilterList } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Chip, Drawer, Grid, Typography } from "@mui/material";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function AllCars() {
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selctedFilters, SetSelectedFilters] = useState({
    typeOfCar: [],
    make: [],
    color: [],
  });
  const [activateFilters, setActivateFilters] = useState([]);
  const [alertmessage, setAlertmessage] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const [cardetails, setCardetails] = useState([]);

  const filteredCarDetails = cardetails.filter((item) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      (item.typeOfCar && item.typeOfCar.toLowerCase().includes(searchTerm)) ||
      (item.color && item.color.toLowerCase().includes(searchTerm)) ||
      (item.pincode && item.pincode.toLowerCase().includes(searchTerm)) ||
      (item.model && item.model.toLowerCase().includes(searchTerm)) ||
      (item.make && item.make.toLowerCase().includes(searchTerm)) ||
      (item.inventoryNumber.toString() &&
        item.inventoryNumber.toString().includes(searchTerm)) ||
      (item.saleNo.toString() && item.saleNo.toString().includes(searchTerm));

    const matchesFilters =
      (selctedFilters.typeOfCar.length===0
        ||  selctedFilters.typeOfCar.includes(item.typeOfCar)
        ) &&
      (selctedFilters.color.length===0 || selctedFilters.color.includes(item.color)) &&
      (selctedFilters.make.length===0 || selctedFilters.make.includes(item.make));
    return matchesSearch && matchesFilters;
  });
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };
  // const handleFilterChange = (type, value) => {
  //   SetSelectedFilters((prev) => ({ ...prev, [type]: value }));
  //   setActivateFilters((prev) => [...prev, { type, value }]);
  //   setPage(0);
  // };
  const handleFilterChange = (type, value) => {
      SetSelectedFilters((prev) => {
        const newValues=prev[type].includes(value)?prev[type].filter((v)=>v !== value):
        [...prev[type], value];
      return{...prev,[type]:newValues} });
      setActivateFilters((prev) => {
        const newFilters=prev.some((filter)=>filter.type===type && filter.value===value)?prev.filter((filter)=>!(filter.type===type &&filter.value=== value))
      :[...prev,{type,value}] ;
    return newFilters;});
      setPage(0);
    };

  const handleToggleDrawer = (event) => {
    setDrawerOpen(!drawerOpen);
  };
  const handleResetFilters = () => {
    SetSelectedFilters({ typeOfCar: [], color: [], make: [] });
    setActivateFilters([]);
  };
  const handleRemoveFilters = (type, value) => {
    SetSelectedFilters((prev) => ({ ...prev, [type]: prev[type].filter((v)=>v !==value), }));
    setActivateFilters((prev) =>
      prev.filter((filter) => !(filter.type === type && filter.value === value))
    );
  };

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    const result = await axios.get("http://localhost:8080/readall/cars");
    const resultsdata = result.data;
    const sortedData = resultsdata.sort((a, b) => a.kmDriven - b.kmDriven);
    setCardetails(sortedData);
  };

  const deleteCar = async (id) => {
    await axios.delete(`http://localhost:8080/delete/car/${id}`);
    setAlertmessage({ type: "success", text: "Deleted Successfully" });
    setTimeout(() => {
      setAlertmessage(null);
    }, 1000);
    loadCars();
  };
  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };
  const handleMouseleave = () => {
    setHoveredRow(null);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredCarDetails.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  if (cardetails.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#797474" }}>
        {" "}
        No cars are Present inside any Inventory
      </p>
    );
  }

  const uniqueTypes = [...new Set(cardetails.map((item) => item.typeOfCar))];
  const uniqueColors = [...new Set(cardetails.map((item) => item.color))];
  const uniqueMakes = [...new Set(cardetails.map((item) => item.make))];
  return (
    <>
      <div>
        {alertmessage && (
          <div
            style={{
              position: "fixed",
              top: "70px",
              left: "58%",
              transform: "translateX(-50%)",
              width: "80%",
              maxWidth: "90%",
              textAlign: "center",
            }}
          >
            <div
              className={`alert alert-${alertmessage.type} alert-dismissable fade show`}
              role="alert"
            >
              {alertmessage.text}
            </div>
          </div>
        )}
        <h4 className="mb-5" style={{ color: "#112466", textAlign: "center" }}>
          List of All Cars in Inventory
        </h4>
        <Box sx={{ display: "flex", flexWrap: "wrap", marginBottom: 2 }}>
          {activateFilters.map((filter, index) => (
            <Chip
              key={index}
              label={`${filter.type}:${filter.value}`}
              onDelete={() => handleRemoveFilters(filter.type, filter.value)}
              deleteIcon={<CloseIcon />}
              sx={{ margin: 0.5 }}
            />
          ))}
        </Box>
        <Drawer anchor="right" open={drawerOpen} onClose={handleToggleDrawer}>
          <Box sx={{ width: 300, padding: 2, marginTop: 6 }}>
            <Typography className="my-4" variant="h6">
              Filter Options
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" className="fw-bold mb-3 my-2">
                  Type
                </Typography>
                {uniqueTypes.map((typeOfCar) => (
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "50px",
                      margin: 0.5,
                      borderBlockColor: "#A8A6A6",
                      color: "#000000",
                    }}
                    onClick={() => handleFilterChange("typeOfCar", typeOfCar)}
                  >
                    {typeOfCar}
                  </Button>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" className="fw-bold mb-3 my-4">
                  Color
                </Typography>
                {uniqueColors.map((color) => (
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "50px",
                      margin: 0.5,
                      borderBlockColor: "#A8A6A6",
                      color: "#000000",
                    }}
                    onClick={() => handleFilterChange("color", color)}
                  >
                    {color}
                  </Button>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" className="fw-bold mb-3 my-4">
                  Make
                </Typography>

                {uniqueMakes.map((make) => (
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "50px",
                      margin: 0.5,
                      borderBlockColor: "#A8A6A6",
                      color: "#000000",
                    }}
                    onClick={() => handleFilterChange("make", make)}
                  >
                    {make}
                  </Button>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Button
                  className="mx-3 my-3"
                  variant="contained"
                  color="secondary"
                  onClick={handleResetFilters}
                >
                  {" "}
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleToggleDrawer}
                >
                  {" "}
                  Close
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Drawer>
      </div>
      <TableContainer component={Paper} style={{ margin: "auto" }}>
        <div class="input-group" style={{ display: "flex" }}>
          <div class="form-outline" data-mdb-input-init>
            <input
              type="search"
              id="form1"
              class="form-control m-3"
              placeholder="Search"
              onChange={(e) => {
                handleSearchChange(e);
              }}
            />
          </div>
          <IconButton className="mx-4" onClick={handleToggleDrawer}>
            <FilterList color="primary" />
          </IconButton>
        </div>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <thead style={{ backgroundColor: "#1976d2", height: "50px" }}>
            <tr>
              <th scope="row" style={{ textAlign: "center" }}>
                Salesno
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Inventory Number
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Km Driven
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                MFD
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Type
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Color
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Milage
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Make
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Model
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Pincode
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Action
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Soldcar
              </th>
            </tr>
          </thead>

          <TableBody>
            {(rowsPerPage > 0
              ? filteredCarDetails.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredCarDetails
            ).map((row, index) => (
              <TableRow
                key={index + 1}
                style={
                  hoveredRow === index ? { backgroundColor: "#E2DEDE" } : {}
                }
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseleave()}
              >
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.saleNo}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.inventoryNumber}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.kmDriven}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.mfd}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.typeOfCar}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.color}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.milage}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.make}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.model}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.pincode}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  <Link to={`/editcar/${row.saleNo}`}>
                    <i class="bi bi-pencil-square mx-4"></i>
                  </Link>
                  <Link>
                    <i
                      class="bi bi-trash"
                      style={{ color: "red" }}
                      onClick={() => deleteCar(row.saleNo)}
                    ></i>
                  </Link>
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  <Link
                    to={`/soldcar/${row.saleNo}/${row.inventoryNumber}/${row.model}/${row.typeOfCar}/${row.color}/${row.make}`}
                  >
                    <button type="button" class="btn btn-success">
                      Sell
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter style={{ position: "absolute", right: "25px" }}>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={filteredCarDetails.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Link onClick={handleGoBack}>
        <i
          class="bi bi-arrow-left-circle"
          style={{
            color: "#848080",
            position: "fixed",
            bottom: "20px",
            paddingRight: "250",
            fontSize: "40px",
          }}
        ></i>
      </Link>
    </>
  );
}
