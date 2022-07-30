
// Form used to create & edit reservations.

import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ form, handleChange, handleSubmit }) {
  const history = useHistory();

  // returning form elements

  // includes
  /*

  first name
  last name
  phone number or best contract number
  reservation date
  reservation time
  size of the party attending

  */

  return (
    <form className="d-flex flex-column" onSubmit={handleSubmit}>
      <label htmlFor="first_name">
        First Name:
        <input
          className="form-control my-2"
          name="first_name"
          value={form["first_name"]}
          type="text"
          onChange={handleChange}
        />
      </label>
      <label htmlFor="last_name">
        Last Name:
        <input
          className="form-control my-2"
          name="last_name"
          value={form["last_name"]}
          type="text"
          onChange={handleChange}
        />
      </label>
      <label htmlFor="mobile_number">
        Phone Number:
        <input
          className="form-control my-2"
          name="mobile_number"
          value={form["mobile_number"]}
          placeholder="(---) --- ----"
          type="tel"
          onChange={handleChange}
        />
      </label>
      <label htmlFor="reservation_date">
        Reservation Date:
        <input
          className="form-control my-2"
          name="reservation_date"
          value={form["reservation_date"]}
          pattern="\d{4}-\d{2}-\d{2}"
          placeholder="YYYY-MM-DD"
          type="date"
          onChange={handleChange}
        />
      </label>
      <label htmlFor="reservation_time">
        Reservation Time:
        <input
          className="form-control my-2"
          name="reservation_time"
          value={form["reservation_time"]}
          pattern="[0-9]{2}:[0-9]{2}"
          placeholder="HH:MM"
          type="time"
          onChange={handleChange}
        />
      </label>
      <label htmlFor="people">
        Party Size:
        <input
          className="form-control my-2"
          name="people"
          value={form["people"]}
          min={1}
          placeholder={1}
          type="number"
          onChange={handleChange}
        />
      </label>
      <div className="d-flex justify-content-center m-2">
        <button className="btn btn-success mx-4" type="submit">
          Submit
        </button>
        <button className="btn btn-danger" onClick={() => history.goBack()}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ReservationForm;
