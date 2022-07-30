
// Displayed to seat a incoming reservation.

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, readReservation, seatReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";


// Initialize the Seat function.
function Seat() {

  // inital table id
  const initial = { table_id: "" };

  // state variables
  const [form, setForm] = useState(initial);
  // Which reservation
  const [reservation, setReservation] = useState({ people: 0 });
  //ERROR
  const [showError, setShowError] = useState(null);
  const [tables, setTables] = useState([]);
  const { reservation_id } = useParams();
  const abortController = new AbortController();
  const history = useHistory();

  // gives form initial state
  useEffect(() => {
    const abort = new AbortController();
    const initialForm = { table_id: "" };
    setForm(initialForm);

    // gets selected reservation party.
    async function getReservation() {
      // attempts API call
      try {
        const response = await readReservation(reservation_id, abort.signal);
        setReservation(response);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }

    // gets a list of available tables.
    async function getTables() {
      // attempts API call.
      try {
        const response = await listTables(abort.signal);
        setTables(response);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
    getReservation();
    getTables();
    return () => abort.abort();
  }, [reservation_id]);

  // Changes any form changes.
  function handleChange({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  // Submits the selected Table.
  async function handleSubmit(event) {
    event.preventDefault();
    const table_id = Number(form.table_id);
    const reservation = parseInt(reservation_id);
    setShowError(null);
    setForm(initial);
    // API call to change status to seated
    try {
      await seatReservation(reservation, table_id, abortController.signal);
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => abortController.abort();
  }

  // filters for tables that can seat the party
  const tableOptions = tables.map((table) => {
    // removes tables that aren't big enough
    const disabled = Number(table.capacity) < Number(reservation.people);
    return (
      <option key={table.table_id} value={table.table_id} disabled={disabled}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  // Displays seat form.
  return (
    <div className="container fluid my-2">
      <ErrorAlert error={showError} />
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <label htmlFor="table_id" className="text-center mt-5">
          <h3>SELECT TABLE</h3>
          <select
            className="form-control m-5"
            name="table_id"
            onChange={handleChange}
          >
            <option>Select Table</option>
            {tableOptions}
          </select>
        </label>
        <button className="btn btn-warning my-2" type="submit">
          Submit
        </button>
        <button className="btn btn-danger" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Seat;
