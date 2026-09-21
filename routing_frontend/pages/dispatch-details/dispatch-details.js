function getQueryParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    id: params.get("id"),
  };
}


async function fetchDispatchById(id) {
  try {
    const response = await fetch(
      `http://localhost:8070/dispatches/${id}`
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const dispatch = await response.json();

    if (!dispatch) {
      throw new Error("Dispatch not found.");
    }

    return dispatch;

  } catch (error) {

    alert(`Failed to load dispatch: ${error.message}`);

    return null;
  }
}


function formatDeliveryTime(dispatch) {

  if (
    dispatch.preferFirstDeliveryTime &&
    dispatch.preferLastDeliveryTime
  ) {

    const startTime = new Date(
      dispatch.preferFirstDeliveryTime * 1000
    ).toLocaleTimeString();

    const endTime = new Date(
      dispatch.preferLastDeliveryTime * 1000
    ).toLocaleTimeString();

    return `${startTime} - ${endTime}`;
  }

  return "Not specified";
}


function displayDispatchDetails(dispatch) {

  document.getElementById(
    "dispatch-title"
  ).textContent = `Dispatch #${dispatch.id}`;


  document.getElementById(
    "dispatch-details"
  ).innerHTML = `

    <div class="row">

        <div class="col-md-6">

            <div class="details-row">
                <div class="details-label">
                    Dispatch Type
                </div>

                <div class="details-value">
                    ${dispatchTypeEnumToText(
                      dispatch.dispatchType
                    )}
                </div>
            </div>


            <div class="details-row">
                <div class="details-label">
                    Weight
                </div>

                <div class="details-value">
                    ${dispatch.weight} kg
                </div>
            </div>


            <div class="details-row">
                <div class="details-label">
                    Delivery Window
                </div>

                <div class="details-value">
                    ${deliveryRangeEnumToText(
                      dispatch.deliveryRange
                    )}
                </div>
            </div>


            <div class="details-row">
                <div class="details-label">
                    Preferred Delivery Time
                </div>

                <div class="details-value">
                    ${formatDeliveryTime(dispatch)}
                </div>
            </div>

        </div>


        <div class="col-md-6">

            <div class="details-row">
                <div class="details-label">
                    Customer
                </div>

                <div class="details-value">
                    ${dispatch.customer.firstName}
                    ${dispatch.customer.lastName}
                </div>
            </div>


            <div class="details-row">
                <div class="details-label">
                    Phone
                </div>

                <div class="details-value">
                    ${dispatch.customer.phone}
                </div>
            </div>


            <div class="details-row">
                <div class="details-label">
                    Address
                </div>

                <div class="details-value">
                    ${dispatch.receiverAddress}
                </div>
            </div>


            <div class="details-row">
                <div class="details-label">
                    Coordinates
                </div>

                <div class="details-value">
                    ${dispatch.receiverLatitude},
                    ${dispatch.receiverLongitude}
                </div>
            </div>

        </div>

    </div>
  `;
}


function initializeMap(dispatch) {

  const latitude = dispatch.receiverLatitude;
  const longitude = dispatch.receiverLongitude;


  const map = L.map("map").setView(
    [latitude, longitude],
    15
  );


  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,

      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map);


  const deliveryIcon = L.icon({

    iconUrl: "../../img/marker.png",

    iconSize: [50, 50],

    iconAnchor: [25, 50],

    popupAnchor: [0, -45],

  });


  L.marker(
    [latitude, longitude],
    {
      icon: deliveryIcon,
    }
  )
    .addTo(map)

    .bindPopup(
      `
        <strong>Delivery Location</strong>
        <br>
        Customer:
        ${dispatch.customer.firstName}
        ${dispatch.customer.lastName}

        <br>

        Address:
        ${dispatch.receiverAddress}

        <br>

        Coordinates:
        ${latitude},
        ${longitude}
      `
    )

    .openPopup();
}


async function initialize() {

  const { id } = getQueryParams();


  if (!id) {

    document.getElementById(
      "dispatch-details"
    ).innerHTML = `
        <div class="alert alert-danger">
            No dispatch ID was provided.
        </div>
    `;

    return;
  }


  const dispatch = await fetchDispatchById(id);


  if (!dispatch) {

    document.getElementById(
      "dispatch-details"
    ).innerHTML = `
        <div class="alert alert-danger">
            Dispatch could not be found.
        </div>
    `;

    return;
  }


  displayDispatchDetails(dispatch);

  initializeMap(dispatch);
}


initialize();