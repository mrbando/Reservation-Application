
// Form for creating a new reservation using ReservationForm.

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";

function NewReservation() {
  
  // initial form state variables.
  const initial = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 0,
    reservation_date: "",
    reservation_time: "",
    status: "",
  };

  // initial form state.
  const [form, setForm] = useState({ ...initial });
  // Manages if an error is displayed via state.
  const [showError, setShowError] = useState(false);
  const abortController = new AbortController();
  const history = useHistory();

  // formats time to correctly POST
  function timeReplace(time) {
    let newTime = time.split("");
    newTime.splice(5);
    newTime = newTime.join("");
    return newTime;
  }

  // formats date to correctly POST
  function dateReplace(date) {
    let newDate = date.split("");
    newDate.splice(10);
    newDate = newDate.join("");
    return newDate;
  }

  // Change form state changes
  function handleChange({ target }) {
    const { name, value } = target;
    // correctly relays information changed through validation functions.
    switch (name) {
      case "people":
        setForm({ ...form, [name]: parseInt(value) });
        break;
      case "reservation_date":
        setForm({ ...form, [name]: dateReplace(value) });
        break;
      case "reservation_time":
        setForm({ ...form, [name]: timeReplace(value) });
        break;
      default:
        setForm({ ...form, [name]: value });
        break;
    }
  }

  // Submission handler for form.
  async function handleSubmit(event) {
    event.preventDefault();
    setShowError(false);
    // Places information to post in a object.
    const newRes = {
      first_name: form.first_name,
      last_name: form.last_name,
      mobile_number: form.mobile_number,
      people: Number(form.people),
      reservation_date: form.reservation_date,
      reservation_time: form.reservation_time,
      status: "booked",
    };
    // Sends request via API.
    try {
      await createReservation(newRes, abortController.signal);
      setForm(initial);
      history.push(`/dashboard?date=${newRes.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => {
      abortController.abort();
    };
  }

  // Displays results.
  return (
    <div className="container fluid">
      <h3 className="my-3 text-center">NEW RESERVATION</h3>
      <ErrorAlert error={showError} />
      <ReservationForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NewReservation;
