/**
 * Fetch all dispatches from the backend.
 */
async function fetchDispatches() {

  try {

    const response = await fetch(
      "http://localhost:8070/dispatches"
    );


    if (!response.ok) {

      throw new Error(
        await response.text()
      );

    }


    const dispatches =
      await response.json();


    displayDispatches(dispatches);


  } catch (error) {

    alert(
      `Failed to load dispatches: ${error.message}`
    );

  }

}


/**
 * Display dispatches as responsive cards.
 */
function displayDispatches(dispatches) {

  const container =
    document.getElementById(
      "dispatch-container"
    );


  container.innerHTML = "";


  /*
   * Handle empty dispatch list.
   */
  if (
    !dispatches ||
    dispatches.length === 0
  ) {

    container.innerHTML = `
      <div class="col-12">

        <div class="alert alert-info">

          No dispatches are currently available.

        </div>

      </div>
    `;

    return;

  }


  dispatches.forEach(
    (dispatch) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "col-md-6 col-lg-4";


      /*
       * Customer information.
       */
      const customer =
        dispatch.customer;


      const customerName =
        customer
          ? `${customer.firstName ?? ""} ${
              customer.lastName ?? ""
            }`.trim()
          : "Unknown Customer";


      const customerPhone =
        customer?.phone ??
        "Not available";


      /*
       * Preferred delivery time.
       */
      const preferredTime =
        dispatch.preferFirstDeliveryTime &&
        dispatch.preferLastDeliveryTime

          ? `${new Date(
              dispatch.preferFirstDeliveryTime *
                1000
            ).toLocaleTimeString("en-IN")} - ${new Date(
              dispatch.preferLastDeliveryTime *
                1000
            ).toLocaleTimeString("en-IN")}`

          : "Not specified";


      /*
       * Create card.
       */
      card.innerHTML = `

        <div class="card dispatch-card">

          <div class="card-body p-4">

            <div
              class="d-flex justify-content-between
                     align-items-center mb-3">

              <h5 class="dispatch-id mb-0">
                Dispatch #${dispatch.id}
              </h5>

              <span class="badge text-bg-primary">
                ${dispatch.dispatchType ?? "Dispatch"}
              </span>

            </div>


            <hr>


            <p class="mb-2">

              <span class="info-label">
                Customer:
              </span>

              ${customerName}

            </p>


            <p class="mb-2">

              <span class="info-label">
                Phone:
              </span>

              ${customerPhone}

            </p>


            <p class="mb-2">

              <span class="info-label">
                Preferred Delivery Time:
              </span>

              ${preferredTime}

            </p>


            <p class="mb-2">

              <span class="info-label">
                Delivery Window:
              </span>

              ${getDeliveryWindowText(
                dispatch.deliveryRange
              )}

            </p>


            <p class="mb-2">

              <span class="info-label">
                Address:
              </span>

              ${dispatch.receiverAddress ??
              "Not available"}

            </p>


            <p class="coordinate-text mb-4">

              <span class="info-label">
                Coordinates:
              </span>

              ${dispatch.receiverLatitude},
              ${dispatch.receiverLongitude}

            </p>


            <a
              href="../dispatch-details/dispatch-details.html?id=${
                dispatch.id
              }"
              class="btn btn-primary w-100">

              View Details

            </a>

          </div>

        </div>

      `;


      container.appendChild(card);

    }
  );

}


/**
 * Convert backend delivery-range enum
 * into user-friendly English text.
 *
 * This function is local to this page so
 * the dispatch list remains independent
 * of other frontend pages.
 */
function getDeliveryWindowText(
  deliveryRange
) {

  switch (deliveryRange) {

    case "MORNING":
      return "Morning";

    case "MIDMORNING":
      return "Late Morning";

    case "AFTERNOON":
      return "Afternoon";

    case "EVENING":
      return "Evening";

    default:
      return "Unknown";

  }

}


/**
 * Initialize page.
 */
fetchDispatches();