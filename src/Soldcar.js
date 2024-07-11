import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Soldcar() {
  let navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const { id, invenno, modelofcar, type, colour,maker } = useParams();
  const [alertmessage, setAlertmessage] = useState(null);

  const [soldcardetails, setSoldcardetails] = useState({
    inventoryNumber: invenno,
    model: modelofcar,
    typeOfCar: type,
    color: colour,
    make:maker,
    adharNumber: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    sellingDate: "",
  });
  const {
    inventoryNumber,
    make,
    model,
    typeOfCar,
    color,
    adharNumber,
    ownerName,
    email,
    phoneNumber,
    sellingDate,
  } = soldcardetails;
  const [errors, setErrors] = useState({
    adharNumber: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    sellingDate: "",
  });
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setSoldcardetails({ ...soldcardetails, [name]: value });
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
      if (name === "adharNumber") {
        if (!/^[0-9]{12}$/.test(value)) {
          error = "Adhar Number Should be 12 digit long.";
        }

        
      } else if (name === "ownerName") {
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          error = "This Field Can Not Contain Special Character";
        }

      } else if (name === "email") {
        if (!/^[a-z0-9.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value)) {
          error = "EmailId is not Valid";
        }
        
      } else if (name === "phoneNumber") {
        if (!/^[0-9]{10}$/.test(value)) {
          error = "PhoneNumber must contain 10 digits";
        }
      }
    }
    return error;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(soldcardetails).forEach((key) => {
      if (!soldcardetails[key]) {
        validationErrors[key] = "This fiels is required";
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/soldcardata/${id}`,
        soldcardetails
      );
      const data = response.data;
      if (data.includes("Car Solded Successfully")) {
        setAlertmessage({ type: "success", text: "Car Solded Successfully" });
        setTimeout(() => {
          setAlertmessage(null);
          handleGoBack();
        }, 2000);
      } else {
        const space = data.split(":");
        const data1 = space[0];
        setAlertmessage({ type: "danger", text: data1 });
        setTimeout(() => {
          window.location.reload();
          setAlertmessage(null);
        }, 1000);
      }
    } catch (error) {
      setAlertmessage({ type: "danger", text: "Fill All details" });
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
          <h2 className="text-center m-2">Selling Details</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter Inventory Number"
                name="inventoryNumber"
                value={inventoryNumber}
                
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                readOnly
              />
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter Model"
                name="make"
                value={make}
                
                readOnly
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                required
              />
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter Model"
                name="model"
                value={model}
                
                readOnly
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                required
              />
            </div>

            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter Type of Car"
                name="typeOfCar"
                value={typeOfCar}
               
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                readOnly
                required
              />
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Color"
                name="color"
                value={color}
                
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                readOnly
                required
              />
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter adhar number"
                name="adharNumber"
                value={adharNumber}
                pattern="[0-9]{12}"
                maxlength="12"
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
                required
              />
              {errors.adharNumber && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.adharNumber}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter owner name"
                name="ownerName"
                value={ownerName}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
                required
              />
              {errors.ownerName && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.ownerName}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="email"
                className="form-control my-1"
                placeholder="Enter Email Address"
                name="email"
                value={email}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
                required
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
            <div className="my-4">
              <input
                type="tel"
                className="form-control my-1"
                placeholder="Enter Phonenumber"
                name="phoneNumber"
                value={phoneNumber}
                pattern="[0-9]{10}"
                maxlength="10"
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
                required
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
                type="date"
                className="form-control my-1"
                placeholder="Enter  selling date"
                name="sellingDate"
                value={sellingDate}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
                required
              />
            </div>
            <button type="submit" className="btn btn-outline-success">
              Sold
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
