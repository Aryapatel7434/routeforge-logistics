var selectedRange = null;

var isFiltered = false;


/**
 * Fetch all vehicles from the backend.
 */
async function fetchVehicles() {

  try {

    const response = await fetch(
      "http://localhost:8070/vehicles"
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const vehicles = await response.json();

    const vehicleSelect =
      document.getElementById("vehicle");

    vehicleSelect.innerHTML = "";


    /*
     * Use the first vehicle's delivery range
     * as the initial dispatch filter.
     */
    setRange(
      vehicles[0]?.deliveryRange
    );


    vehicles.forEach((vehicle) => {

      const option =
        document.createElement("option");


      option.value = vehicle.id;


      /*
       * Store the backend enum directly.
       * This avoids depending on translated text.
       */
      option.dataset.deliveryRange =
        vehicle.deliveryRange;


      option.textContent =
        `Vehicle Type: ${vehicleTypeEnumToText(
          vehicle.vehicleType
        )} | License Plate: ${
          vehicle.licensePlate
        } | Delivery Window: ${
          deliveryRangeEnumToText(
            vehicle.deliveryRange
          )
        }`;


      vehicleSelect.appendChild(option);

    });


  } catch (error) {

    alert(
      `Failed to load vehicles: ${error.message}`
    );

  }

}


/**
 * Handle vehicle selection.
 */
document
  .getElementById("vehicle")
  .addEventListener(
    "change",
    async (event) => {

      const vehicleSelect =
        document.getElementById("vehicle");


      const selectedOption =
        vehicleSelect.options[
          vehicleSelect.selectedIndex
        ];


      /*
       * Read the original backend enum.
       *
       * Example:
       * MORNING
       * AFTERNOON
       * EVENING
       */
      const range =
        selectedOption.dataset.deliveryRange;


      setRange(range);

      clearDispatches();

      await fetchDispatches();

    }
  );


/**
 * Set currently selected delivery range.
 */
function setRange(range) {

  selectedRange = range;

}


/**
 * Remove all dispatch options.
 */
function clearDispatches() {

  const dispatchSelect =
    document.getElementById("dispatch");


  while (
    dispatchSelect.options.length > 0
  ) {

    dispatchSelect.remove(0);

  }

}


/**
 * Fetch dispatches and filter them
 * according to the selected vehicle.
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


    var dispatches =
      await response.json();


    const dispatchSelect =
      document.getElementById("dispatch");


    var filteredDispatches = [];


    /*
     * Delivery-window compatibility rules.
     *
     * Morning <-> Late Morning
     * Afternoon <-> Evening
     */
    dispatches.forEach((dispatch) => {


      if (
        dispatch.deliveryRange ===
        selectedRange
      ) {

        filteredDispatches.push(
          dispatch
        );

      }

      else if (
        dispatch.deliveryRange === "MORNING" &&
        selectedRange === "MIDMORNING"
      ) {

        filteredDispatches.push(
          dispatch
        );

      }

      else if (
        dispatch.deliveryRange === "MIDMORNING" &&
        selectedRange === "MORNING"
      ) {

        filteredDispatches.push(
          dispatch
        );

      }

      else if (
        dispatch.deliveryRange === "AFTERNOON" &&
        selectedRange === "EVENING"
      ) {

        filteredDispatches.push(
          dispatch
        );

      }

      else if (
        dispatch.deliveryRange === "EVENING" &&
        selectedRange === "AFTERNOON"
      ) {

        filteredDispatches.push(
          dispatch
        );

      }

    });


    /*
     * If the preferred-time filter is enabled,
     * keep only dispatches that contain
     * a preferred delivery time.
     */
    dispatches = [];


    filteredDispatches.forEach(
      (dispatch) => {

        if (isFiltered) {

          if (
            isExistPreferedDeliveryTime(
              dispatch
            )
          ) {

            dispatches.push(
              dispatch
            );

          }

        }

      }
    );


    const dispatchesToDisplay =
      isFiltered
        ? dispatches
        : filteredDispatches;


    /*
     * Display dispatches.
     */
    dispatchesToDisplay.forEach(
      (dispatch) => {

        const option =
          document.createElement("option");


        option.value =
          dispatch.id;


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


        option.textContent =
          `Customer: ${
            dispatch.customer?.firstName ??
            "Unknown"
          } ${
            dispatch.customer?.lastName ??
            ""
          } | Preferred Time: ${
            preferredTime
          } | Delivery Window: ${
            deliveryRangeEnumToText(
              dispatch.deliveryRange
            )
          }`;


        dispatchSelect.appendChild(
          option
        );

      }
    );


  } catch (error) {

    alert(
      `Failed to load dispatches: ${error.message}`
    );

  }

}


/**
 * Create vehicle-dispatch assignment.
 */
document
  .getElementById("cargoForm")
  .addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const selectDispatch =
        document.getElementById(
          "dispatch"
        );


      /*
       * Convert selected dispatch options
       * into the backend request format.
       */
      const selectedDispatches =
        Array.from(
          selectDispatch.selectedOptions
        ).map(
          (option) => ({
            id: parseInt(
              option.value
            ),
          })
        );


      /*
       * Prevent empty assignment.
       */
      if (
        selectedDispatches.length === 0
      ) {

        alert(
          "Please select at least one dispatch."
        );

        return;

      }


      const data = {

        vehicle: {

          id: parseInt(
            document.getElementById(
              "vehicle"
            ).value
          ),

        },

        dispatch:
          selectedDispatches,

      };


      try {

        const response =
          await fetch(
            "http://localhost:8070/dispatch-vehicles",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(data),
            }
          );


        if (!response.ok) {

          throw new Error(
            await response.text()
          );

        }


        alert(
          "Dispatch assignment created successfully!"
        );


        document
          .getElementById(
            "cargoForm"
          )
          .reset();


        /*
         * Reload dispatches after
         * successful assignment.
         */
        clearDispatches();

        await fetchDispatches();


      } catch (error) {

        alert(
          `Failed to create dispatch assignment: ${error.message}`
        );

      }

    }
  );


/**
 * Toggle preferred delivery-time filter.
 */
function filterByTime() {

  var checkBox =
    document.getElementById(
      "myCheck"
    );


  isFiltered =
    checkBox.checked;


  clearDispatches();

  fetchDispatches();

}


/**
 * Initialize page.
 */
try {

  fetchVehicles().then(
    () => {

      fetchDispatches();

    }
  );

} catch (error) {

  alert(
    `Failed to load page: ${error.message}`
  );

}