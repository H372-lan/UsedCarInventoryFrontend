import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddInventory() {
  let navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const [alertmessage, setAlertmessage] = useState(null);
  const [inventoryadd, setInventoryadd] = useState({
    pincode: "",
    nearbylocation: "",
    phonenumber: "",
    email: "",
  });
  const [location, setLocation] = useState({
    cityname: "",
    statename: "",
    country: "",
  });
  const [pincodes, setPincodes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { pincode, nearbylocation, phonenumber, email } = inventoryadd;
  const { cityname, statename, country } = location;
  const onInputChange = (e) => {
    setInventoryadd({ ...inventoryadd, [e.target.name]: e.target.value });
  };
  const onLocationChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    fetchallcountriesdata();
    fetchstatefromcountry();
    fetchcityfromstate();
    fetchpincodesfromcities();
  }, [country, statename, cityname]);
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "http://localhost:8080/addinventory",
        inventoryadd
      );
      const data = response.data;
      if (data.includes("Sucessfully Inventory Created")) {
        setAlertmessage({ type: "success", text: "Registration Successful" });
        setTimeout(() => {
          window.location.reload();
          setAlertmessage(null);
        }, 1000);
      } else {
        const space = data.split(":");
        const data1 = space[0];
        setAlertmessage({ type: "danger", text: data1 });
        setTimeout(() => {
          setAlertmessage(null);
        }, 2000);
      }
    } catch (error) {
      setAlertmessage({ type: "danger", text: "Enter Valid Data" });
      setTimeout(() => {
        window.location.reload();
        setAlertmessage(null);
      }, 1000);
    }
  };

  const fetchallcountriesdata = async () => {
    try {
      const response = await axios.get("http://localhost:8080/allcountries");
      setCountries(response.data);
    } catch (error) {
      console.error("error data", error);
    }
  };

  const fetchstatefromcountry = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/allstatesfromcountry${country}`
      );
      setStates(response.data);
    } catch (error) {
      console.error("error data", error);
    }
  };

  const fetchcityfromstate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/allcitiesfromstate${statename}/${country}`
      );
      setCities(response.data);
    } catch (error) {
      console.error("error data", error);
    }
  };
  const fetchpincodesfromcities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/allpincodefromcity${cityname}/${statename}`
      );
      setPincodes(response.data);
    } catch (error) {
      console.error("error data", error);
    }
  };

  return (
    <div className="container">
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
      <div className="row" style={{ textAlign: "center" }}>
        <div className=" col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-2">Add Inventory </h2>

          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-1">
              
              <select
                className="form-select my-4"
                aria-label="Default select example"
                name="country"
                value={country}
                onChange={(e) => onLocationChange(e)}
                required
              >
                <option selected value={""}>
                  {" "}
                  Select Country
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-1">
             

              <select
                className="form-select my-4"
                aria-label="Default select example"
                name="statename"
                value={statename}
                onChange={(e) => onLocationChange(e)}
                required
                disabled={!country}
              >
                <option selected value={""}>
                  {" "}
                  Select State
                </option>
                {states.map((statename) => (
                  <option key={statename} value={statename}>
                    {statename}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-1">
              

              <select
                className="form-select my-4"
                aria-label="Default select example"
                name="cityname"
                value={cityname}
                onChange={(e) => onLocationChange(e)}
                required
                disabled={!statename}
              >
                <option selected value={""}>
                  {" "}
                  Select City
                </option>
                {cities.map((cityname) => (
                  <option key={cityname} value={cityname}>
                    {cityname}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-1">
              

              <select
                className="form-select my-4"
                aria-label="Default select example"
                name="pincode"
                value={pincode}
                onChange={(e) => onInputChange(e)}
                required
                disabled={!cityname}
              >
                <option selected value={""}>
                  {" "}
                  Select Pincode
                </option>
                {pincodes.map((pincode) => (
                  <option key={pincode} value={pincode}>
                    {pincode}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-1">
              
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Near by location"
                name="nearbylocation"
                value={nearbylocation}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              
              <input
                type="tel"
                className="form-control my-4"
                placeholder="Enter Phone number"
                name="phonenumber"
                value={phonenumber}
                pattern="[0-9]{10}"
                maxlength="10"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control my-4"
                placeholder="Enter Your Email Id"
                name="email"
                value={email}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button type="submit" className="btn btn-outline-success">
              Add
            </button>
            <Link
              className="btn btn-outline-danger mx-2"
              onClick={handleGoBack}
            >
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
