exports.calculateDaysBetweenCheckInOut = (checkInDate, checkOutDate) => {
  var checkInTime = new Date(checkInDate).getTime();
  var checkOutTime = new Date(checkOutDate).getTime();
  var differenceMs = checkOutTime - checkInTime;
  var daysDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return daysDifference;
};
