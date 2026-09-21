let selectedLatitude = null;
let selectedLongitude = null;

let selectedDeliveryRange = "MORNING";

let preferFirstDeliveryTime = null;
let preferLastDeliveryTime = null;

const selectedBranch = JSON.parse(
  sessionStorage.getItem("selectedBranch")
);


document.addEventListener("DOMContentLoaded", () => {

  initializeMap();

  fetchCustomers();

  setupEventListeners();

});


function initializeMap() {

  if (!selectedBranch) {

    alert(
      "No branch has been selected. Please return to the home page."
    );

    return;
  }


  const map = L.map("map").setView(
    [
      selectedBranch.latitude,
      selectedBranch.longitude
    ],
    13
  );


  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,

      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ).addTo(map);


  /*
   * Branch boundary
   */
  L.rectangle(
    [
      [
        selectedBranch.boundingBoxLatitude1,
        selectedBranch.boundingBoxLongitude1
      ],
      [
        selectedBranch.boundingBoxLatitude2,
        selectedBranch.boundingBoxLongitude2
      ]
    ],
    {
      color: "#ff7800",
      weight: 2,
      fillOpacity: 0.2
    }
  ).addTo(map);


  /*
   * Branch marker
   */
  const branchIcon = L.icon({

    iconUrl: "../../img/branch.png",

    iconSize: [50, 50],

    iconAnchor: [25, 50]

  });


  L.marker(
    [
      selectedBranch.latitude,
      selectedBranch.longitude
    ],
    {
      icon: branchIcon
    }
  )
    .addTo(map)
    .bindPopup(
      `<strong>${selectedBranch.name}</strong><br>Branch`
    );


  /*
   * Delivery marker
   */
  const deliveryIcon = L.icon({

    iconUrl: "../../img/marker.png",

    iconSize: [50, 50],

    iconAnchor: [25, 50]

  });


  const marker = L.marker(
    [
      selectedBranch.latitude,
      selectedBranch.longitude
    ],
    {
      draggable: true,

      icon: deliveryIcon
    }
  ).addTo(map);


  /*
   * Initial location
   */
  updateLocation(
    selectedBranch.latitude,
    selectedBranch.longitude
  );


  /*
   * Marker drag event
   */
  marker.on("dragend", async (event) => {

    const { lat, lng } =
      event.target.getLatLng();


    updateLocation(lat, lng);


    await reverseGeocode(lat, lng);

  });

}


function updateLocation(latitude, longitude) {

  selectedLatitude = latitude;

  selectedLongitude = longitude;


  document.getElementById(
    "latitude"
  ).textContent =
    latitude.toFixed(6);


  document.getElementById(
    "longitude"
  ).textContent =
    longitude.toFixed(6);

}


async function reverseGeocode(latitude, longitude) {

  const addressElement =
    document.getElementById("address");


  addressElement.textContent =
    "Finding address...";


  try {

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );


    if (!response.ok) {

      throw new Error(
        "Unable to retrieve address."
      );

    }


    const address =
      await response.json();


    addressElement.textContent =
      address.display_name ||
      "Address not available";


  } catch (error) {

    addressElement.textContent =
      "Address not available";

    console.error(
      "Reverse geocoding error:",
      error
    );

  }

}


async function fetchCustomers() {

  try {

    const response = await fetch(
      "http://localhost:8070/customers"
    );


    if (!response.ok) {

      throw new Error(
        await response.text()
      );

    }


    const customers =
      await response.json();


    const customerSelect =
      document.getElementById("customer");


    customerSelect.innerHTML =
      '<option value="">Select a customer</option>';


    customers.forEach((customer) => {

      const option =
        document.createElement("option");


      option.value =
        customer.id;


      option.textContent =
        `${customer.firstName} ${customer.lastName}`;


      customerSelect.appendChild(
        option
      );

    });


  } catch (error) {

    alert(
      `Failed to load customers: ${error.message}`
    );

  }

}


function setupEventListeners() {

  /*
   * Delivery range
   */
  document
    .getElementById("deliveryRange")
    .addEventListener(
      "change",
      (event) => {

        selectedDeliveryRange =
          event.target.value;

      }
    );


  /*
   * Preferred start time
   */
  document
    .getElementById("firstDate")
    .addEventListener(
      "change",
      checkDate
    );


  /*
   * Preferred end time
   */
  document
    .getElementById("lastDate")
    .addEventListener(
      "change",
      checkDate
    );


  /*
   * Form submission
   */
  document
    .getElementById("cargoForm")
    .addEventListener(
      "submit",
      handleFormSubmit
    );

}


function checkDate() {

  const firstDate =
    document.getElementById(
      "firstDate"
    ).value;


  const lastDate =
    document.getElementById(
      "lastDate"
    ).value;


  /*
   * If only one value exists,
   * wait for the second value.
   */
  if (!firstDate || !lastDate) {

    preferFirstDeliveryTime = null;

    preferLastDeliveryTime = null;

    return;

  }


  const startMinutes =
    timeToMinutes(firstDate);


  const endMinutes =
    timeToMinutes(lastDate);


  /*
   * End time cannot be before start time.
   */
  if (endMinutes <= startMinutes) {

    alert(
      "End time must be later than start time."
    );

    resetPreferredTime();

    return;

  }


  /*
   * Minimum one-hour delivery window.
   */
  if (
    endMinutes - startMinutes < 60
  ) {

    alert(
      "The delivery window must be at least 1 hour."
    );

    resetPreferredTime();

    return;

  }


  /*
   * Convert time to Unix timestamp.
   */
  const startDate =
    new Date();


  startDate.setHours(
    Number(firstDate.slice(0, 2)),
    Number(firstDate.slice(3, 5)),
    0,
    0
  );


  const endDate =
    new Date();


  endDate.setHours(
    Number(lastDate.slice(0, 2)),
    Number(lastDate.slice(3, 5)),
    0,
    0
  );


  preferFirstDeliveryTime =
    Math.floor(
      startDate.getTime() / 1000
    );


  preferLastDeliveryTime =
    Math.floor(
      endDate.getTime() / 1000
    );


  /*
   * Automatically determine delivery range.
   */
  updateDeliveryRange(
    startMinutes,
    endMinutes
  );

}


function timeToMinutes(time) {

  const hours =
    Number(time.slice(0, 2));


  const minutes =
    Number(time.slice(3, 5));


  return (
    hours * 60 +
    minutes
  );

}


function updateDeliveryRange(
  startMinutes,
  endMinutes
) {

  const deliveryRange =
    document.getElementById(
      "deliveryRange"
    );


  /*
   * Morning: 07:00 - 10:00
   */
  if (
    startMinutes >= 7 * 60 &&
    endMinutes <= 10 * 60
  ) {

    selectedDeliveryRange =
      "MORNING";

    deliveryRange.value =
      "MORNING";

  }

  /*
   * Mid-Morning: 10:00 - 13:00
   */
  else if (
    startMinutes >= 10 * 60 &&
    endMinutes <= 13 * 60
  ) {

    selectedDeliveryRange =
      "MIDMORNING";

    deliveryRange.value =
      "MIDMORNING";

  }

  /*
   * Afternoon: 13:00 - 16:00
   */
  else if (
    startMinutes >= 13 * 60 &&
    endMinutes <= 16 * 60
  ) {

    selectedDeliveryRange =
      "AFTERNOON";

    deliveryRange.value =
      "AFTERNOON";

  }

  /*
   * Evening: 16:00 - 19:00
   */
  else if (
    startMinutes >= 16 * 60 &&
    endMinutes <= 19 * 60
  ) {

    selectedDeliveryRange =
      "EVENING";

    deliveryRange.value =
      "EVENING";

  }

}


function resetPreferredTime() {

  document.getElementById(
    "firstDate"
  ).value = "";


  document.getElementById(
    "lastDate"
  ).value = "";


  preferFirstDeliveryTime =
    null;


  preferLastDeliveryTime =
    null;

}


async function handleFormSubmit(event) {

  event.preventDefault();


  /*
   * Validate branch.
   */
  if (!selectedBranch) {

    alert(
      "No branch has been selected."
    );

    return;

  }


  /*
   * Validate location.
   */
  if (
    selectedLatitude === null ||
    selectedLongitude === null
  ) {

    alert(
      "Please select a delivery location on the map."
    );

    return;

  }


  /*
   * Validate customer.
   */
  const customerId =
    document.getElementById(
      "customer"
    ).value;


  if (!customerId) {

    alert(
      "Please select a customer."
    );

    return;

  }


  /*
   * Validate weight.
   */
  const weight =
    parseFloat(
      document.getElementById(
        "weight"
      ).value
    );


  if (
    !Number.isFinite(weight) ||
    weight <= 0
  ) {

    alert(
      "Please enter a valid weight."
    );

    return;

  }


  /*
   * Validate branch boundary.
   */
  const isInsideBranch =
    isWithinBoundingBox(
      selectedLatitude,
      selectedLongitude,

      selectedBranch.boundingBoxLatitude1,
      selectedBranch.boundingBoxLongitude1,

      selectedBranch.boundingBoxLatitude2,
      selectedBranch.boundingBoxLongitude2
    );


  if (!isInsideBranch) {

    alert(
      "The delivery location is outside the selected branch boundary."
    );

    return;

  }


  /*
   * Build API request.
   */
  const data = {

    dispatchType:
      document.getElementById(
        "dispatchType"
      ).value,

    weight: weight,

    customer: {
      id: parseInt(
        customerId
      )
    },

    receiverLatitude:
      selectedLatitude,

    receiverLongitude:
      selectedLongitude,

    deliveryRange:
      selectedDeliveryRange,

    receiverAddress:
      document.getElementById(
        "address"
      ).textContent,

    preferFirstDeliveryTime:
      preferFirstDeliveryTime,

    preferLastDeliveryTime:
      preferLastDeliveryTime

  };


  try {

    /*
     * IMPORTANT:
     * Backend runs on port 8070.
     */
    const response = await fetch(
      "http://localhost:8070/dispatches",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(data)
      }
    );


    if (!response.ok) {

      throw new Error(
        await response.text()
      );

    }


    alert(
      "Dispatch created successfully!"
    );


    /*
     * Return to dispatch list.
     */
    window.location.href =
      "../dispatch/dispatch.html";


  } catch (error) {

    alert(
      `Failed to create dispatch: ${error.message}`
    );

  }

}