import { CardContent, Divider, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import axios from "axios";
const Home = () => {
  const [values, setValues] = useState({
    api1: [],
    api2: [],
    api3: [],
    api4: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get("http://localhost:8080/readall/cars");
        const response2 = await axios.get(
          "http://localhost:8080/readall/inventory"
        );
        const response3 = await axios.get(
          "http://localhost:8080/citywithcountofinventory"
        );
        const response4 = await axios.get(
          "http://localhost:8080/allsolddetails"
        );
        setValues({
          api1: response1.data.length,
          api2: response2.data.length,
          api3: response3.data.length,
          api4: response4.data.length,
        });
      } catch (error) {
        console.error("There was an error in fetching data");
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
          <Card
            sx={{
              minWidth: 200,
              maxWidth: 275,
              backgroundColor: "#4dc3ff",
            }}
          >
            <CardContent>
              <Typography variant="h4" component="div" color="white">
                {values.api1}{" "}
                <i
                  class="bi bi-car-front-fill"
                  style={{
                    fontSize: "40px",
                    marginLeft: "170px",
                    color: "#808080",
                  }}
                ></i>
              </Typography>
              <Typography variant="body2" color="white">
                Total Cars
              </Typography>
            </CardContent>
            <div style={{ backgroundColor: "#1ab2ff" }}>
              <Divider
                style={{ margin: "10px 0", backgroundColor: "#991f00" }}
              />
              <Link
                to={"/allcars"}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "5",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ marginBottom: "10px" }}>
                    More Info <i class="bi bi-arrow-right-circle"></i>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
          <Card
            sx={{
              minWidth: 200,
              maxWidth: 275,
              backgroundColor: "#00cc00",
            }}
          >
            <CardContent>
              <Typography variant="h4" component="div" color="white">
                {values.api2}{" "}
                <i
                  class="bi bi-house-add"
                  style={{
                    fontSize: "40px",
                    marginLeft: "150px",
                    color: "#808080",
                  }}
                ></i>
              </Typography>
              <Typography variant="body2" color="white">
                Total Inventory
              </Typography>
            </CardContent>
            <div style={{ backgroundColor: "#009900" }}>
              <Divider
                style={{ margin: "10px 0", backgroundColor: "#991f00" }}
              />
              <Link
                to={"/allinventory"}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "5",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ marginBottom: "10px" }}>
                    More Info <i class="bi bi-arrow-right-circle"></i>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
          <Card
            sx={{
              minWidth: 200,
              maxWidth: 275,
              backgroundColor: "#ff9900",
            }}
          >
            <CardContent>
              <Typography variant="h4" component="div" color="white">
                {values.api3}{" "}
                <i
                  class="bi bi-buildings"
                  style={{
                    fontSize: "40px",
                    marginLeft: "150px",
                    color: "#808080",
                  }}
                ></i>
              </Typography>
              <Typography variant="body2" color="white">
                Total Cities
              </Typography>
            </CardContent>
            <div style={{ backgroundColor: "#cc7a00" }}>
              <Divider
                style={{ margin: "10px 0", backgroundColor: "#991f00" }}
              />
              <Link
                to={"/tablecityinventory"}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "5",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ marginBottom: "10px" }}>
                    More Info <i class="bi bi-arrow-right-circle"></i>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
          <Card
            sx={{
              minWidth: 200,
              maxWidth: 275,
              backgroundColor: "#ff3300",
            }}
          >
            <CardContent>
              <Typography variant="h4" component="div" color="white">
                {values.api4}{" "}
                <i
                  class="bi bi-tag"
                  style={{
                    fontSize: "40px",
                    marginLeft: "160px",
                    color: "#808080",
                  }}
                ></i>
              </Typography>
              <Typography variant="body2" color="white">
                Total Sold Cars
              </Typography>
            </CardContent>
            <div style={{ backgroundColor: "#b32400" }}>
              <Divider
                style={{ margin: "10px 0", backgroundColor: "#991f00" }}
              />
              <Link
                to={"/allsoldcar"}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "5",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ marginBottom: "10px" }}>
                    More Info <i class="bi bi-arrow-right-circle"></i>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default Home;
