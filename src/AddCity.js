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
    cityname: "",
    statename: "",
    country: "",
  });

  const { pincode, cityname, statename, country } = cityadd;
  const onInputChange = (e) => {
    setCityadd({ ...cityadd, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
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
      } else if (data.includes("Already Present")) {
        setAlertmessage({
          type: "danger",
          text: "Entered City is alredy present",
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
        <div className=" col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-2">Add City</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-2">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Pincode"
                name="pincode"
                value={pincode}
                pattern="[0-9]{6}"
                maxlength="6"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-2">
              <input
                type="tel"
                className="form-control my-4"
                placeholder="Enter country"
                name="country"
                value={country}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Statename"
                name="statename"
                value={statename}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter Cityname"
                name="cityname"
                value={cityname}
                onChange={(e) => onInputChange(e)}
              />
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
