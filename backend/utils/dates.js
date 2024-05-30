exports.calculateDaysBetweenCheckInOut = (checkInDate, checkOutDate) => {
  var checkInTime = new Date(checkInDate).getTime();
  var checkOutTime = new Date(checkOutDate).getTime();
  var differenceMs = checkOutTime - checkInTime;
  var daysDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return daysDifference;
};


exports.prettifyDate = (dateValue) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-US", options);
};