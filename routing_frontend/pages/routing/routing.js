/* =========================================================
   RouteForge - Route Optimization
   ========================================================= */

let map;

const selectedBranch = JSON.parse(
  sessionStorage.getItem("selectedBranch")
);

let outboundPolyline = null;
let returnPolyline = null;

let currentRouteResponse = null;


/* =========================================================
   MAP INITIALIZATION
   ========================================================= */

function showPosition(position) {

  map = L.map("map").setView(
    [
      position.coords.latitude,
      position.coords.longitude
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

  drawBoundingBox();
}


/* =========================================================
   BRANCH BOUNDING BOX
   ========================================================= */

function drawBoundingBox() {

  if (!selectedBranch) {
    return;
  }

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
}


/* =========================================================
   FETCH VEHICLE DISPATCH ASSIGNMENTS
   ========================================================= */

async function fetchDistributions() {

  try {

    const response = await fetch(
      "http://localhost:8070/dispatch-vehicles"
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const distributions = await response.json();

    const distributionSelect =
      document.getElementById("distribution");

    distributionSelect.innerHTML = "";

    if (!distributions || distributions.length === 0) {

      const option = document.createElement("option");

      option.textContent =
        "No vehicle dispatch assignments available";

      option.disabled = true;

      distributionSelect.appendChild(option);

      return;
    }

    distributions.forEach((distribution) => {

      const option = document.createElement("option");

      option.value = distribution.id;

      const vehicle = distribution.vehicle;

      option.textContent =
        `Branch: ${vehicle?.branch?.name ?? "Unknown"} | ` +
        `Vehicle Type: ${vehicleTypeEnumToText(
          vehicle?.vehicleType
        )} | ` +
        `License Plate: ${
          vehicle?.licensePlate ?? "N/A"
        } | ` +
        `Route Time: ${
          distribution.routeDate
            ? new Date(
                distribution.routeDate * 1000
              ).toLocaleTimeString()
            : "N/A"
        } | ` +
        `Delivery Window: ${
          deliveryRangeEnumToText(
            vehicle?.deliveryRange
          )
        }`;

      distributionSelect.appendChild(option);
    });

  } catch (error) {

    console.error(
      "Failed to load dispatch assignments:",
      error
    );

    showStatus(
      "Failed to load dispatch assignments.",
      "danger"
    );
  }
}


/* =========================================================
   CREATE ROUTE
   ========================================================= */

async function handleFormSubmit(event) {

  event.preventDefault();

  const selectedDistributionId =
    document.getElementById("distribution").value;

  if (!selectedDistributionId) {

    showStatus(
      "Please select a vehicle dispatch assignment.",
      "warning"
    );

    return;
  }

  clearMap();

  showLoading(true);

  try {

    const response = await fetch(
      `http://localhost:8070/dispatch-vehicles/route/${selectedDistributionId}`
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const res = await response.json();

    currentRouteResponse = res;

    console.log(
      "Optimized Route Response:",
      res
    );

    renderRouteSummary(res);

    renderVehicleInformation(res);

    renderStopSequence(res);

    renderRouteOnMap(res);

    showStatus(
      "Route optimization completed successfully.",
      "success"
    );

  } catch (error) {

    console.error(
      "Route optimization failed:",
      error
    );

    showStatus(
      `Route optimization failed: ${error.message}`,
      "danger"
    );

  } finally {

    showLoading(false);
  }
}


/* =========================================================
   ROUTE SUMMARY
   ========================================================= */

function renderRouteSummary(res) {

  const totalDistanceElement =
    document.getElementById("totalDistance");

  const totalDurationElement =
    document.getElementById("totalDuration");

  const totalStopsElement =
    document.getElementById("totalStops");


  if (totalDistanceElement) {

    const distanceKm =
      Number(res.totalDistance || 0) / 1000;

    totalDistanceElement.textContent =
      `${distanceKm.toFixed(1)} km`;
  }


  if (totalDurationElement) {

    totalDurationElement.textContent =
      res.totalDurationFormatted ||
      "N/A";
  }


  if (totalStopsElement) {

    totalStopsElement.textContent =
      res.dispatches?.length || 0;
  }
}


/* =========================================================
   VEHICLE INFORMATION
   ========================================================= */

function renderVehicleInformation(res) {

  const container =
    document.getElementById(
      "vehicleInformation"
    );

  if (!container) {
    return;
  }

  const vehicle = res.vehicle;

  if (!vehicle) {

    container.innerHTML =
      "<p class='text-muted'>Vehicle information unavailable.</p>";

    return;
  }

  container.innerHTML = `

    <div class="vehicle-info-item">

      <span class="vehicle-info-label">
        Vehicle Type
      </span>

      <span class="vehicle-info-value">
        ${vehicleTypeEnumToText(
          vehicle.vehicleType
        )}
      </span>

    </div>


    <div class="vehicle-info-item">

      <span class="vehicle-info-label">
        License Plate
      </span>

      <span class="vehicle-info-value">
        ${vehicle.licensePlate || "N/A"}
      </span>

    </div>


    <div class="vehicle-info-item">

      <span class="vehicle-info-label">
        Delivery Window
      </span>

      <span class="vehicle-info-value">
        ${deliveryRangeEnumToText(
          vehicle.deliveryRange
        )}
      </span>

    </div>


    <div class="vehicle-info-item">

      <span class="vehicle-info-label">
        Branch
      </span>

      <span class="vehicle-info-value">
        ${vehicle.branch?.name || "N/A"}
      </span>

    </div>

  `;
}


/* =========================================================
   STOP SEQUENCE
   ========================================================= */

function renderStopSequence(res) {

  const container =
    document.getElementById(
      "stopSequence"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const routes = res.routes || [];

  if (routes.length === 0) {

    container.innerHTML =
      "<p class='text-muted'>No optimized route available.</p>";

    return;
  }

  const route = routes[0];

  const services = route.services || [];

  if (services.length === 0) {

    container.innerHTML =
      "<p class='text-muted'>No delivery stops found.</p>";

    return;
  }


  services.forEach(
    (service, index) => {

      const dispatch =
        (res.dispatches || []).find(
          (d) =>
            Number(d.receiverLatitude) ===
            Number(service.location.latitude)
        );


      const customer =
        dispatch?.customer;


      const stop = document.createElement(
        "div"
      );

      stop.className =
        "stop-item";


      const arrivalTime =
        service.arrivalTime || "N/A";


      const departureTime =
        service.endTime || "N/A";


      stop.innerHTML = `

        <div class="stop-number">
          ${index + 1}
        </div>

        <div class="stop-content">

          <div class="stop-title">

            ${
              customer
                ? `${customer.firstName || ""} ${
                    customer.lastName || ""
                  }`
                : `Delivery Stop ${index + 1}`
            }

          </div>

          <div class="stop-details">

            ${
              dispatch?.receiverAddress ||
              "Delivery location"
            }

            <br>

            Arrival:
            ${arrivalTime}

            &nbsp; | &nbsp;

            Departure:
            ${departureTime}

          </div>

        </div>

      `;


      if (
        index <
        services.length - 1
      ) {

        const connector =
          document.createElement(
            "div"
          );

        connector.className =
          "stop-connector";

        stop.appendChild(
          connector
        );
      }


      container.appendChild(stop);
    }
  );
}


/* =========================================================
   MAP ROUTE RENDERING
   ========================================================= */

function renderRouteOnMap(res) {

  if (!res.geometry) {

    showStatus(
      "Route geometry was not returned by the backend.",
      "warning"
    );

    return;
  }


  const outbound =
    res.geometry.outbound || [];

  const returnRoute =
    res.geometry.return || [];


  if (
    outbound.length === 0 &&
    returnRoute.length === 0
  ) {

    showStatus(
      "No route geometry available.",
      "warning"
    );

    return;
  }


  if (outbound.length > 0) {

    outboundPolyline =
      L.polyline(

        outbound.map(
          (coord) => [
            coord[1],
            coord[0]
          ]
        ),

        {
          color: "blue",
          weight: 6
        }

      ).addTo(map);
  }


  if (returnRoute.length > 0) {

    returnPolyline =
      L.polyline(

        returnRoute.map(
          (coord) => [
            coord[1],
            coord[0]
          ]
        ),

        {
          color: "purple",
          weight: 6
        }

      ).addTo(map);
  }


  renderRouteMarkers(res);


  const layers = [];

  if (outboundPolyline) {
    layers.push(outboundPolyline);
  }

  if (returnPolyline) {
    layers.push(returnPolyline);
  }


  if (layers.length > 0) {

    const bounds =
      L.featureGroup(
        layers
      ).getBounds();

    map.fitBounds(
      bounds,
      {
        padding: [30, 30]
      }
    );
  }
}


/* =========================================================
   ROUTE MARKERS
   ========================================================= */

function renderRouteMarkers(res) {

  const vehicle =
    res.vehicle;

  const dispatches =
    res.dispatches || [];

  const routes =
    res.routes || [];


  if (
    routes.length === 0
  ) {
    return;
  }


  const route =
    routes[0];

  const services =
    route.services || [];


  /* -------------------------
     Delivery Stops
     ------------------------- */

  services.forEach(
    (service, index) => {

      const latitude =
        service.location.latitude;

      const longitude =
        service.location.longitude;


      const dispatch =
        dispatches.find(
          (d) =>
            Number(d.receiverLatitude) ===
            Number(latitude)
        );


      const customer =
        dispatch?.customer;


      const hasPreferredTime =
        dispatch &&
        isExistPreferedDeliveryTime(
          dispatch
        );


      const markerIcon =
        L.icon({

          iconUrl:
            hasPreferredTime
              ? "../../img/marker-green.png"
              : "../../img/marker.png",

          iconSize: [50, 50],

          iconAnchor: [25, 50],

          popupAnchor: [0, -50]

        });


      L.marker(
        [
          latitude,
          longitude
        ],
        {
          icon: markerIcon
        }
      )

        .addTo(map)

        .bindTooltip(
          `${index + 1}`,
          {
            permanent: true,
            opacity:
              dispatch == null
                ? 0
                : 1,
            direction: "bottom",
            className:
              "labelstyle"
          }
        )

        .bindPopup(

          createStopPopup(
            index,
            dispatch,
            customer,
            service
          )

        );
    }
  );


  /* -------------------------
     Branch Marker
     ------------------------- */

  if (
    vehicle?.branch
  ) {

    const branch =
      vehicle.branch;


    const branchIcon =
      L.icon({

        iconUrl:
          "../../img/branch.png",

        iconSize: [50, 50],

        iconAnchor: [25, 50],

        popupAnchor: [0, -50]

      });


    L.marker(
      [
        branch.latitude,
        branch.longitude
      ],
      {
        icon: branchIcon
      }
    )

      .addTo(map)

      .bindPopup(

        createBranchPopup(
          vehicle,
          res
        )

      );
  }
}


/* =========================================================
   STOP POPUP
   ========================================================= */

function createStopPopup(
  index,
  dispatch,
  customer,
  service
) {

  const customerName =
    customer
      ? `${customer.firstName || ""} ${
          customer.lastName || ""
        }`
      : "Unknown Customer";


  let preferredTime =
    "Not specified";


  if (
    dispatch &&
    dispatch.preferFirstDeliveryTime &&
    dispatch.preferLastDeliveryTime
  ) {

    preferredTime =
      `${new Date(
        dispatch.preferFirstDeliveryTime * 1000
      ).toLocaleTimeString()} - ${new Date(
        dispatch.preferLastDeliveryTime * 1000
      ).toLocaleTimeString()}`;
  }


  return `

    <div style="min-width:260px">

      <strong>
        Stop ${index + 1}
      </strong>

      <hr>

      <b>Customer:</b>
      ${customerName}

      <br>

      <b>Delivery Window:</b>
      ${
        dispatch
          ? deliveryRangeEnumToText(
              dispatch.deliveryRange
            )
          : "N/A"
      }

      <br>

      <b>Preferred Time:</b>
      ${preferredTime}

      <br>

      <b>Arrival:</b>
      ${service.arrivalTime || "N/A"}

      <br>

      <b>Departure:</b>
      ${service.endTime || "N/A"}

      <br>

      <b>Address:</b>
      ${
        dispatch?.receiverAddress ||
        "N/A"
      }

    </div>

  `;
}


/* =========================================================
   BRANCH POPUP
   ========================================================= */

function createBranchPopup(
  vehicle,
  res
) {

  const range =
    vehicle.deliveryRange;


  const hours =
    getDeliveryRangeHours(
      range
    );


  return `

    <div style="min-width:260px">

      <strong>
        ${vehicle.branch?.name || "Branch"}
      </strong>

      <hr>

      <b>Vehicle:</b>
      ${vehicle.licensePlate || "N/A"}

      <br>

      <b>Delivery Window:</b>
      ${deliveryRangeEnumToText(range)}

      <br>

      <b>Operating Hours:</b>
      ${hours[0]}:00 - ${hours[1]}:00

      <br>

      <b>Total Route:</b>
      ${
        (
          Number(res.totalDistance || 0) /
          1000
        ).toFixed(1)
      } km

      <br>

      <b>Total Duration:</b>
      ${
        res.totalDurationFormatted ||
        "N/A"
      }

    </div>

  `;
}


/* =========================================================
   CLEAR MAP
   ========================================================= */

function clearMap() {

  if (!map) {
    return;
  }


  map.eachLayer(
    function (layer) {

      if (
        layer instanceof L.Marker ||
        layer instanceof L.Polyline
      ) {

        map.removeLayer(
          layer
        );
      }
    }
  );


  outboundPolyline =
    null;

  returnPolyline =
    null;


  drawBoundingBox();
}


/* =========================================================
   OUTBOUND ROUTE TOGGLE
   ========================================================= */

document
  .getElementById(
    "toggleOutbound"
  )
  ?.addEventListener(
    "click",
    function () {

      if (!outboundPolyline) {
        return;
      }


      if (
        map.hasLayer(
          outboundPolyline
        )
      ) {

        map.removeLayer(
          outboundPolyline
        );

      } else {

        outboundPolyline.addTo(
          map
        );
      }
    }
  );


/* =========================================================
   RETURN ROUTE TOGGLE
   ========================================================= */

document
  .getElementById(
    "toggleReturn"
  )
  ?.addEventListener(
    "click",
    function () {

      if (!returnPolyline) {
        return;
      }


      if (
        map.hasLayer(
          returnPolyline
        )
      ) {

        map.removeLayer(
          returnPolyline
        );

      } else {

        returnPolyline.addTo(
          map
        );
      }
    }
  );


/* =========================================================
   FORM EVENT
   ========================================================= */

document
  .getElementById(
    "cargoForm"
  )
  ?.addEventListener(
    "submit",
    handleFormSubmit
  );


/* =========================================================
   LOADING UI
   ========================================================= */

function showLoading(isLoading) {

  const button =
    document.getElementById(
      "createRouteButton"
    );


  if (!button) {
    return;
  }


  if (isLoading) {

    button.disabled = true;

    button.innerHTML = `
      <span
        class="spinner-border spinner-border-sm me-2"
        role="status">
      </span>
      Optimizing Route...
    `;

  } else {

    button.disabled = false;

    button.innerHTML =
      "Create Optimized Route";
  }
}


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function showStatus(
  message,
  type = "info"
) {

  const container =
    document.getElementById(
      "routeStatus"
    );


  if (!container) {

    console.log(
      `[${type}] ${message}`
    );

    return;
  }


  container.className =
    `alert alert-${type}`;


  container.textContent =
    message;


  container.classList.remove(
    "d-none"
  );
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

try {

  if (!selectedBranch) {

    showStatus(
      "Branch information is missing. Please select a branch first.",
      "warning"
    );

  } else {

    showPosition({

      coords: {

        latitude:
          selectedBranch.latitude,

        longitude:
          selectedBranch.longitude

      }

    });

    fetchDistributions();
  }

} catch (error) {

  console.error(
    "Application initialization error:",
    error
  );

  showStatus(
    `Application error: ${error.message}`,
    "danger"
  );
}