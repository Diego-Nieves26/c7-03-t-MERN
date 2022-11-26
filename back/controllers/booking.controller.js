// Models
const { Booking } = require("../models/booking.model");
const { User } = require("../models/user.model");
const { Fild } = require("../models/fild.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const createBooking = catchAsync(async (req, res, next) => {
  const { fildId, price, bookingDate, bookingTime } = req.body;
  const { sessionUser } = req;

  const user = await User.findById(sessionUser._id);
  const fild = await Fild.findById(fildId);

  const bookingExist = await Booking.findOne({ bookingTime, bookingDate });

  if (bookingExist) {
    return next(new AppError("busy booking date", 400));
  }

  user.password = undefined;

  const newBooking = await Booking.create({
    userId: user._id,
    fildId,
    bookingTime,
    bookingDate,
    price,
  });

  res.status(201).json({
    status: "success",
    newBooking,
  });
});

const deleteBooking = catchAsync(async (req, res, next) => {
  const { booking } = req;

  await booking.updateOne({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

module.exports = { createBooking, deleteBooking };
