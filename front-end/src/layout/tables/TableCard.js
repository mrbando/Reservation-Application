

// Table Card:
// How a table is view in the content dashboard.

import React, { useState } from "react";
import { clearTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";


// initial function
function TableCard({ table }) {

  // sets the card to 
  const { capacity, reservation_id, table_id, table_name } = table;
  // ERROR
  const [showError, setShowError] = useState(null);

  // Finish Button Logic
  async function handleClick(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const message =
      "Reset Table? This cannot be undone.";
    setShowError(null);
    if (window.confirm(message)) {
      // attempts API call
      try {
        await clearTable(table_id, abortController.signal);
        window.location.reload(true);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
      return () => abortController.abort();
    }
  }

  // button with handleClick logic
  const buttonSet = reservation_id ? (
    <div>
      <button
        className="btn btn-danger"
        data-table-id-finish={table_id}
        onClick={handleClick}
      >
        <span style={{fontWeight: "bold"}}>RESET THE TABLE</span>
      </button>
    </div>
  ) : ( //Nothing
    <></>
  );

  // Displays the card
  return (
    <div className="border d-flex flex-row justify-content-center align-items-center">
      <ErrorAlert error={showError} />
      <p className="h5 text-center mx-4"><span style={{fontWeight: "bold"}}>TABLE: </span>{table_name}</p>
      <p className="h5 text-center mx-4"><span style={{fontWeight: "bold"}}>SEATS: </span>{capacity}</p>
      <p className="h5 m-3 text-center mx-4" data-table-id-status={table_id}>
        {reservation_id ? "Occupied" : "Free"}
      </p>
      {buttonSet}
    </div>
  );
}

export default TableCard;
