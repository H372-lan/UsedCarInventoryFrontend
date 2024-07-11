import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AddCar() {
  let navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const [alertmessage, setAlertmessage] = useState(null);
  const { id, pin } = useParams();
  const [caradd, setCaradd] = useState({
    inventoryNumber: id,
    kmDriven: "",
    mfd: "",
    typeOfCar: "",
    color: "",
    milage: "",
    model: "",
    pincode: pin,
  });
  const [errors, setErrors] = useState({
    kmDriven: "",
    mfd: "",
    typeOfCar: "",
    color: "",
    milage: "",
    model: "",
  });

  const {
    inventoryNumber,
    kmDriven,
    mfd,
    typeOfCar,
    color,
    milage,
    model,
    pincode,
  } = caradd;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setCaradd({ ...caradd, [name]: value });
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
      if (name === "kmDriven") {
        if (!/^[0-9]+$/.test(value)) {
          error = "KmDriven Can not conatin special character";
        }

        delete errors.typeOfCar;
      } else if (name === "typeOfCar") {
        if (!/^[a-zA-Z]+$/.test(value)) {
          error = "Type Of Car Can not Contain special Character";
        }

        delete errors.typeOfCar;
      } else if (name === "color") {
        if (!/^[a-zA-Z]+$/.test(value)) {
          error = "Color Can not Contain special Character";
        }

        delete errors.color;
      } else if (name === "milage") {
        if (!/^[0-9]+$/.test(value)) {
          error = "Milage Can not Contain special Character";
        }

        delete errors.milage;
      } else if (name === "model") {
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Model Can not Contain special Character";
        }

        delete errors.model;
      }
    }
    return error;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(caradd).forEach((key) => {
      if (!caradd[key]) {
        validationErrors[key] = "This fiels is required";
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/addcar", caradd);
      const data = response.data;
      if (data.includes("Sucessfully Car Created")) {
        setAlertmessage({
          type: "success",
          text: "Car Registered Succesfully",
        });
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
        <div className=" col-md-6 offset-md-3 border rounded p-2 mt-1 shadow">
          <h2 className="text-center m-1">Add Car</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                name="inventoryNumber"
                value={inventoryNumber}
                onChange={(e) => onInputChange(e)}
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
                name="pincode"
                value={pincode}
                onChange={(e) => onInputChange(e)}
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
                placeholder="Enter KM driven"
                name="kmDriven"
                value={kmDriven}
                pattern="\d{1,6}"
                maxlength="6"
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.kmDriven && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.kmDriven}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="date"
                className="form-control my-1"
                placeholder="Enter MFD date In(yyyy-mm-dd)"
                name="mfd"
                value={mfd}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.mfd && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.mfd}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter type of Car"
                name="typeOfCar"
                value={typeOfCar}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.typeOfCar && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.typeOfCar}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter Color Of car"
                name="color"
                value={color}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.color && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.color}
                </div>
              )}
            </div>
            <div className="my-4">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter Your Car Milage"
                name="milage"
                value={milage}
                pattern="\d{1,3}"
                maxlength="3"
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.milage && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.milage}
                </div>
              )}
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control my-1"
                placeholder="Enter Model Name"
                name="model"
                value={model}
                onChange={(e) => onInputChange(e)}
                onBlur={onBlur}
              />
              {errors.model && (
                <div
                  className="position-absolute text-danger"
                  style={{ fontSize: "10px", textAlign: "left" }}
                >
                  <i class="bi bi-exclamation-circle-fill mx-2"></i>
                  {errors.model}
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
