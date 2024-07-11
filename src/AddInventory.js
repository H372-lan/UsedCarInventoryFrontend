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
    nearByLocation: "",
    phoneNumber: "",
    email: "",
  });
  const [location, setLocation] = useState({
    cityName: "",
    stateName: "",
    country: "",
  });
  const [errors, setErrors] = useState({
    cityName: "",
    stateName: "",
    country: "",
    pincode: "",
    nearByLocation: "",
    phoneNumber: "",
    email: "",
  });
  const [pincodes, setPincodes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { pincode, nearByLocation, phoneNumber, email } = inventoryadd;
  const { cityName, stateName, country } = location;
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryadd({ ...inventoryadd, [name]: value });
  };
  const onBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "This Field is Required";
    } else {
      if (name === "nearByLocation") {
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "This Field Can not contain special character";
        }

        delete errors.nearByLocation;
      } else if (name === "phoneNumber") {
        if (!/^[0-9]{10}$/.test(value)) {
          error = "PhoneNumber must contain 10 digits";
        }

        delete errors.phoneNumber;
      } else if (name === "email") {
        if (!/^[a-z0-9.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value)) {
          error = "EmailId is Not Valid";
        }

        delete errors.email;
      }
    }
    return error;
  };
  const onLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation({ ...location, [name]: value });
  };
  useEffect(() => {
    fetchallcountriesdata();
    fetchstatefromcountry();
    fetchcityfromstate();
    fetchpincodesfromcities();
  }, [country, stateName, cityName]);
  const onSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(inventoryadd).forEach((key) => {
      if (!inventoryadd[key]) {
        validationErrors[key] = "This fiels is required";
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
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
      setCountries(response.data.sort());
    } catch (error) {
      console.error("error data", error);
    }
  };

  const fetchstatefromcountry = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/allstatesfromcountry/${country}`
      );
      setStates(response.data.sort());
    } catch (error) {
      console.error("error data", error);
    }
  };

  const fetchcityfromstate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/allcitiesfromstate/${stateName}/${country}`
      );
      setCities(response.data.sort());
    } catch (error) {
      console.error("error data", error);
    }
  };
  const fetchpincodesfromcities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/allpincodefromcity/${cityName}/${stateName}`
      );
      setPincodes(response.data.sort());
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
            <div className="my-4">
              <select
                className="form-select my-1"
                aria-label="Default select example"
                name="country"
                value={country}
                onChange={(e) => onLocationChange(e)}
                onBlur={onBlur}
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
              {errors.country && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.country}
                </div>
              )}
            </div>
            <div className="my-4">
              <select
                className="form-select my-1"
                aria-label="Default select example"
                name="stateName"
                value={stateName}
                onChange={(e) => onLocationChange(e)}
                required
                disabled={!country}
                onBlur={onBlur}
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
              {errors.stateName && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.stateName}
                </div>
              )}
            </div>

            <div className="my-4">
              <select
                className="form-select my-1"
                aria-label="Default select example"
                name="cityName"
                value={cityName}
                onChange={(e) => onLocationChange(e)}
                required
                disabled={!stateName}
                onBlur={onBlur}
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
              {errors.cityName && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.cityName}
                </div>
              )}
            </div>
            <div className="my-4">
              <select
                className="form-select my-1"
                aria-label="Default select example"
                name="pincode"
                value={pincode}
                onChange={(e) => onInputChange(e)}
                required
                onBlur={onBlur}
                disabled={!cityName}
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
              {errors.pincode && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.pincode}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter Near by location"
                name="nearByLocation"
                value={nearByLocation}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.nearByLocation && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.nearByLocation}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="tel"
                className="form-control my-1"
                placeholder="Enter Phone number"
                name="phoneNumber"
                value={phoneNumber}
                pattern="[0-9]{10}"
                maxlength="10"
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.phoneNumber && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.phoneNumber}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="email"
                className="form-control my-1"
                placeholder="Enter Your Email Id"
                name="email"
                value={email}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.email && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.email}
                </div>
              )}
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
