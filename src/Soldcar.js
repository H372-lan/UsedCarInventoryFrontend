import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Soldcar() {
  let navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const { id, invenno, modelofcar, type, colour } = useParams();
  const [alertmessage, setAlertmessage] = useState(null);

  const [soldcardetails, setSoldcardetails] = useState({
    inventorynumber: invenno,
    model: modelofcar,
    typeofcar: type,
    color: colour,
    adharnumber: "",
    ownername: "",
    email: "",
    phonenumber: "",
    sellingdate: "",
  });
  const {
    inventorynumber,
    model,
    typeofcar,
    color,
    adharnumber,
    ownername,
    email,
    phonenumber,
    sellingdate,
  } = soldcardetails;
  const onInputChange = (e) => {
    setSoldcardetails({ ...soldcardetails, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`http://localhost:8080/soldcardata${id}`,soldcardetails);
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
          <h2 className="text-center m-2">Sold car</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Inventory Number"
                name="inventorynumber"
                value={inventorynumber}
                onChange={(e) => onInputChange(e)}
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                readOnly
              />
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Model"
                name="model"
                value={model}
                onChange={(e) => onInputChange(e)}
                readOnly
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                required
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
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                readOnly
                required
              />
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Color"
                name="color"
                value={color}
                onChange={(e) => onInputChange(e)}
                style={{
                  backgroundColor: "#EFECEC",
                  outline: "none",
                  boxShadow: "none",
                }}
                readOnly
                required
              />
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter adhar number"
                name="adharnumber"
                value={adharnumber}
                pattern="[0-9]{12}"
                maxlength="12"
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter owner name"
                name="ownername"
                value={ownername}
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
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="tel"
                className="form-control my-4"
                placeholder="Enter Phonenumber"
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
                type="date"
                className="form-control my-4"
                placeholder="Enter  selling date"
                name="sellingdate"
                value={sellingdate}
                onChange={(e) => onInputChange(e)}
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
