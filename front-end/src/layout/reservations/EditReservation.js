
// Form for updating reservations.

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";


// Form Function
function EditReservation() {

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

// inital form states
  const [form, setForm] = useState({ ...initial });
// Update error alert state  
  const [showError, setShowError] = useState(false);
  const abortController = new AbortController();
  const history = useHistory();
  const { reservation_id } = useParams();
  const resId = parseInt(reservation_id);

// initializes page using useEffect.
  useEffect(() => {
    const abort = new AbortController();
    const initialReservation = {
      first_name: "",
      last_name: "",
      mobile_number: "",
      people: 0,
      reservation_id: "",
      reservation_date: "",
      reservation_time: "",
      status: "",
    };

  // request to get reservation information.
    async function getReservation() {
      try {
        const response = await readReservation(resId, abort.signal);
        initialReservation.first_name = response.first_name;
        initialReservation.last_name = response.last_name;
        initialReservation.mobile_number = response.mobile_number;
        initialReservation.people = parseInt(response.people);
        initialReservation.reservation_id = parseInt(response.reservation_id);
        initialReservation.reservation_date = dateReplace(
          response.reservation_date
        );
        initialReservation.reservation_time = timeReplace(
          response.reservation_time
        );
        setForm({ ...initialReservation });
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
    getReservation();

    return () => abort.abort();
  }, [resId]);

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

// Submit to update the API to update DB query.
  async function handleSubmit(event) {
    event.preventDefault();
    setShowError(false);
    const updatedRes = {
      first_name: form.first_name,
      last_name: form.last_name,
      mobile_number: form.mobile_number,
      people: Number(form.people),
      reservation_id: resId,
      reservation_date: form.reservation_date,
      reservation_time: form.reservation_time,
      status: "booked",
    };
    // attempts to update via API.
    try {
      await updateReservation(updatedRes, abortController.signal);
      history.push(`/dashboard?date=${updatedRes.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => {
      abortController.abort();
    };
  }

  // Displays form.
  return (
    <div className="container fluid">
      <h3 className="my-3 text-center">EDIT RESERVATION</h3>
      <ErrorAlert error={showError} />
      <ReservationForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default EditReservation;
