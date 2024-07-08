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
    inventorynumber: id,
    kmdriven: "",
    mfd: "",
    typeofcar: "",
    color: "",
    milage: "",
    model: "",
    pincode: pin,
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
  } = caradd;

  const onInputChange = (e) => {
    setCaradd({ ...caradd, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
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
            <div className="mb-1">
              
              <input
                type="text"
                className="form-control my-4"
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
            <div className="mb-1">
             
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter KM driven"
                name="kmdriven"
                value={kmdriven}
                pattern="\d{1,6}"
                maxlength="6"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              
              <input
                type="date"
                className="form-control my-4"
                placeholder="Enter MFD date In(yyyy-mm-dd)"
                name="mfd"
                value={mfd}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter type of Car"
                name="typeofcar"
                value={typeofcar}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Color Of car"
                name="color"
                value={color}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-1">
              
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Your Car Milage"
                name="milage"
                value={milage}
                pattern="\d{1,3}"
                maxlength="3"
                onChange={(e) => onInputChange(e)}
              />
            </div>

            <div className="mb-3">
              
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Model Name"
                name="model"
                value={model}
                onChange={(e) => onInputChange(e)}
              />
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
