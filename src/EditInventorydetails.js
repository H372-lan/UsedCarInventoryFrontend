import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditInventorydetails() {
  let navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const { id, pin } = useParams();
  const [alertmessage, setAlertmessage] = useState(null);
  const [pincodes, setPincodes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [inventorydetails, setInventorydetails] = useState({
    pincode: pin,
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

  const { pincode, nearByLocation, phoneNumber, email } = inventorydetails;
  const { cityName, stateName, country } = location;
  const onInputChange = (e) => {
    setInventorydetails({
      ...inventorydetails,
      [e.target.name]: e.target.value,
    });
  };
  const onLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "country") {
      setStates([]);
      setCities([]);
      setPincodes([]);
    } else if (name === "stateName") {
      setCities([]);
      setPincodes([]);
    } else if (name === "cityName") {
      setPincodes([]);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);
  const handlepincodeChange = (event) => {
    setInventorydetails({ ...inventorydetails, pincode: event.target.value });
  };

  useEffect(() => {
    const fetchPincodeData = async () => {
      if (pincode) {
        try {
          const response = await axios.get(
            `http://localhost:8080/alldatafrompincode/${pincode}`
          );
          if (response.data && response.data.length > 0) {
            const { state_name, country, city_name } = response.data[0];
            setLocation({
              stateName: state_name,
              country: country,
              cityName: city_name,
            });
          }
        } catch (e) {
          if (pincode.length > 0 && pincode.length < 6) {
            setLocation({
              stateName: "",
              country: "",
              cityName: "",
            });
          }
        }
      }
    };
    fetchPincodeData();
  }, [pincode]);
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
  const onSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(inventorydetails).forEach((key) => {
      if (!inventorydetails[key]) {
        validationErrors[key] = "This fiels is required";
      }
    });
    Object.keys(location).forEach((key) => {
      if (!location[key]) {
        validationErrors[key] = "This fiels is required";
      }
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/update/inventory/${id}`,
        inventorydetails
      );
      setAlertmessage({ type: "success", text: "Updated Successfully" });
      setTimeout(() => {
        setAlertmessage(null);
        handleGoBack();
      }, 1000);
    } catch (error) {
      setAlertmessage({ type: "danger", text: "Enter Valid Data" });
      setTimeout(() => {
        setAlertmessage(null);
        window.location.reload();
      }, 1000);
    }
  };
  const loadInventory = async () => {
    const result = await axios.get(
      `http://localhost:8080/read/inventory/${id}`
    );
    setInventorydetails(result.data);
    setInventorydetails((prevInventory) => ({
      ...prevInventory,
      pincode: pin,
    }));
  };
  useEffect(() => {
    const fetchallcountriesdata = async () => {
      try {
        const response = await axios.get("http://localhost:8080/allcountries");
        setCountries(response.data.sort());
      } catch (error) {
        console.error("error data", error);
      }
    };
    fetchallcountriesdata();
  }, []);

  useEffect(() => {
    const fetchstatefromcountry = async () => {
      if (country) {
        try {
          const response = await axios.get(
            `http://localhost:8080/allstatesfromcountry/${country}`
          );
          setStates(response.data);
        } catch (error) {
          console.error("error data", error);
        }
      }
    };

    const fetchcityfromstate = async () => {
      if (stateName) {
        try {
          const response = await axios.get(
            `http://localhost:8080/allcitiesfromstate/${stateName}/${country}`
          );
          setCities(response.data.sort());
        } catch (error) {
          console.error("error data", error);
        }
      }
    };
    const fetchpincodesfromcities = async () => {
      if (cityName) {
        try {
          const response = await axios.get(
            `http://localhost:8080/allpincodefromcity/${cityName}/${stateName}`
          );
          setPincodes(response.data.sort());
        } catch (error) {
          console.error("error data", error);
        }
      }
    };
    fetchstatefromcountry();
    fetchcityfromstate();
    fetchpincodesfromcities();
  }, [country, stateName, cityName]);

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
          <h2 className="text-center m-2">Edit Inventory</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                Country
              </label>
              <div className="col-sm-10">
                <select
                  className="form-select my-1"
                  aria-label="Default select example"
                  name="country"
                  value={country}
                  onChange={(e) => onLocationChange(e)}
                  onBlur={onBlur}
                  required
                >
                  <option className="dropdown-item" selected value={""}>
                    {" "}
                    Select Country
                  </option>
                  {countries.map((country) => (
                    <option
                      key={country}
                      value={country}
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#333",
                        padding: "10px",
                        borderRadius: "5px",
                        transition: "background-color 0.3s ease",
                        height: "20px",
                      }}
                    >
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <div
                    className="position-absolute text-danger"
                    style={{ fontSize: "10px" }}
                  >
                    <i class="bi bi-exclamation-circle-fill mx-2"></i>
                    {errors.country}
                  </div>
                )}
              </div>
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                State
              </label>
              <div className="col-sm-10">
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
                  {states.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                City
              </label>
              <div className="col-sm-10">
                <select
                  className="form-select my-1"
                  aria-label="Default select example"
                  name="cityName"
                  value={cityName}
                  onChange={(e) => onLocationChange(e)}
                  required
                  disabled={!stateName || !country}
                  onBlur={onBlur}
                >
                  <option selected value={""}>
                    {" "}
                    Select City
                  </option>
                  {cities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                Pincode
              </label>
              <div className="col-sm-10">
                <select
                  className="form-select my-1"
                  aria-label="Default select example"
                  name="pincode"
                  value={pincode}
                  onChange={(e) => {
                    handlepincodeChange(e);
                  }}
                  required
                  disabled={!cityName || !stateName || !cityName}
                  onBlur={onBlur}
                >
                  <option selected value={pincodes.includes(pin) ? pin : ""}>
                    {pincodes.includes(pin) ? pin : " Select pincode"}
                  </option>
                  {pincodes
                    .filter((pincode) => pincode !== pin)
                    .map((pincode) => (
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                Landmark
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control my-1"
                  placeholder="Enter Landmark"
                  name="nearByLocation"
                  value={nearByLocation}
                  onChange={(e) => onInputChange(e)}
                  required
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                PhoneNo
              </label>
              <div className="col-sm-10">
                <input
                  type="tel"
                  className="form-control my-1"
                  placeholder="Enter Phone Number"
                  name="phoneNumber"
                  value={phoneNumber}
                  pattern="[0-9]{10}"
                  maxlength="10"
                  onChange={(e) => onInputChange(e)}
                  required
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                EmailId
              </label>
              <div className="col-sm-10">
                <input
                  type="email"
                  className="form-control my-1"
                  placeholder="Enter Email Address"
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
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Update
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
