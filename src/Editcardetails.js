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
    inventorynumber: "",
    kmdriven: "",
    mfd: "",
    typeofcar: "",
    color: "",
    milage: "",
    model: "",
    pincode: "",
  });
  const {
    inventorynumber,
    kmdriven,
    mfd,
    typeofcar,
    color,
    milage,
    model,
    pincode,
  } = cardetails;

  const onInputChange = (e) => {
    setCardetails({ ...cardetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadCar();
    fetchinventories();
    fetchpincodefrominventorynumber();
  }, [inventorynumber]);
  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8080/update/car${id}`, cardetails);
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
      setInventoriesdatanum(response.data);
    } catch (error) {
      console.error("error data", error);
    }
  };
  const fetchpincodefrominventorynumber = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/pincodefrominventorynumber${inventorynumber}`
      );
      setCardetails({ ...cardetails, pincode: response.data });
    } catch (error) {
      console.error("error data", error);
    }
  };

  const loadCar = async () => {
    const result = await axios.get(`http://localhost:8080/read/car${id}`);
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
            <div className="mb-1">
              <label htmlFor="Rollno" className="form-label"></label>

              <select
                class="form-select"
                aria-label="Default select example"
                name="inventorynumber"
                value={inventorynumber}
                onChange={(e) => onInputChange(e)}
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
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter KM Driven"
                name="kmdriven"
                value={kmdriven}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Mfd of Car"
                name="mfd"
                value={mfd}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Type of Car"
                name="typeofcar"
                value={typeofcar}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter color of car"
                name="color"
                value={color}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Milage of Car"
                name="milage"
                value={milage}
                onChange={(e) => onInputChange(e)}
              />
            </div>

            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter model"
                name="model"
                value={model}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control my-4"
                placeholder="pincode"
                name="pincode"
                value={pincode}
                onChange={(e) => onInputChange(e)}
                readOnly
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
