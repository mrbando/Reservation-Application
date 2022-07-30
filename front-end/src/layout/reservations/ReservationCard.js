
// ReservationCard is used for displaying a reservation on the dashboard.

import React, { useState } from "react";
import { updateStatus } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationCard({ reservation }) {
  const [showError, setShowError] = useState(null);

  // For canceling a reservation at the dashboard.
  async function handleCancel(event) {
    event.preventDefault();
    event.stopPropagation();
    const abortController = new AbortController();
    const message =
      "Canceling a reservation cannot be undone. Continue?";
    if (window.confirm(message)) {
      try {
        await updateStatus(
          reservation.reservation_id,
          "cancelled",
          abortController.signal
        );
        window.location.reload(true);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
  }

  // Returning our card elements.
  return (
    <div className="border d-flex flex-row p-2 align-items-center">
      <p className="d-flex mx-auto p-4"><span style={{fontWeight: 'bold'}}>Name: </span> {reservation.first_name} {reservation.last_name}</p>
      <p className="d-flex mx-auto p-4"><span style={{fontWeight: 'bold'}}>Phone: </span>{reservation.mobile_number}</p>
      <p className="d-flex mx-auto p-4"><span style={{fontWeight: 'bold'}}>Reservation Size: </span>{reservation.people}</p>
      <p className="d-flex mx-auto p-4"><span style={{fontWeight: 'bold'}}>{reservation.reservation_date} at {reservation.reservation_time}</span></p>
      <p data-reservation-id-status={reservation.reservation_id} className="d-flex mx-auto p-4"><span style={{fontWeight: 'bold'}}>{reservation.status}</span></p>
      <div className="pull-right d-flex flex-row align-items-center p-2">
        <ErrorAlert error={showError} />
        {reservation.status === "booked" ? (
          <button className="btn btn-success my-3 mr-4 px-5 py-2 mx-4 ">
            <a
              href={`/reservations/${reservation.reservation_id}/seat`}
              style={{ color: "white", textDecoration: "none" }}
            >
              Seat
            </a>
          </button>
        ) : null}
        <button className="btn btn-warning px-3 py-2 mx-1">
          <a
            href={`/reservations/${reservation.reservation_id}/edit`}
            style={{ color: "white", textDecoration: "none" }}
          >
            Edit
          </a>
        </button>
        <button
          className="btn btn-danger mx-3 px-3 py-2 mx-1"
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ReservationCard;
