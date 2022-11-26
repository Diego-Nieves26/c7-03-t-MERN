const { Fild } = require("../models/fild.model");
const { Booking } = require("../models/booking.model");

const { catchAsync } = require("../utils/catchAsync.util");

const searchFilter = catchAsync(async (req, res, next) => {
  const chanchasFiltradas = []
  const nameSport = req.query.nameSport;
  const country = req.query.country;
  const date = req.query.date;

  const Filds = await Fild.find({
    nameSport,
  });

  const fildsCountry = Filds.filter((e) => e.sceneryId.country === country);

  const bookings = await Booking.find({
    bookingDate: date,
  });

  fildsCountry.forEach((e) => {
    bookings.forEach((i) => {
      if(i.fildId.sportId === nameSport){
        if (e.nameFild !== i.fildId.nameFild) {
          chanchasFiltradas.push(e)
        }
      }
    });
  })


  res.status(201).json({
    status: "success",
    chanchasFiltradas,
  });
});

module.exports = {
  searchFilter,
};
