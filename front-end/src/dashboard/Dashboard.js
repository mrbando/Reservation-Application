
// Main content

// The dashboard displays tables and reservations.

import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "../layout/reservations/ReservationCard";
import TableCard from "../layout/tables/TableCard";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

// Dashboard function
function Dashboard({ date, setDate }) {

// initial form states.
// gathers reservations
  const [reservations, setReservations] = useState([]);
// ErrorAlert";
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
// ErrorAlert";
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();
  const query = useQuery();
  const route = useRouteMatch();

// updates the page date displayed.
  useEffect(() => {
    function updateDate() {
      const queryDate = query.get("date");
      if (queryDate) {
        setDate(queryDate);
      } else {
        setDate(today());
      }
    }
    updateDate();
  }, [query, route, setDate]);
  
  // loads dashboard using effect.
  useEffect(loadDashboard, [date]);

  //load logic
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const reservationList = reservations.map((reservation) => {
    // stops finished and cancelled reservation from showing up in feed.
    if (reservation.status === "cancelled" || reservation.status === "finished")
      return null;
    // maps over all of the reservation cards.
    return (
      <ReservationCard
        key={reservation.reservation_id}
        reservation={reservation}
      />
    );
  });
  // maps over all of the tables.
  const tablesList = tables.map((table) => (
    <TableCard key={table.table_id} table={table} />
  ));

  // displays all used information.
  return (
    <main className="container fluid mt-3">
      <h1 className="text-center">SEATFREAKY DASHBOARD</h1>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary btn-px-3 py-2 m-5"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>
        <button
          className="btn btn-warning px-3 py-2 m-5"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-primary px-3 py-2 m-5"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
      <div className="d-md-flex mb-3 justify-content-center">
        <h2 className="text-center m-5">SHOWING <span style={{fontWeight: 'bold'}}>{date}</span> RESERVATIONS</h2>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div>
        <div className="container fluid">{reservationList}</div>
      </div>
      <div>
        <h3 className="mt-4 text-center"><span style={{fontWeight: 'bold'}}>TABLE LIST</span></h3>
        <div className="container fluid">{tablesList}</div>
      </div>
    </main>
  );
}

export default Dashboard;
