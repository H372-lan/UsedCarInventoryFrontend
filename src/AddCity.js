import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddCity() {
  let navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const [alertmessage, setAlertmessage] = useState(null);
  const [cityadd, setCityadd] = useState({
    pincode: "",
    cityName: "",
    stateName: "",
    country: "",
  });
  const [errors, setErrors] = useState({
    pincode: "",
    cityName: "",
    stateName: "",
    country: "",
  });

  const { pincode, cityName, stateName, country } = cityadd;
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setCityadd({ ...cityadd, [name]: value });
    if (name === "pincode" && value.length === 6) {
      fetchPincodeData(value);
    } else if (name === "pincode" && value.length < 6) {
      setCityadd((prev) => ({
        ...prev,
        stateName: "",
        cityName: "",
        country: "",
      }));
    }
  };
  const onBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "Please Enter Valid Pincode";
    } else {
      if (name === "pincode") {
        if (!/^\d{6}$/.test(value)) {
          error = "Pincode must contain 6 digit";
        }
      } else if (["cityName", "stateName", "country"].includes(name)) {
        if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
          error = `${name} Can not Contain special Character`;
        }
      }
    }
    return error;
  };
  const fetchPincodeData = async (pincode) => {
    // if(pincode && !errors.pincode)
    //   {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      if (response.data[0].Status === "Success") {
        const { State, Country, District } = response.data[0].PostOffice[0];
        setCityadd((prev) => ({
          ...prev,
          stateName: State,
          country: Country,
          cityName: District,
        }));
        setErrors((prev) => ({
          ...prev,
          pincode: "",
          stateName: "",
          country: "",
          cityName: "",
        }));
      } else {
        setCityadd((prev) => ({
          ...prev,
          stateName: "",
          cityName: "",
          country: "",
        }));
        setErrors((prev) => ({
          ...prev,
          pincode: "Enter a valid Pincode",
        }));
      }
    } catch (error) {
      console.error("Error");
      setCityadd((prev) => ({
        ...prev,
        stateName: "",
        country: "",
        cityName: "",
      }));
      setErrors((prev) => ({
        ...prev,
        pincode: "Error Fetching Pincode Data",
      }));
    }
  };

  // }
  const onSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(cityadd).forEach((key) => {
      const error = validateField(key, cityadd[key]);
      if (error) {
        validationErrors[key] = "This is Required";
      }
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/addcity",
        cityadd
      );
      const data = response.data;
      if (data.includes("City created Successfully")) {
        setAlertmessage({
          type: "success",
          text: "City Registered Succesfully",
        });
        setTimeout(() => {
          window.location.reload();
          setAlertmessage(null);
        }, 1000);
        setErrors((prevErrors) => ({
          ...prevErrors,
          pincode: "",
          stateName: "",
          country: "",
          cityName: "",
        }));
      } else if (data.includes("Already Present")) {
        setAlertmessage({
          type: "danger",
          text: "Entered City is alredy present",
        });
        setTimeout(() => {
          window.location.reload();
          setAlertmessage(null);
        }, 1000);
        setErrors((prevErrors) => ({
          ...prevErrors,
          pincode: "",
          stateName: "",
          country: "",
          cityName: "",
        }));
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
          <h2 className="text-center m-2">Add City</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-2"
                placeholder="Enter Pincode"
                name="pincode"
                value={pincode}
                pattern="[0-9]{6}"
                maxlength="6"
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
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
                type="tel"
                className="form-control my-2"
                placeholder="Enter country"
                name="country"
                value={country}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
                style={{ backgroundColor: "#ECE8E8" }}
                readOnly
              />
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
              <input
                type="text"
                className="form-control my-2"
                placeholder="Enter Statename"
                name="stateName"
                value={stateName}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
                style={{ backgroundColor: "#ECE8E8" }}
                readOnly
              />
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
              <input
                type="text"
                className="form-control my-2"
                placeholder="Enter Cityname"
                name="cityName"
                value={cityName}
                onChange={(e) => onInputChange(e)}
                style={{ backgroundColor: "#ECE8E8" }}
                onBlur={onBlur}
                readOnly
              />
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
            <button type="submit" className="btn btn-outline-success my-3">
              Add
            </button>
            <Link
              className="btn btn-outline-danger mx-2 my-3"
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
