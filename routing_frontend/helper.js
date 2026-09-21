function vehicleTypeEnumToText(vehicleEnum) {
  switch (vehicleEnum) {
    case "PANELVAN":
      return "Panel Van";
    case "LORRY":
      return "Lorry";
    case "TRUCK":
      return "Truck";
    default:
      return "Unknown Vehicle Type";
  }
}

function dispatchTypeEnumToText(dispatchTypeEnum) {
  switch (dispatchTypeEnum) {
    case "SACK":
      return "Sack";
    case "BAG":
      return "Bag";
    case "PARCEL":
      return "Parcel";
    case "FILE":
      return "File";
    default:
      return "Unknown Dispatch Type";
  }
}

function deliveryRangeEnumToText(deliveryRangeEnum) {
  switch (deliveryRangeEnum) {
    case "MORNING":
      return "Morning";
    case "MIDMORNING":
      return "Late Morning";
    case "AFTERNOON":
      return "Afternoon";
    case "EVENING":
      return "Evening";
    default:
      return "Unknown Delivery Window";
  }
}

function deliveryRangeTextToEnum(deliveryRangeText) {
  switch (deliveryRangeText) {
    case "Morning":
      return "MORNING";
    case "Late Morning":
      return "MIDMORNING";
    case "Afternoon":
      return "AFTERNOON";
    case "Evening":
      return "EVENING";
    default:
      return null;
  }
}

function isWithinBoundingBox(
  pointLatitude,
  pointLongitude,
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  var isWithinLatitude =
    pointLatitude <= latitude1 && pointLatitude >= latitude2;
  var isWithinLongitude =
    pointLongitude >= longitude1 && pointLongitude <= longitude2;

  return isWithinLatitude && isWithinLongitude;
}

function getDeliveryRangeHours(deliveryRange) {
  switch (deliveryRange) {
    case "MIDMORNING":
    case "MORNING":
      return [7, 12];
    case "AFTERNOON":
    case "EVENING":
      return [13, 18];
    default:
      return [0, 0];
  }
}

function createDateWithTime(hour, duration) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const customDate = new Date(year, month, day, hour, 0);

  customDate.setMinutes(customDate.getMinutes() + duration);

  const formattedDay = day.toString().padStart(2, "0");
  const formattedMonth = (month + 1).toString().padStart(2, "0");
  const formattedHour = customDate.getHours().toString().padStart(2, "0");
  const formattedMinute = customDate.getMinutes().toString().padStart(2, "0");

  return `${formattedDay}.${formattedMonth}.${year} ${formattedHour}:${formattedMinute}:00`;
}

function isExistPreferedDeliveryTime(dispatch) {
  return dispatch?.preferFirstDeliveryTime && dispatch?.preferLastDeliveryTime;
}
