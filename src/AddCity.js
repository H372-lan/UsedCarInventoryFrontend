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
      if (name === "pincode") {
        if (!/^\d{6}$/.test(value)) {
          error = "Pincode must contain 6 digit";
        }

        delete errors.pincode;
      } else if (name === "cityName") {
        if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
          error = "CityName Can not Contain special Character";
        }

        delete errors.cityName;
      } else if (name === "stateName") {
        if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
          error = "StateName Can not Contain special Character";
        }

        delete errors.stateName;
      } else if (name === "country") {
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Country Can not Contain special Character";
        }

        delete errors.country;
      }
    }
    return error;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(cityadd).forEach((key) => {
      const error = validateField(key, cityadd[key]);
      if (error) {
        validationErrors[key] = "This fiels is required";
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
                onBlur={onBlur}
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
