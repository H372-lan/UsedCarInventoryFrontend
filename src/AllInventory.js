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

export default function AllInventory() {
  const [search, setSearch] = useState("");
  const [alertmessage, setAlertmessage] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [hoveredRow, setHoveredRow] = useState(null);

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const [inventorydetails, setInventorydetails] = useState([]);

  const filteredInventoryDetails = inventorydetails.filter((item) => {
    const searchTerm = search.toLowerCase();

    return (
      (item.city.cityname &&
        item.city.cityname.toLowerCase().includes(searchTerm)) ||
      (item.city.statename &&
        item.city.statename.toLowerCase().includes(searchTerm)) ||
      (item.city.pincode &&
        item.city.pincode.toLowerCase().includes(searchTerm)) ||
      (item.nearbylocation &&
        item.nearbylocation.toLowerCase().includes(searchTerm)) ||
      (item.inventorynumber.toString() &&
        item.inventorynumber.toString().includes(searchTerm))
    );
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get("http://localhost:8080/readall/inventory");
    const inventorydetails = result.data;
    const updateddata = await Promise.all(
      inventorydetails.map(async (item) => {
        try {
          const carResponse = await axios.get(
            `http://localhost:8080/allcardetailswithuniquecode${item.inventorynumber}`
          );
          return { ...item, carCount: carResponse.data.length };
        } catch (carError) {
          return { ...item, carCount: 0 };
        }
      })
    );
    const sortedData = updateddata.sort((a, b) => b.carCount - a.carCount);
    setInventorydetails(sortedData);
  };

  const deleteVehicle = async (id) => {
    const response = await axios.delete(
      `http://localhost:8080/delete/inventory${id}`
    );
    const data = response.data;
    if (data.includes("Can not delete")) {
      setAlertmessage({
        type: "danger",
        text: "Can not delete it as it contains Cars ",
      });
      setTimeout(() => {
        setAlertmessage(null);
      }, 2000);
    } else if (data.includes("Successsfully Deleted")) {
      setAlertmessage({ type: "success", text: "Successfully Deleted " });
      setTimeout(() => {
        setAlertmessage(null);
      }, 1000);
    }
    loadUsers();
  };
  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };
  const handleMouseleave = () => {
    setHoveredRow(null);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredInventoryDetails.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (inventorydetails.length === 0) {
    return (
      <>
        <p style={{ textAlign: "center", color: "#797474" }}>
          {" "}
          No Inventory Present
        </p>
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
          List of All Inventories
        </h4>
        <div class="input-group">
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
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <thead style={{ backgroundColor: "#1976d2", height: "50px" }}>
            <tr>
              <th scope="row" style={{ textAlign: "center" }}>
                Inventory Number
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Pincode
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Country
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                State
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                City
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Near Landmark
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Phonenumber
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Total Cars
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                More
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Action
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Add Car
              </th>
            </tr>
          </thead>

          <TableBody>
            {(rowsPerPage > 0
              ? filteredInventoryDetails.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredInventoryDetails
            ).map((row, index) => (
              <TableRow
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
                  {row.inventorynumber}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.city.pincode}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.city.country}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.city.statename}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.city.cityname}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.nearbylocation}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.phonenumber}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.carCount}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  <Link to={`/cardetailsbyinventory/${row.inventorynumber}`}>
                    <i class="bi bi-three-dots"></i>
                  </Link>
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  <Link
                    to={`/editinventory/${row.inventorynumber}/${row.city.pincode}`}
                  >
                    <i class="bi bi-pencil-square mx-4"></i>
                  </Link>
                  <i
                    class="bi bi-trash"
                    style={{ color: "red" }}
                    onClick={() => deleteVehicle(row.inventorynumber)}
                  ></i>
                  {/* </Link> */}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  <Link
                    to={`/addcar/${row.inventorynumber}/${row.city.pincode}`}
                  >
                    <i
                      class="bi bi-plus-circle"
                      style={{ color: "#10E2AC" }}
                    ></i>
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
                count={filteredInventoryDetails.length}
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
      <Link to={"/addInventory"}>
        <i
          class="bi bi-plus-circle-fill"
          style={{
            color: "#1976d2",
            position: "fixed",
            bottom: "20px",
            left: "95%",
            fontSize: "40px",
          }}
        ></i>
      </Link>
    </>
  );
}