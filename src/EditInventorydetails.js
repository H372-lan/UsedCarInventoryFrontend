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
    nearbylocation: "",
    phonenumber: "",
    email: "",
  });

  const [location, setLocation] = useState({
    cityname: "",
    statename: "",
    country: "",
  });

  const { pincode, nearbylocation, phonenumber, email } = inventorydetails;
  const { cityname, statename, country } = location;
  const onInputChange = (e) => {
    setInventorydetails({
      ...inventorydetails,
      [e.target.name]: e.target.value,
    });
  };
  const onLocationChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
    setInventorydetails({ ...inventorydetails, pincode: "" });
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
            const { cityname, statename, country } = response.data[0];
            setLocation({
              statename: statename,
              country: country,
              cityname: cityname,
            });
          }
        } catch (e) {
          if (pincode.length > 0 && pincode.length < 6) {
            setLocation({
              statename: "",
              country: "",
              cityname: "",
            });
          }
        }
      }
    };
    setInventorydetails((prevInventory) => ({
      ...prevInventory,
      pincode: pin,
    }));
    fetchPincodeData();
    fetchallcountriesdata();
    fetchstatefromcountry();
    fetchcityfromstate();
    fetchpincodesfromcities();
  }, [country, statename, cityname, pincode]);
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios.put(
        `http://localhost:8080/update/inventory${id}`,
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
    const result = await axios.get(`http://localhost:8080/read/inventory${id}`);
    setInventorydetails(result.data);
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
          <h2 className="text-center m-2">Edit Inventory</h2>
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
                onChange={(e) => {
                  handlepincodeChange(e);
                }}
                required
                disabled={!cityname}
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
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Landmark"
                name="nearbylocation"
                value={nearbylocation}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="mb-1">
              <input
                type="tel"
                className="form-control my-4"
                placeholder="Enter Phone Number"
                name="phonenumber"
                value={phonenumber}
                pattern="[0-9]{10}"
                maxlength="10"
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control my-4"
                placeholder="Enter Email Address"
                name="email"
                value={email}
                onChange={(e) => onInputChange(e)}
              />
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
