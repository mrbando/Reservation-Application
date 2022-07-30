
// Table Form - Used to create a new table

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";


// Table Form Function
function TablesForm() {

  // initial form data
  const initial = {
    capacity: 0,
    table_name: "",
  };

  // initial form state
  const [form, setForm] = useState(initial);
  // Error 
  const [showError, setShowError] = useState(false);
  const abortController = new AbortController();
  const history = useHistory();

  // changes the initial state of the form
  useEffect(() => {
    const initialForm = {
      capacity: 0,
      table_name: "",
    };
    setForm(initialForm);
  }, []);

  // change handler
  function handleChange({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  // submits the table form to db
  async function handleSubmit(event) {
    event.preventDefault();
    const newTable = {
      capacity: Number(form.capacity),
      table_name: form.table_name,
    };
    setShowError(false);
    // API call
    try {
      await createTable(newTable, abortController.signal);
      setForm(initial);
      history.push("/dashboard");
    } catch (error) {
      setShowError(error);
    }
    return () => abortController.abort();
  }

  // Displays table form
  return (
    <div className="container fluid mt-3">
      <ErrorAlert className="alert alert-danger" error={showError} />
      <h3 style={{fontWeight: "bold"}} className="text-center my-5">CREATE TABLE</h3>
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <label htmlFor="table_name" className="text-center">
          <span style={{fontWeight: 'bold'}}>Table Name</span>
          <input
            className="form-control my-2"
            name="table_name"
            type="text"
            min={2}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="capacity" className="text-center">
        <span style={{fontWeight: 'bold'}}>Table Capacity</span>
          <input
            className="form-control my-2"
            name="capacity"
            type="number"
            onChange={handleChange}
          />
        </label>
        <div className="d-flex justify-content-center">
          <button className="btn btn-success mx-3" type="submit">
            Submit
          </button>
          <button className="btn btn-danger mx-3" onClick={() => history.goBack()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TablesForm;
