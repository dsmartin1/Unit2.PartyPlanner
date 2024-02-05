const COHORT = "2311-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getEvents();
  renderEvents();
}
render();

/**
 * Update state with events from API
 */
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render events from state
 */
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events found.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${event.name}</h2>
      <p>${event.description}</p>
      <p>${event.date}</p>
      <p>${event.location}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    li.append(deleteButton);
    deleteButton.addEventListener("click", deleteEvent(event, () => { deleteEvent(event.id); }));

    return li;
  });

  eventList.replaceChildren(...eventCards);
  console.log(state.events);
}

/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */
async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: addEventForm.date.value,
        location: addEventForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask the API to delete an event based on id
 */
async function deleteEvent(eventID) {
  
    try {
      const response = await fetch(`${API_URL}/${eventID}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
  
      render();
    } catch (error) {
      console.error(error);
    }
  }
