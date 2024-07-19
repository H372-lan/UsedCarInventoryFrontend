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

export default function Contactus() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const [contactdetails, setContactdetails] = useState([]);
  const filteredContactDetails = contactdetails.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      (item[0].toString() && item[0].toString().includes(searchTerm)) ||
      (item[1] && item[1].includes(searchTerm)) ||
      (item[2] && item[2].includes(searchTerm))
    );
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    const result = await axios.get("http://localhost:8080/allcontactdetails");
    setContactdetails(result.data);
  };
  
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - contactdetails.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  if (contactdetails.length === 0) {
    return <p style={{ textAlign: "center", color: "#797474" }}> No Details</p>;
  }

  return (
    <>
      <div>
        <h4 className="mb-5" style={{ color: "#112466" }}>
          Contact List of Inventory
        </h4>
      </div>
      <TableContainer
        component={Paper}
        // sx={{ minWidth: 500, maxWidth: 1000, margin: "auto" }}
      >
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
        <Table
          sx={{ minWidth: 500}}
          aria-label="custom pagination table"
        >
          <thead style={{ backgroundColor: "#1976d2", height: "50px" }}>
            <tr>
              <th scope="row" style={{ textAlign: "center" }}>
                Inventory Number
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                City
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Pincode
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                LandMark
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Email
              </th>
              <th scope="row" style={{ textAlign: "center" }}>
                Phonenumber
              </th>
            </tr>
          </thead>

          <TableBody>
            {(rowsPerPage > 0
              ? filteredContactDetails.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredContactDetails
            ).map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {item[0]}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {item[1]}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {item[2]}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {item[3]}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {item[4]}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {item[5]}
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={filteredContactDetails.length}
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
