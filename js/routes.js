// INITIALIZE USAGE INTERVAL
let usageInterval = null; 

// INIT THE STORING OF INSTANCE START TIMES
const instanceStartTimes = new Map();


// LAUNCH TRUCK VIDEO LOGIC
// List of video files in the /videos/ folder
const videoFiles = [
    "TAG.mp4", 
    "Sienna.mp4", 
    "Vectar.mp4",
    "Flowics.mp4", 
    "LAMA.mp4"
    ];

// Select a random video from the list
function getRandomVideo() {
    const randomIndex = Math.floor(Math.random() * videoFiles.length);
    return "videos/" + videoFiles[randomIndex];
    }

     
// Default configurations
const productConfigurationsLoad = {
    small: {
        "orchestration": "Ateme PILOT", 
        "td console": "Vizrt Vectar",  
        "multiviewer": "TAG Mosaic",
        "graphics": "Singular.live",
        "vtr replay": "Vizrt 3Play",
        "audio": "LAMA Mix",
        "comms": "Telos Infinity VIP",
        "processing": "Ateme TITAN"
      },
  
      medium: {
        "orchestration": "Gallery Sienna", 
        "td console": "Vizrt Vectar",  
        "multiviewer": "TAG Mosaic",
        "graphics": "Singular.live",
        "vtr replay": "Vizrt 3Play",
        "audio": "LAMA Mix",
        "comms": "Telos Infinity VIP",
        "processing": "Gallery Sienna"
      },
  
      large: {
        "orchestration": "Ateme PILOT", 
        "td console": "GV AMPP", 
        "multiviewer": "TAG Mosaic",
        "graphics": "Singular.live",
        "vtr replay": "Riedel ViBox",
        "audio": "LAMA Mix",
        "comms": "Telos Infinity VIP",
        "processing": "Gallery Sienna"
      },
  };
  
  // Recommendations with truck sizes
  const recommendationsLoad = {
    small: { truck: "Sprinter", value: 10 },
    medium: { truck: "Medium Truck (36')", value: 20 },
    large: { truck: "Large Truck (53')", value: 30 }
  };
  
  // Initial templates data (with a RESET template)
  let templatesData = [
    {
      template_id: 0,
      template_name: "RESET",
      products: {}
    }
  ];
  
  // Function to add default templates based on user recommendations
  function addDefaultTemplates() {
    for (const size in recommendationsLoad) {
      const templateName = recommendationsLoad[size].truck;
      const products = productConfigurationsLoad[size];
      
      // Check if template already exists
      const templateExists = templatesData.some(template => template.template_name === templateName);
  
      if (!templateExists) {
        templatesData.push({
          template_id: templatesData.length,
          template_name: templateName,
          products: products
        });
      }
    }
  }


// ON DOM LOAD
document.addEventListener("DOMContentLoaded", function () {
    // console.log("DOM fully loaded");

    // PREVENT LOAD LOOP
    const currentPage = window.location.pathname.split("/").pop();

    // === AUTHENTICATION CHECK - Redirect if no token ===
    let authToken = localStorage.getItem("authToken");

    if (!authToken || authToken === "undefined" || authToken === "null") {
        if (currentPage !== "login.html" && currentPage !== "register.html") {
            console.warn("No token found, redirecting to login...");
            window.location.href = "login.html";
            return; // STOP further script execution
        }
    }

    // === DELAY OTHER INITIALIZATIONS TO PREVENT ERRORS ===
    setTimeout(() => {
        initializePageScripts();
    }, 100); // Small delay to ensure all elements are available
});


// INITIAZE ON PAGE LOAD SCRIPTS
function initializePageScripts() {
    // console.log("Initializing page scripts...");

    // Set the random video for LaunchTruck Button
    if(document.getElementById('launchTruck')){
    document.getElementById('launchTruck').setAttribute('data-video', getRandomVideo());
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            loginUser(event); // LOG IN
        });
    } 

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            registerUser(event);
        });
    } 

    const eventSchedulingForm = document.getElementById("event-form")
    if (eventSchedulingForm){
        submitSchedulingForm()
    }

    // FORCE INCLUDED PRODUCTS -- LEGACY
    const productSelection = document.getElementById("product-selection");
    if (productSelection){

      const siennaCheckbox = document.querySelector('input[name="product"][value="2"]');
      const vectarCheckbox = document.querySelector('input[name="product"][value="1"]');
  
      if (siennaCheckbox) {
          siennaCheckbox.checked = true;
          siennaCheckbox.disabled = true;
      }
  
      if (vectarCheckbox) {
          vectarCheckbox.checked = true;
          vectarCheckbox.disabled = true;
      }
    }


    // FETCH ALL USER EVENTS
    if (document.querySelector("#event-table tbody")){
        fetchUserEvents();
    }

    // REFRESH ALL USER EVENTS ON CLICK
    const refreshButton = document.getElementById("event-details-refresh-button")
    if (refreshButton){
        refreshButton.addEventListener("click", refreshEventDetails) 
    }

    // SAVE TRUCK CONFIG SELECTIONS IN LOCAL STORAGE
    document.querySelectorAll("select").forEach((vrtruckDropdown) => {
        // Load previous selection from localStorage
        let storedValue = localStorage.getItem(vrtruckDropdown.id);
        if (storedValue) {
            vrtruckDropdown.value = storedValue;
        }

        vrtruckDropdown.addEventListener("change", (event) => {
            let selectedValue = event.target.value;
        
            localStorage.setItem(vrtruckDropdown.id, selectedValue);  
        });
    });

    // FORCE DEFAULT TRUCK DROPDOWN VALUE
    let vrtruckDropdownItem = document.getElementById("vrtruck-audio")
    if (vrtruckDropdownItem){
        document.querySelectorAll(".truck-dropdown-item").forEach((dropdown) => {
            dropdown.value = "";
            localStorage.removeItem(dropdown.id);
        });
        
    }

    // POPULATE USER TEMPLATES
    let templateDropdownList = document.getElementById("template-dropdown")
    if (templateDropdownList){
        fetchUserTemplates()
    }

    // SAVE A TEMPLATE
    let saveTemplateButton = document.getElementById('save-template')
    if(saveTemplateButton){
        document.getElementById('save-template').addEventListener('click', saveTemplate)
    }

    // LOAD A TEMPLATE
    let loadButton = document.getElementById("load-template");
    if (loadButton) {
        loadButton.addEventListener("click", handleLoadButtonClick);
    }

    // DELETE A TEMPLATE
    let deleteButton = document.getElementById("delete-template");
    if (deleteButton) {
        deleteButton.addEventListener("click", handleDeleteButtonClick);
    }
    

    // REFRESH USER EVENTS
    const eventsRefreshButton = document.getElementById("events-refresh-button")
    if (eventsRefreshButton){
        eventsRefreshButton.addEventListener("click", refreshEvents) 
    }

    // DELETE EVENT FROM EVENT DETALS PAGE
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-event")) {
            event.preventDefault();

            let eventId = getEventIdFromUrl();

            if (eventId) {
                deleteEvent(eventId);
            } else {
                console.error("Event ID not found in URL.");
                alert("Error: Event ID is missing.");
            }
        }
    });

    // FETCH MACHINE USAGE WHEN AVAILABLE
    if (document.querySelector(".stats-table tbody")){
        fetchMachineUsage();
    }

    // Fetch event details only if `event_id` exists in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event_id');

    if (eventId) {
        fetchEventDetails();
    }

    // 'LAUNCH TRUCK' BUTTON
    document.addEventListener("click", function (event) {

        if (event.target.classList.contains("launch-truck")) {
            event.preventDefault();

            let videoUrl = event.target.getAttribute("data-video");
            let modal = document.getElementById("videoModal");
            let video = document.getElementById("modalVideo");

            // ====== DEMO ========
            // TURN ON ALL INSTANCES ON CLICK
            setTimeout(() => {
                let launchSliders = document.querySelectorAll(".toggle-switch input[type='checkbox']");
                
                if (launchSliders){
                    launchSliders.forEach(checkbox => {
                        checkbox.checked = true; 
                        checkbox.dispatchEvent(new Event('change')); 
                    });
                }

            }, 500);
            // ====== /DEMO =======

            if (videoUrl) {
                video.src = videoUrl + "?autoplay=1";
                modal.style.display = "flex"; 
                video.play().catch(error => console.log("Auto-play blocked:", error));
            }
        }

        // Close modal when clicking the close button
        if (event.target.classList.contains("close")) {
            let modal = document.getElementById("videoModal");
            let video = document.getElementById("modalVideo");
            
            modal.style.display = "none";
            video.pause(); // Stop video
            video.src = ""; // Reset video source
        }

        // Close modal when clicking outside the video
        let modal = document.getElementById("videoModal");
        if (event.target === modal) {
            modal.style.display = "none";
            let video = document.getElementById("modalVideo");
            video.pause();
            video.src = "";
        }
    });

    // Ensure "X" button is always clickable in landscape mode
    window.addEventListener("resize", function () {
        let closeButton = document.querySelector(".close");
        if (closeButton) {
            closeButton.style.zIndex = "9999"; // Ensure "X" stays on top
            closeButton.style.position = "absolute"; // Fix position issue
        }
    });

    // ATTACH LOGOUT SCRIPT
    document.addEventListener("click", function (event) {
        if (event.target.id === "logout-link") {
            logoutUser();
        }
    });
    

    // DEVELOPMENT VALUE FOR USAGE ONCE USER LOGS IN
    if (localStorage.getItem("aws_customer_id") && localStorage.getItem("usage_tracking_active")) {
        console.log("Restarting usage tracking after page reload...");

        // DEVELOPMENTAL
        // startUsageTracking();
    }

}

// =============================
// ======== ROUTES ============
// =============================

// REGISTER NEW USER
function registerUser(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let errorMessage = document.getElementById("error-message");
    let successMessage = document.getElementById("success-message");

    // VALIDATE PW
    if (password !== confirmPassword) {
        errorMessage.innerText = "Passwords do not match.";
        errorMessage.classList.remove("hidden");
        return;
    }

    let requestData = { name, email, password};

    fetch("https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            errorMessage.innerText = data.error;
            errorMessage.classList.remove("hidden");
        } else {
            errorMessage.classList.add("hidden");
            successMessage.classList.remove("hidden");

        if (data.token) {
            localStorage.setItem("authToken", data.token);
        }
            
            // REDIRECT TO LOG IN PAGE
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    })
    .catch(error => {
        console.error("Registration error:", error);
        errorMessage.innerText = "Error registering. Please try again.";
        errorMessage.classList.remove("hidden");
    });
}


// USER LOGIN
function loginUser(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("error-message");

    // USER LOGIN API CALL
    fetch("https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/login", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            errorMessage.innerText = data.error;
            errorMessage.classList.remove("hidden");
        } else {
            errorMessage.classList.add("hidden");

            // STORE SESSION TOKEN
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userId", data.user_id);
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("aws_customer_id", data.aws_customer_id);
            localStorage.setItem("aws_account_id", data.aws_account_id);
            localStorage.setItem("aws_product_code", data.aws_product_code);
            // localStorage.setItem("usage")

            // DEVELOPMENT - START USAGE TRACKING ON LOG IN
            // startUsageTracking();

            // Redirect to index.html
            window.location.href = "index.html";
        }
    })
    .catch(error => {
        console.error("Login error:", error);
        errorMessage.innerText = "Error logging in. Please try again.";
        errorMessage.classList.remove("hidden");
    });
}

// LOGOUT USER 
function logoutUser() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("aws_customer_id");
    localStorage.removeItem("aws_account_id");
    localStorage.removeItem("aws_product_code");
    localStorage.setItem("loggedIn", "false");

    console.log("User logged out.");

    // DEVELOPMENT - STOP USAGE TRACKING ONCE THE USER LOGS OUT
    // stopUsageTracking();

    window.location.href = "login.html";
}

// ========== DEV ===============

// SUBMIT EVENT SCHEDULING FORM
function submitSchedulingForm(){
    document.getElementById("event-form").addEventListener("submit", function (e) {
        e.preventDefault();

        // VERIFY SESSION
        let authToken = localStorage.getItem("authToken");
        if (!authToken) {
            alert("You must be logged in to submit an event.");
            window.location.href = "login.html";
            return;
        }

        // GET SELECTED PRODUCTS FROM DROPDOWN MENUS
        let productCategories = {
            "vrtruck-orchestration": "signal orchestration",
            "vrtruck-tdconsole": "td console",
            "vrtruck-multiviewer": "multiviewer",
            "vrtruck-graphics": "graphics",
            "vrtruck-vtr": "vtr replay",
            "vrtruck-audio": "audio",
            "vrtruck-comms": "comms",
            "vrtruck-processing": "processing",   
        };

        let products = [];

        Object.keys(productCategories).forEach(id => {
            let dropdown = document.getElementById(id);
            if (dropdown && dropdown.value !== "Select an option") {
                products.push(dropdown.value.toLowerCase()); 
            }
        });

        // DETERMINE API URL BASED ON TOGGLE SWITCH STATE
        let toggleSwitch = document.querySelector(".vrtruck-checkbox");
        // let isProd = toggleSwitch.checked; // true = PROD, false = DEV

        // FORCE DEV
        isProd = false

        let submitApiUrl = isProd 
            ? "https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/submit" // PROD URL
            : "https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/dev-submit"; // DEV URL
        
        // SUBMIT FORM API CALL
        fetch(submitApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                event_name: document.getElementById("event-name").value,
                start_date: document.getElementById("start-date").value,
                end_date: document.getElementById("end-date").value,
                message: document.getElementById("message").value,
                product_ids: products
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                console.error("Form submission error:", data.error);
                alert("Error submitting form: " + data.error);
            } else {
                alert("Event created successfully!");
            }

            document.getElementById("event-form").reset();
        })
        .catch(error => {
            console.error("Error submitting form:", error);
            alert("Error submitting form, please try again.");
        });
    });
}


// ============== DEV ===================
function fetchUserEvents() {
    let authToken = localStorage.getItem("authToken");

    // SET HEADERS
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    // GET ALL EVENTS API CALL
    fetch("https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/events", {
        method: "GET",
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
        let tableBody = document.querySelector("#event-table tbody");
    
        if (!tableBody) {
            console.error("Table body not found!");
            return;
        }
    
        tableBody.innerHTML = ""; 
    
        if (!data.events || data.events.length === 0) {
            let noDataRow = document.createElement("tr");
            noDataRow.innerHTML = `<td colspan="11" class="text-center py-3 text-gray-500">No events found for this user.</td>`;
            tableBody.appendChild(noDataRow);
            return;
        }
    
        // Map lowercase API categories to table headers
        const categoryMap = {
            "orchestration": "Orchestration",
            "td console": "TD Console",
            "multiviewer": "MultiViewer",
            "graphics": "Graphics",
            "vtr replay": "VTR Replay",
            "audio": "Audio",
            "comms": "Comms",
            "processing": "Processing",
        };
    
        // FORMAT PRODUCT NAMES (capitalize and remove "_demo") 
        function formatProductName(product) {
            if (!product) return "";
            return product
                .replace(/_demo$/i, "") // Remove "_demo" if it exists (case-insensitive)
                .split(" ")  
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))  
                .join(" ");  
        }
    
        data.events.forEach(event => {
            let row = document.createElement("tr");
            row.classList.add("event-row");

            const productNames = Array.isArray(event.products) ? event.products : event.products.split(", ");
            const productCategories = Array.isArray(event.categories) ? event.categories : event.categories.split(", ");


            let categorizedProducts = {};
    
            productNames.forEach((product, index) => {
                let category = productCategories[index]?.toLowerCase();
                let mappedCategory = categoryMap[category];
    
                if (mappedCategory) {
                    if (!categorizedProducts[mappedCategory]) {
                        categorizedProducts[mappedCategory] = [];
                    }
                    categorizedProducts[mappedCategory].push(formatProductName(product));
                }
            });


            // SET EVENT DATES
            let eventDates = formatDateRange(event.start_date, event.end_date)


            // Normal Table Row (Desktop) / Collapsible UI (Mobile)
            row.innerHTML = `
                <td class="py-3 px-4 text-left event-name">
                    <a href="event-details.html?event_id=${event.id}" class="text-blue-500 hover:underline">${event.event_name}</a>
                    <button class="expand-arrow">▼</button>
                </td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${eventDates}</td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${categorizedProducts["Orchestration"] ? categorizedProducts["Orchestration"].join(", ") : "—"}</td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${categorizedProducts["TD Console"] ? categorizedProducts["TD Console"].join(", ") : "—"}</td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${categorizedProducts["MultiViewer"] ? categorizedProducts["MultiViewer"].join(", ") : "—"}</td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${categorizedProducts["Graphics"] ? categorizedProducts["Graphics"].join(", ") : "—"}</td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${categorizedProducts["VTR Replay"] ? categorizedProducts["VTR Replay"].join(", ") : "—"}</td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${categorizedProducts["Audio"] ? categorizedProducts["Audio"].join(", ") : "—"}</td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${categorizedProducts["Comms"] ? categorizedProducts["Comms"].join(", ") : "—"}</td>
                <td class="py-3 px-4 text-center va-middle desktop-only">${categorizedProducts["Processing"] ? categorizedProducts["Processing"].join(", ") : "—"}</td>
            `;
    
            let detailsRow = document.createElement("tr");
            detailsRow.classList.add("event-details");
            detailsRow.style.display = "none";
    
            detailsRow.innerHTML = `
                <td colspan="11">
                    <div class="details-content">
                        <p><strong>Dates:</strong> ${eventDates}</p>
                        <p><strong>Orchestration:</strong> ${categorizedProducts["Orchestration"] ? categorizedProducts["Orchestration"].join(", ") : "—"}</p>
                        <p><strong>TD Console:</strong> ${categorizedProducts["TD Console"] ? categorizedProducts["TD Console"].join(", ") : "—"}</p>
                        <p><strong>MultiViewer:</strong> ${categorizedProducts["MultiViewer"] ? categorizedProducts["MultiViewer"].join(", ") : "—"}</p>
                        <p><strong>Graphics:</strong> ${categorizedProducts["Graphics"] ? categorizedProducts["Graphics"].join(", ") : "—"}</p>
                        <p><strong>VTR Replay:</strong> ${categorizedProducts["VTR Replay"] ? categorizedProducts["VTR Replay"].join(", ") : "—"}</p>
                        <p><strong>Audio:</strong> ${categorizedProducts["Audio"] ? categorizedProducts["Audio"].join(", ") : "—"}</p>
                        <p><strong>Comms:</strong> ${categorizedProducts["Comms"] ? categorizedProducts["Comms"].join(", ") : "—"}</p>
                        <p><strong>Processing:</strong> ${categorizedProducts["Processing"] ? categorizedProducts["Processing"].join(", ") : "—"}</p>
                        
                        <div class="asg_tm_button" style="float: none; text-align: center;">
                            <a href="#" class="launch-truck" data-video="">Launch Truck</a>
                        </div>
                    </div>

                </td>
            `;
    
            tableBody.appendChild(row);
            tableBody.appendChild(detailsRow);
        });
    
        attachToggleListeners();
    })
    
    .catch(error => {
        console.error("Error fetching events:", error);

        let tableBody = document.querySelector("#event-table tbody");
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-red-500">Error loading events.</td></tr>`;
    });
}


// Function to attach toggle behavior (mobile only)
function attachToggleListeners() {
    document.querySelectorAll(".expand-arrow").forEach(button => {
        button.addEventListener("click", function () {
            const row = this.closest(".event-row");
            const detailsRow = row.nextElementSibling;

            if (detailsRow && detailsRow.classList.contains("event-details")) {
                detailsRow.style.display = detailsRow.style.display === "table-row" ? "none" : "table-row";
                this.style.transform = detailsRow.style.display === "table-row" ? "rotate(180deg)" : "rotate(0deg)";
            }
        });
    });
}


// ============== /DEV ==================

// START/STOP INSTANCE
async function controlInstance(instanceId, action) {
    const apiUrl = `https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/instance/${instanceId}`;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ action }) 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Returns instance state
    } catch (error) {
        console.error("Error controlling instance:", error);
    }
}


// REPORT USAGE METRICS TO THE BACKEND
async function reportUsage(instanceId, usageType, quantity, startTime, endTime) {
    const awsCustomerID = localStorage.getItem("aws_customer_id");
    const awsProductCode = localStorage.getItem("aws_product_code");

    if (!awsCustomerID || !awsProductCode) {
        console.error("Missing AWS Customer ID or Product Code.");
        return;
    }

    try {
        const response = await fetch("https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                aws_customer_id: awsCustomerID,
                aws_product_code: awsProductCode,
                instance_id: instanceId,
                usage_type: usageType,
                quantity: quantity,
                start_time: startTime, 
                end_time: endTime
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Usage reported for ${instanceId}:`, data);

    } catch (error) {
        console.error("Error reporting usage:", error);
    }
}

// FETCH AN EVENT
async function fetchEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("event_id");
    const authToken = localStorage.getItem("authToken");

    let headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    try {
        const eventResponse = await fetch(`https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/event/${eventId}`, {
            method: "GET",
            headers: headers
        });

        if (!eventResponse.ok) throw new Error(`HTTP error! Status: ${eventResponse.status}`);

        const eventData = await eventResponse.json();

        if (eventData.error) {
            alert("Error fetching event details: " + eventData.error);
            return;
        }

        // SET EVENT DATES
        let eventDates = formatDateRange(eventData.start_date, eventData.end_date)

        document.getElementById("event-name").textContent = eventData.event_name;
        document.getElementById("event-dates").textContent = eventDates;
        // document.getElementById("event-end").textContent = eventData.end_date;
        document.getElementById("event-message").textContent = eventData.message;

        const productContainer = document.getElementById("event-products");

        // SHOW LOADING SPINNER FOR PRODUCTS
        productContainer.innerHTML = `
        <div id="loading-spinner-container" class="loading-spinner-container">
            <div class="loading-spinner"></div>
            <p>Loading products...</p>
        </div>
`;

        if (!eventData.products || eventData.products.length === 0) {
            // REMOVE SPINNER
            const loadingSpinner = document.getElementById("loading-spinner-container");
            if (loadingSpinner) loadingSpinner.remove();

            productContainer.innerHTML = "<p>No products selected for this event.</p>";
            return;
        }

        // FETCH INSTANCE DETAILS
        const instanceResponse = await fetch("https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/instances", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!instanceResponse.ok) throw new Error(`HTTP error! Status: ${instanceResponse.status}`);

        const instanceData = await instanceResponse.json();

        // REMOVE SPINNER SAFELY AFTER SUCCESSFUL FETCH
        const loadingSpinner = document.getElementById("loading-spinner-container");
        if (loadingSpinner) loadingSpinner.remove();

        // CLEAR CONTAINER
        productContainer.innerHTML = ""; 

        eventData.products.forEach(productName => {
            let productElement = document.createElement("div");
            productElement.className = "product-item";


            let instance = instanceData.find(inst => inst.product_name === productName);
            let instanceId = instance ? instance.instance_id : null;
            let statusText = instance ? `Status: ${instance.status}` : "Status: Unknown";

            let toggleContainer = document.createElement("div");
            toggleContainer.className = "toggle-container";

            let toggleSwitch = document.createElement("label");
            toggleSwitch.className = "toggle-switch";

            let input = document.createElement("input");
            input.type = "checkbox";

            // ======== PRODUCTION ========
            // DISABLE THE BUTTON FOR PRODUCTS WITHOUT AN INSTANCE ID
            // input.disabled = !instanceId;
            // ======== PRODUCTION ========

            let slider = document.createElement("span");
            slider.className = "slider";

            // ==== PRODUCTION =====
            // Set initial toggle state based on instance status
            // if (instance) {
            //     if (instance.status.toLowerCase() === "running") {
            //         input.checked = true;
            //         slider.style.backgroundColor = "green";
            //         instanceStartTimes.set(instanceId, new Date()); 
            //     } else if (instance.status.toLowerCase() === "starting") {
            //         input.checked = true;
            //         slider.style.backgroundColor = "orange";
            //         input.disabled = true;
            //     } else {
            //         slider.style.backgroundColor = "red";
            //     }
            // }
            // ==== /PRODUCTION ===

            // ======= DEMO ========
                if (input.checked) {
                    slider.style.backgroundColor = "green";
                } else {
                    slider.style.backgroundColor = "red";
                }

            // ======= /DEMO =======



            toggleSwitch.appendChild(input);
            toggleSwitch.appendChild(slider);
            toggleContainer.appendChild(toggleSwitch);

            // ==== DEMO ====
            let productCategoryLabel = document.createElement("p");
            productCategoryLabel.style.marginLeft = "5px"
            productCategoryLabel.style.padding = "5px"
            productCategoryLabel.style.textTransform = "uppercase"
            productCategoryLabel.style.lineHeight = "13px"
            productCategoryLabel.style.borderRadius = "8px"

            if (input.checked){
                productCategoryLabel.style.border = "2px solid green"
                productCategoryLabel.innerHTML = instance.category
            } else {
                productCategoryLabel.style.border = "2px solid red"
                productCategoryLabel.innerHTML = instance.category
            }

            toggleContainer.appendChild(productCategoryLabel)
            toggleContainer.style.display = "inline-flex"
            toggleContainer.style.justifyContent = "center !important"

            slider.style.height


            // ==== /DEMO ====

            let productInfo = document.createElement("div");

            // Remove _demo from product name for front end
            let cleanProductName = productName.replace(/_demo$/, "");

            // ===== PRODUCTION =====
            // productInfo.innerHTML = `<span>${cleanProductName}</span><p><strong>${statusText}</strong></p>`;

            // ===== DEMO =====
            productInfo.innerHTML = `<span>${cleanProductName}</span>`;
            // ===== /DEMO ====

            let accessLinkElement = document.createElement("p");
            accessLinkElement.className = "access-vm";

            // GET SECRET VALUE
            let instanceAccessData = instance && instance.access_data ? instance.access_data.secret_value : null;
            
            // ===== PRODUCTION =====
            // CHECK FOR DCV DOWNLOAD LINK OR SECRET
            // if (instanceAccessData) {
            //     if (instanceAccessData.url){
            //         accessLinkElement.innerHTML = `<a href="${instanceAccessData.url}" target="_blank">Access VM</a>`;
            //     } else {
            //         accessLinkElement.innerHTML = `<a href="${instanceAccessData.dcv}" download>Download</a>`;
            //     }
            // } else {
            //     accessLinkElement.innerHTML = `<p>No Access</p>`;
            // }

            // ===== DEMO =====
            if (instanceAccessData) {
                if (instanceAccessData.url){
                    accessLinkElement.innerHTML = `
                    <div style="display: inline-flex;">
                        <a style="flex: 1; padding: 0 10px;"href="#" target="_blank">OPEN</a>
                        <a style="flex: 1; padding: 0 10px;" href="#">CONFIGURE</a>
                    </div>
                    
                    `;
                } else {
                    accessLinkElement.innerHTML = `
                    <div style="display: inline-flex;">
                        <a style="flex: 1; padding:0 10px;" href="#" download>OPEN</a>
                        <a style="flex: 1; padding: 0 10px;" href="#">CONFIGURE</a>

                    `;
                }
            } else {
                accessLinkElement.innerHTML = `
                <div style="display: inline-flex;">
                    <a style="flex: 1; padding: 0 10px;"href="#" download>OPEN</a>
                    <a style="flex: 1; padding: 0 10px;" href="#">CONFIGURE</a>

                `;
            }
            // ===== /DEMO =====
            
            

            productElement.appendChild(toggleContainer);
            productElement.appendChild(productInfo);
            productElement.appendChild(accessLinkElement);

            // ADD TOGGLE SWITCH EVENT LISTENER
                // ====== PRODUCTION ======
                // input.addEventListener("change", async function () {
                //     if (!instanceId) return;

                //     input.disabled = true;
                //     slider.style.backgroundColor = "orange";

                //     let newState = await controlInstance(instanceId, this.checked ? "start" : "stop");

                //     if (newState) {
                //         if (newState === "running") {
                //             slider.style.backgroundColor = "green";
                //             const startTime = new Date().toISOString();
                //             instanceStartTimes.set(instanceId, startTime); 
                //         } else {
                //             slider.style.backgroundColor = "red";
                //             const startTime = instanceStartTimes.get(instanceId)
                //             const endTime = new Date().toISOString();

                //             if (startTime) {
                //                 let duration = Math.round((new Date() - startTime) / 60000);
                //                 console.log(`Instance ${instanceId} was ON for ${duration} minutes`);

                //                 // Report API minutes used
                //                 await reportUsage(instanceId, "api_minutes_used", duration, startTime, endTime);

                //                 // DELETE INSTANCE FROM DICT ONCE STOPPED
                //                 instanceStartTimes.delete(instanceId);
                //             }
                //         }
                //     } else {
                //         this.checked = !this.checked;
                //     }

                //     input.disabled = false;
                // });
            // ===== /PRODUCTION ========

            // ====== DEMO =======
                input.addEventListener("change", async function () {
                    // if (!instanceId) return;

                    // input.disabled = true;
                    // slider.style.backgroundColor = "orange";

                    // let newState = await controlInstance(instanceId, this.checked ? "start" : "stop");

                    if (input) {
                        if (input.checked) {
                            slider.style.backgroundColor = "green";
                            productCategoryLabel.style.border = "2px solid green"
                            productCategoryLabel.innerHTML = instance.category
                            // const startTime = new Date().toISOString();
                            // instanceStartTimes.set(instanceId, startTime); 
                        } else {
                            slider.style.backgroundColor = "red";
                            productCategoryLabel.style.border = "2px solid red"
                            productCategoryLabel.innerHTML = instance.category
                            // const startTime = instanceStartTimes.get(instanceId)
                            // const endTime = new Date().toISOString();
                        }
                    } else {
                        this.checked = !this.checked;
                    }

                    input.disabled = false;
                });

            // ====== /DEMO ======


            productContainer.appendChild(productElement);
        });

    } catch (error) {
        console.error("Error fetching event details:", error);
        document.getElementById("event-name").textContent = "Event not found. Try refreshing the page or returning to the events list.";
        document.getElementById("event-dates").textContent = "N/A";
        // document.getElementById("event-end").textContent = eventData.end_date;
        document.getElementById("event-message").textContent = "N/A";
    }
}

// REFRESH PRODUCTS BUTTON - EVENT DETAILS
async function refreshEventDetails(){
        console.log("Refreshing products...");
        
        // REFRESH EVENT DETAILS
        await fetchEventDetails();
    };

// REFRESH EVENTS BUTTON
function refreshEvents(){
    console.log("Refreshing events...");
    
    // REFRESH EVENT DETAILS
    fetchUserEvents();
};

// FETCH MACHINE USAGE STATISTICS
function fetchMachineUsage() {
    let authToken = localStorage.getItem("authToken");

    // SET HEADERS
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    // API CALL TO GET MACHINE USAGE DATA
    fetch("https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/machine-usage", {
        method: "GET",
        headers: headers
    })
    .then(response => response.json()) 
    .then(data => {

        let tableBody = document.querySelector(".stats-table tbody");

        if (!tableBody) {
            console.error("Table body not found!");
            return;
        }

        tableBody.innerHTML = "";

        if (!data.machines || data.machines.length === 0) {
            console.warn("No usage data found for this user.");
            let noDataRow = document.createElement("tr");
            noDataRow.innerHTML = `<td colspan="3" class="text-center py-3 text-gray-500">No usage data available.</td>`;
            tableBody.appendChild(noDataRow);
            return;
        }

        // POPULATE TABLE WITH DATA
        data.machines.forEach(machine => {
            let row = document.createElement("tr");
            row.classList.add("hover:bg-gray-100");

            // CONVERT BYTES TO MB WITH 2 DECIMAL PLACES
            let egressMb = (machine.egress_mb / (1024 * 1024)).toFixed(2);

            row.innerHTML = `
                <td class="py-3 px-4 cap-0">${machine.device_name}</td>
                <td class="py-3 px-4">${machine.minutes_used}</td>
                <td class="py-3 px-4">${egressMb} MB</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error fetching machine usage data:", error);

        let tableBody = document.querySelector(".stats-table tbody");
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center py-3 text-red-500">Error loading data.</td></tr>`;
    });
}


// FORMAT START AND END DATES
function formatDateRange(startDate, endDate) {
    // Convert to date object
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Extract month, day, and two-digit year
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const startYear = start.getFullYear().toString().slice(-2);

    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    const endYear = end.getFullYear().toString().slice(-2);

    // Format date range
    return `${startMonth}/${startDay}/${startYear} - ${endMonth}/${endDay}/${endYear}`;
}


// DELETE EVENT FROM EVENT DETAILS
function deleteEvent(eventId) {
    let authToken = localStorage.getItem("authToken");

    if (!authToken) {
        console.error("Authorization token is missing.");
        return;
    }

    let headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete this event"?`)) {
        return;
    }

    fetch(`https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/event/${eventId}`, {
        method: "DELETE",
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to delete event. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert("Event deleted successfully.");
        // REFRESH PAGE AFTER LOAD
        window.location.reload();
    })
    .catch(error => {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
    });
}


// GET EVENT ID FROM URL
function getEventIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("event_id");
}


// SAVE USER TEMPLATE
async function saveTemplate() {
    let authToken = localStorage.getItem("authToken");

    if (!authToken) {
        console.error("Authorization token is missing.");
        return;
    }

    let headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    let templateName = prompt("Enter template name:");
    if (!templateName) {
        alert("Template name is required!");
        return;
    }

    // GET PRODUCT BY CATEGORY
    let selectedProducts = {};
    document.querySelectorAll('select.truck-dropdown-item').forEach(select => {
        let category = select.closest('.vrtruck-dropdown').querySelector('label').textContent.trim().toLowerCase();
        let product = select.value;

        if (product) {
            selectedProducts[category] = product;
        }
    });

    if (Object.keys(selectedProducts).length === 0) {
        alert("Please select at least one product!");
        return;
    }

    let payload = {
        template_name: templateName,
        products: selectedProducts
    };

    try {
        let response = await fetch('https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/templates', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        let result = await response.json();
        if (response.ok) {
            // Add the new template to the dropdown
            let templateDropdown = document.getElementById('template-dropdown');
            let newOption = document.createElement('option');
            newOption.value = templateName;
            newOption.textContent = templateName;
            templateDropdown.appendChild(newOption);

            // Add new template to `templatesData[]`
            templatesData.push({
                template_id: result.template_id || templatesData.length + 1,
                template_name: templateName,
                products: selectedProducts
            });

            alert("Template saved successfully!");
            await fetchUserTemplates()

            // Immediately load the saved template
            loadTemplateProducts(templateName);
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error saving template:", error);
        alert("Failed to save template.");
    }
}


// GET USER TEMPLATES
async function fetchUserTemplates() {
    let authToken = localStorage.getItem("authToken");

    // SET HEADERS
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    try {
        let response = await fetch('https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/templates', {
            method: 'GET', 
            headers: headers
        });
        let data = await response.json();

        templatesData = data.templates;

        addDefaultTemplates();

        let templateNames = data.templates.map(template => template.template_name);
        
        let templateDropdown = document.getElementById("template-dropdown")
        templateDropdown.innerHTML = '<option value="">SELECT LAYOUT</option>';


        templateNames.forEach(name => {
            var option = document.createElement("option")
            option.innerHTML= name;
            templateDropdown.appendChild(option)
        })

           // Ensure event listener is only added once
        //    templateDropdown.removeEventListener("change", handleTemplateChange);
        //    templateDropdown.addEventListener("change", handleTemplateChange);
    } catch (error) {
        console.error("Error fetching templates:", error);
    }
}

// Handle template selection change
// function handleTemplateChange(event) {
//     let selectedTemplateId = event.target.value;
//     if (selectedTemplateId) {
//         loadTemplateProducts(selectedTemplateId);
//     }
// }

// LOAD BUTTON CLICK
function handleLoadButtonClick() {
    let templateDropdown = document.getElementById("template-dropdown");
    let selectedTemplateId = templateDropdown.value;

    if (selectedTemplateId) {
        loadTemplateProducts(selectedTemplateId);
    } else {
        console.error("No template selected.");
    }
}


// LOAD TEMPLATE
function loadTemplateProducts(templateName) {
    let selectedTemplate = templatesData.find(template => template.template_name === templateName);

    if (!selectedTemplate) {
        console.error(`Template "${templateName}" not found in templatesData`, templatesData);
        return;
    }

    let productCategories = selectedTemplate.products || {};

    // PRODUCT MAPPING DEFINED BY LABELS
    let categoryToDropdownId = {
        "orchestration": "vrtruck-orchestration",
        "td console": "vrtruck-tdconsole",
        "multiviewer": "vrtruck-multiviewer",
        "graphics": "vrtruck-graphics",
        "vtr replay": "vrtruck-vtr",
        "audio": "vrtruck-audio",
        "comms": "vrtruck-comms",
        "processing": "vrtruck-processing"  
    };

    // Get all dropdowns
    let dropdowns = document.querySelectorAll(".truck-dropdown-item");

    dropdowns.forEach(dropdown => {
        let matchingCategory = Object.keys(categoryToDropdownId).find(category => categoryToDropdownId[category] === dropdown.id);

        if (matchingCategory && productCategories[matchingCategory]) {
            dropdown.value = productCategories[matchingCategory];
        } else {
            dropdown.value = ""; 
        }
    });
}


// DELETE TEMPLATE
async function handleDeleteButtonClick() {
    let templateDropdown = document.getElementById("template-dropdown");
    let selectedTemplateName = templateDropdown.value;

    if (!selectedTemplateName) {
        console.error("No template selected for deletion.");
        return;
    }

    // Find the template object by name
    let templateIndex = templatesData.findIndex(template => template.template_name === selectedTemplateName);

    if (templateIndex === -1) {
        console.error("Template not found in templatesData.");
        return;
    }

    let templateId = templatesData[templateIndex].template_id;

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${selectedTemplateName}"?`)) {
        return;
    }

    try {
        let authToken = localStorage.getItem("authToken");

        let response = await fetch('https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/templates', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ template_id: templateId })
        });

        let data = await response.json();

        if (response.ok) {
            console.log(data.message);

            // **Remove from templatesData array first**
            templatesData = templatesData.filter(template => template.template_id !== templateId);

            // Repopulate dropdown list 
            updateTemplateDropdown();

            alert("Template deleted successfully!");
        } else {
            console.error("Failed to delete template:", data.error);
        }
    } catch (error) {
        console.error("Error deleting template:", error);
    }
}

// REPOPULATE DROP DOWN LIST
function updateTemplateDropdown() {
    let templateDropdown = document.getElementById("template-dropdown");

    // Clear all options except the default one
    templateDropdown.innerHTML = '<option value="">SELECT LAYOUT</option>';

    // Repopulate dropdown with updated `templatesData`
    templatesData.forEach(template => {
        let option = document.createElement("option");
        option.value = template.template_name;
        option.textContent = template.template_name;
        templateDropdown.appendChild(option);
    });

    // Reset dropdown selection
    templateDropdown.selectedIndex = 0;
}








//  DEVELOPMENTAL VARIABLES AND WORKFLOW
// START REPORTING USAGE EVERY 5 MINUTES AFTER USER LOGS IN
function startUsageTracking() {
    const awsCustomerID = localStorage.getItem("aws_customer_id");
    const awsProductCode = localStorage.getItem("aws_product_code");
    

    if (!awsCustomerID || !awsProductCode) {
        console.error("Cannot start usage tracking: Missing AWS Customer ID or Product Code.");
        return;
    }

    // AVOID MULTIPLE INTERVALS
    if (localStorage.getItem("usage_tracking_active")) {
        console.log("Usage tracking already running.");
        console.log("USAGE INTERVAL LAREADY RUNNING: " + usageInterval)

        if (usageInterval === null) {
            console.log("Restarting usage tracking interval after page reload...");
            usageInterval = setInterval(() => {
                console.log("📡 Running scheduled usage report...");
                reportUsage("api_minutes_used", 1);
                reportUsage("data_egress_used", 1);
                console.log("Usage reported at:", new Date().toLocaleTimeString());
            }, 300000);
            console.log("Restarted interval. New Interval ID:", usageInterval);
        }
        return;
    }

    // LAUNCH REPORTING METRIC
    reportUsage("api_minutes_used", 1);
    reportUsage("data_egress_used", 1);

    // RUN EVERY 5 MINUTES
    try {
        usageInterval = setInterval(() => {
            console.log("Running scheduled usage report...");
            reportUsage("api_minutes_used", 1);
            reportUsage("data_egress_used", 1);
        }, 300000); // 5 minutes

        console.log("Usage tracking started. Interval ID:", usageInterval);
    } catch (error) {
        console.error("Error setting interval:", error);
    }

    // STORE IN LOCAL STORAGE FOR STATUS
    localStorage.setItem("usage_tracking_active", "true");
    console.log("Usage tracking started. Reporting every 5 minutes.");
}

// DEVELOPMENTAL FUNCTION
// STOP REPORTING USAGE  ON LOGOUT
function stopUsageTracking() {
    if (usageInterval) {
        clearInterval(usageInterval);
        usageInterval = null;
    }

    // REMOVE TRACKING FROM STORAGE
    localStorage.removeItem("usage_tracking_active");
    console.log("Usage tracking stopped.");
}


const password = "pasword123";
const adminPassword = "password89081234"

// GLOBALIZE FUNCTIONS
window.loginUser = loginUser;
window.registerUser = registerUser;
window.fetchUserEvents = fetchUserEvents;
window.fetchEventDetails = fetchEventDetails;
window.logoutUser = logoutUser;
window.startUsageTracking = startUsageTracking;
window.stopUsageTracking = stopUsageTracking;
window.fetchUserTemplates = fetchUserTemplates;
window.loadTemplateProducts = loadTemplateProducts;
window.updateTemplateDropdown = updateTemplateDropdown;