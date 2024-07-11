import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Editcardetails() {
  let navigate = useNavigate();
  const [alertmessage, setAlertmessage] = useState(null);
  const [inventoriesdatanum, setInventoriesdatanum] = useState([]);

  const handleGoBack = () => {
    navigate(-1);
  };
  const { id } = useParams();
  const [cardetails, setCardetails] = useState({
    inventoryNumber: "",
    kmDriven: "",
    mfd: "",
    typeOfCar: "",
    color: "",
    milage: "",
    model: "",
    pincode: "",
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
  } = cardetails;
  const [errors, setErrors] = useState({
    inventoryNumber: "",
    kmDriven: "",
    mfd: "",
    typeOfCar: "",
    color: "",
    milage: "",
    model: "",
  });

  const onInputChange = (e) => {
    setCardetails({ ...cardetails, [e.target.name]: e.target.value });
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
        if (!/^[0-9_]+$/.test(value)) {
          error = "KmDriven Can not conatin special character";
        }

        delete errors.typeOfCar;
      } else if (name === "typeOfCar") {
        if (!/^[a-zA-Z_]+$/.test(value)) {
          error = "Type Of Car Can not Contain special Character";
        }

        delete errors.typeOfCar;
      } else if (name === "color") {
        if (!/^[a-zA-Z_]+$/.test(value)) {
          error = "Color Can not Contain special Character";
        }

        delete errors.color;
      } else if (name === "milage") {
        if (!/^[1-9_]+$/.test(value)) {
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

  useEffect(() => {
    loadCar();
    fetchinventories();
  }, []);
  useEffect(() => {
    fetchpincodefrominventorynumber();
  }, [inventoryNumber]);
  const onSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(cardetails).forEach((key) => {
      if (!cardetails[key]) {
        validationErrors[key] = "This fiels is required";
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await axios.put(`http://localhost:8080/update/car/${id}`, cardetails);
    setAlertmessage({ type: "success", text: "Successfully Updated" });
    setTimeout(() => {
      setAlertmessage(null);
      handleGoBack();
    }, 1000);
  };
  const fetchinventories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/allinventorynumber"
      );
      setInventoriesdatanum(response.data.sort());
    } catch (error) {
      console.error("error data", error);
    }
  };
  const fetchpincodefrominventorynumber = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/pincodefrominventorynumber/${inventoryNumber}`
      );
      setCardetails({ ...cardetails, pincode: response.data });
    } catch (error) {
      console.error("error data", error);
    }
  };

  const loadCar = async () => {
    const result = await axios.get(`http://localhost:8080/read/car/${id}`);
    setCardetails(result.data);
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
          <h2 className="text-center m-4">Edit Car</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                InventoryNo
              </label>
              <div className="col-sm-9">
                <select
                  class="form-select"
                  aria-label="Default select example"
                  name="inventoryNumber"
                  value={inventoryNumber}
                  onChange={(e) => onInputChange(e)}
                  onBlur={onBlur}
                  required
                >
                  <option selected value={""}>
                    {" "}
                    Select Inventory
                  </option>
                  {inventoriesdatanum.map((invenno) => (
                    <option key={invenno} value={invenno}>
                      {invenno}
                    </option>
                  ))}
                </select>
                {errors.inventoryNumber && (
                  <div
                    className="position-absolute text-danger"
                    style={{ fontSize: "10px", textAlign: "left" }}
                  >
                    <i class="bi bi-exclamation-circle-fill mx-2"></i>
                    {errors.inventoryNumber}
                  </div>
                )}
              </div>
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                KmDriven
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control my-1"
                  placeholder="Enter KM Driven"
                  name="kmDriven"
                  value={kmDriven}
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                MFD
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control my-1"
                  placeholder="Enter Mfd of Car"
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                Type
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control my-1"
                  placeholder="Enter Type of Car"
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                Color
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control my-1"
                  placeholder="Enter color of car"
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                Milage
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control my-1"
                  placeholder="Enter Milage of Car"
                  name="milage"
                  value={milage}
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                Model
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control my-1"
                  placeholder="Enter model"
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
            </div>
            <div className="my-4 row">
              <label
                className="col-sm-2 col-form-label"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#0B5A8A",
                }}
              >
                Pincode
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control my-1"
                  placeholder="pincode"
                  name="pincode"
                  value={pincode}
                  onChange={(e) => onInputChange(e)}
                  disabled
                  readOnly
                />
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
