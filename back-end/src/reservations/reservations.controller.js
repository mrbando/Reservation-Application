const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "created_at",
    "updated_at",
    "reservation_id"
  ]);

  const invalidFields = Object.keys(data).filter(
    field => !validFields.has(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

function hasReservationId(req, res, next) {
  const reservation = req.params.reservation_id || req.body?.data?.reservation_id;

  if(reservation){
      res.locals.reservation_id = reservation;
      next();
  } else {
      next({
          status: 400,
          message: `missing reservation_id`,
      });
  }
}

//Formats

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

async function reservationExists(req, res, next) {
  const reservation_id = res.locals.reservation_id;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({status: 404, message: `Reservation not found: ${reservation_id}`});
  }
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function isValidDate(req, res, next){
  const { data = {} } = req.body;
  const reservation_date = new Date(data['reservation_date']);
  const day = reservation_date.getUTCDay();

  if (isNaN(Date.parse(data['reservation_date']))){
      return next({ status: 400, message: `Invalid reservation_date` });
  }
  if (day === 2) {
      return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }
  if (reservation_date < new Date()) {
      return next({ status: 400, message: `Reservation must be set in the future` });
  }
  next();
}

function isTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const timeRegex = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
  if (reservation_time && reservation_time !== "" && reservation_time.match(timeRegex)) {
    next();
  } else {
    next({ status: 400, message: "reservation_time must be a valid time"});
  }
}

function isValidDay(req, res, next) {
  const { data } = req.body;
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
  if (reservationDate < new Date() && day === "Tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created on a future date, excluding Tuesdays",
    });
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created on a future date",
    });
  }
  if (day === "Tuesday") {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
    });
  }
  if (time <= "10:30" || time >= "21:30") {
    return next({
      status: 400,
      message: "Reservations can only be made from 10:30AM - 9:30PM.",
    });
  }
  next();
}

function checkStatus(req, res, next){
  const { data = {} } = req.body;
  if (data['status'] === 'seated' || data['status'] === 'finished'){
      return next({ status: 400, message: `status is ${data['status']}` });
  }
  next();
}

function isValidNumber(req, res, next){
  const { data = {} } = req.body;
  if (data['people'] === 0 || !Number.isInteger(data['people'])){
      return next({ status: 400, message: `Invalid number of people` });
  }
  next();
}

async function list(req, res) {
  const mobile_number = req.query.mobile_number;
  const data = await (
      mobile_number
    ? service.search(mobile_number)
    : service.list(req.query.date)
  );
  res.json({
    data,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data);

  res.status(201).json({
    data: data,
  });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.status(200).json({
    data,
  })
}

async function status(req, res) {
  res.locals.reservation.status = req.body.data.status;
  const data = await service.status(res.locals.reservation);
  res.json({ data });
}

async function unfinishedStatus(req, res, next){
  if ("booked" !== res.locals.reservation.status) {
    next({
      status: 400,
      message: `Reservation status: '${res.locals.reservation.status}'.`,
    });
  } else {
      next();
  }
}

async function update(req, res) {
  const { reservation_id } = res.locals.reservation;
  req.body.data.reservation_id = reservation_id;
  const data = await service.status(req.body.data);
  res.json({ data });
}

const has_first_name = bodyDataHas("first_name");
const has_last_name = bodyDataHas("last_name");
const has_mobile_number = bodyDataHas("mobile_number");
const has_reservation_date = bodyDataHas("reservation_date");
const has_reservation_time = bodyDataHas("reservation_time");
const has_people = bodyDataHas("people");
const has_capacity = bodyDataHas("capacity");
const has_table_name = bodyDataHas("table_name");
const has_reservation_id = bodyDataHas("reservation_id");

module.exports = {
  create: [
      hasValidFields,
      has_first_name,
      has_last_name,
      has_mobile_number,
      has_reservation_date,
      has_reservation_time,
      has_people,
      isValidDate,
      isTime,
      isValidNumber,
      isValidDay,
      checkStatus,
      asyncErrorBoundary(create)
  ],
  read: [hasReservationId, reservationExists, asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  reservationExists: [hasReservationId, reservationExists],
  status: [hasReservationId, reservationExists, unfinishedStatus, asyncErrorBoundary(status)],
  update: [
      hasValidFields,
      has_first_name,
      has_last_name,
      has_mobile_number,
      has_reservation_date,
      has_reservation_time,
      has_people,
      isValidDate,
      isTime,
      isValidNumber,
      checkStatus,
      hasReservationId,
      reservationExists,
      asyncErrorBoundary(update)
  ]
};
