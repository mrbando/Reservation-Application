
// Search feature to find reservation via their mobile_number.

import React, { useEffect, useState } from "react";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationCard from "./ReservationCard";

function Search() {

  // Starts with a blank canvas for mobile_number.
  const initial = {
    mobile_number: "",
  };

  // Form state 
  const [form, setForm] = useState(initial);
  // Reservation query
  const [reservations, setReservations] = useState([]);
  // Error state displayer
  const [showError, setShowError] = useState(null);

  // Page effect to set inital standards.
  useEffect(() => {
    const initialState = {
      mobile_number: "",
    };
    setForm(initialState);
    setReservations([]);
  }, []);

  // automatically updates when target is changed.
  function handleChange({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  // Handle submissions.
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const searchParameters = {
      mobile_number: form.mobile_number,
    };
    setForm(initial);
    setShowError(null);
    try {
      const response = await listReservations(
        searchParameters,
        abortController.signal
      );
      setReservations(response);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => abortController.abort();
  }

  // Maps over all results that map the search query.
  const searchResults =
    reservations.length > 0
      ? reservations.map((reservation) => (
          <ReservationCard
            key={reservation.reservation_id}
            reservation={reservation}
          />
        ))
      : "No reservations found!";


  // Displays the search bar and submit... mapped under is the search results.
  return (
    <div className="container fluid mt-4">
      <p className="h2 text-center">SEARCH CONTACT NUMBER</p>
      <form className="d-flex flex-column my-4" onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">
          <span style={{fontWeight: 'bold'}}>Enter Reservation Contact Number</span>
          <input
            className="form-control my-2"
            name="mobile_number"
            type="tel"
            onChange={handleChange}
          />
        </label>
        <button className="btn btn-warning" type="submit">
        <span style={{fontWeight: 'bold'}}>Find</span>
        </button>
      </form>
      <ErrorAlert error={showError} />
      <div className="text-center"><span style={{fontWeight: 'bold'}}>{searchResults}</span></div>
    </div>
  );
}

export default Search;
