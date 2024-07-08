import "./App.css";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Inventorydetailscity from "./Inventorydetailscity";
import EditInventorydetails from "./EditInventorydetails";
import CardetailsInventory from "./CardetailsInventory";
import AddInventory from "./AddInventory";
import AddCar from "./AddCar";
import Editcardetails from "./Editcardetails";
import AllInventory from "./AllInventory";
import AllCars from "./AllCars";
import Contactus from "./Contactus";
import Soldcar from "./Soldcar";
import AllSoldcar from "./AllSoldcar";
import AllCity from "./AllCity";
import AddCity from "./AddCity";
import TableCityDetailsInventory from "./TableCityDetailsInventory";
import Home from "./Home";

const drawerWidth = 240;

const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <MenuIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            CARMART
          </Typography>
          <Box sx={{ width: 48 }} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button component={Link} to="/">
              <i class="bi bi-house-door mx-2"></i>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/addInventory">
              <i class="bi bi-house-add mx-2"></i>
              <ListItemText primary="Add Inventory" />
            </ListItem>
            <ListItem button component={Link} to="/allinventory">
              <i class="bi bi-list mx-2"></i>
              <ListItemText primary="All Inventory" />
            </ListItem>
            <ListItem button component={Link} to="/allcars">
              <i class="bi bi-car-front mx-2"></i>
              <ListItemText primary="All Cars" />
            </ListItem>
            <ListItem button component={Link} to="/allsoldcar">
              <i class="bi bi-tag mx-2"></i>
              <ListItemText primary="All Sold Cars" />
            </ListItem>
            <ListItem button component={Link} to="/allcity">
              <i class="bi bi-buildings mx-2"></i>
              <ListItemText primary="All City" />
            </ListItem>
            <ListItem button component={Link} to="/addcity">
              <i class="bi bi-building-add mx-2"></i>
              <ListItemText primary="Add City" />
            </ListItem>
            <ListItem button component={Link} to="/contactus">
              <i class="bi bi-telephone mx-2"></i>
              <ListItemText primary="Contact Us" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: open ? 0 : 0,
        }}
      >
        <Toolbar />
        <Typography paragraph>
          <Routes>
            <Route
              exact
              path="/inventorybycity/:id"
              element={<Inventorydetailscity />}
            />
            <Route
              exact
              path="/editinventory/:id/:pin"
              element={<EditInventorydetails />}
            />
            <Route
              exact
              path="/cardetailsbyinventory/:id"
              element={<CardetailsInventory />}
            />
            <Route exact path="/addInventory" element={<AddInventory />} />
            <Route exact path="/addcar/:id/:pin" element={<AddCar />} />
            <Route exact path="/editcar/:id" element={<Editcardetails />} />
            <Route exact path="/allinventory" element={<AllInventory />} />
            <Route exact path="/allcars" element={<AllCars />} />
            <Route exact path="/contactus" element={<Contactus />} />
            <Route exact path="/soldcar/:id/:invenno/:modelofcar/:type/:colour" element={<Soldcar />} />
            <Route exact path="/allsoldcar" element={<AllSoldcar />} />
            <Route exact path="/allcity" element={<AllCity />} />
            <Route exact path="/addcity" element={<AddCity />} />
            <Route exact path="/tablecityinventory" element={<TableCityDetailsInventory />} />
            <Route exact path="/" element={<Home />} />
          </Routes>
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
