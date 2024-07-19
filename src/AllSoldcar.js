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

export default function AllSoldcar() {
  const [search, setSearch] = useState("");
  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const [soldcardetails, setSoldcardetails] = useState([]);

  const filteredInventoryDetails = soldcardetails.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      (item.saleNo.toString() &&
        item.saleNo.toString().toLowerCase().includes(searchTerm)) ||
        (item.make && item.make.toLowerCase().includes(searchTerm)) ||
      (item.model && item.model.toLowerCase().includes(searchTerm)) ||
      (item.typeOfCar && item.typeOfCar.toLowerCase().includes(searchTerm)) ||
      (item.color && item.color.toLowerCase().includes(searchTerm)) ||
      (item.adharNumber &&
        item.adharNumber.toLowerCase().includes(searchTerm)) ||
      (item.ownerName && item.ownerName.toLowerCase().includes(searchTerm)) ||
      (item.email && item.email.toLowerCase().includes(searchTerm)) ||
      (item.phoneNumber && item.phoneNumber.toLowerCase().includes(searchTerm))
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
    const result = await axios.get("http://localhost:8080/allsolddetails");
    const resultdata = result.data;
    const sortedData = resultdata.sort(
      (a, b) => new Date(b.sellingDate) - new Date(a.sellingDate)
    );
    setSoldcardetails(sortedData);
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
  if (soldcardetails.length === 0) {
    return (
      <>
        <p style={{ textAlign: "center", color: "#797474" }}>
          {" "}
          No cars are Solded
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
        <h4 className="mb-5" style={{ color: "#112466", textAlign: "center" }}>
          List of All Sold Cars
        </h4>
       
      </div>

      <TableContainer component={Paper}>
      <div class="input-group">
          <div class="form-outline" data-mdb-input-init>
            <input
              type="search"
              id="form1"
              class="form-control my-2 m-1"
              placeholder="Search"
              onChange={(e) => {
                handleSearchChange(e);
              }}
            />
          </div>
        </div>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <thead style={{ backgroundColor: "#1976d2", height: "50px" }}>
            <tr>
              <th scope="row" style={{ textAlign: "center" }}>
                Saleno
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Inventory Number
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Make
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Model
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Type
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Color
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Adhar Number
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Ownername
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Email
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Phonenumber
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Selling Date
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
            ).map((row) => (
              <TableRow key={row.name}>
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
                  {row.adharNumber}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.ownerName}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.email}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.phoneNumber}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.sellingDate}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0  && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter style={{ position: "absolute", right: "25px" }}>
            <TableRow>
            {filteredInventoryDetails.length >5 &&(
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
                labelDisplayedRows={({from,to,count})=>`Page ${page+1} of ${Math.ceil(count/rowsPerPage)}`}
              />
            )}
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
