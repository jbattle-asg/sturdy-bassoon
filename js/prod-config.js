const answers = {};

const productConfigurations = {
    small: {
      "vrtruck-orchestration": "Ateme PILOT",
      "vrtruck-tdconsole": "Vizrt Vectar",
      "vrtruck-multiviewer": "TAG Mosaic",
      "vrtruck-graphics": "Singular.live",
      "vrtruck-vtr": "Vizrt 3Play",
      "vrtruck-audio": "LAMA Mix",
      "vrtruck-comms": "Telos Infinity VIP",
      "vrtruck-processing": "Ateme TITAN"
    },

    medium: {
      "vrtruck-orchestration": "Gallery Sienna",
      "vrtruck-tdconsole": "Vizrt Vectar",
      "vrtruck-multiviewer": "TAG Mosaic",
      "vrtruck-graphics": "Singular.live",
      "vrtruck-vtr": "Vizrt 3Play",
      "vrtruck-audio": "LAMA Mix",
      "vrtruck-comms": "Telos Infinity VIP",
      "vrtruck-processing": "Gallery Sienna"
    },

    large: {
      "vrtruck-orchestration": "Ateme PILOT",
      "vrtruck-tdconsole": "GV AMPP",
      "vrtruck-multiviewer": "TAG Mosaic",
      "vrtruck-graphics": "Singular.live",
      "vrtruck-vtr": "Riedel ViBox",
      "vrtruck-audio": "LAMA Mix",
      "vrtruck-comms": "Telos Infinity VIP",
      "vrtruck-processing": "Gallery Sienna"
    },

}

const questionsMap = {
    start: {
      id: 'category',
      text: "What are you producing?",
      options: [
        { value: 'sports', label: 'Sports', next: 'sports_type' },
        { value: 'esports', label: 'Esports', next: 'esports_type' },
        { value: 'music', label: 'Music', next: 'music_type' },
        { value: 'corporate', label: 'Corporate Event', next: 'corporate_type' },
        { value: 'faith', label: 'Faith', next: 'faith_type' },
      ]
    },
    sports_type: {
      id: 'sportsType',
      text: "Select a sports format:",
      options: [
        { value: 'indoor_court', label: 'Indoor Court (Basketball / Volleyball)', next: 'tech_question_1', prev: 'start' },
        { value: 'outdoor_court', label: 'Outdoor Court (Tennis / Beach Volleyball)', next: 'tech_question_1', prev: 'start' },
        { value: 'spread_field', label: 'Spread Field (Baseball / Cricket)', next: 'tech_question_1', prev: 'start' },
        { value: 'linear_field', label: 'Linear Field (Football / Rugby/Soccer)', next: 'tech_question_1', prev: 'start' },
      ]
    },
    esports_type: {
      id: 'esportsType',
      text: "Select a game type:",
      options: [
        { value: 'moba_tps', label: 'MOBA/TPS (League of Legends / PUBG)', next: 'tech_question_5', prev: 'start' },
        { value: 'fighter', label: 'Fighter (Super Smash Bros. / Tekken)', next: 'tech_question_5', prev: 'start' },
        { value: 'strategy', label: 'Strategy (Chess / Hearthstone)', next: 'tech_question_5', prev: 'start' },
      ]
    },
    music_type: {
      id: 'musicType',
      text: "Select a music event type:",
      options: [
        { value: 'indoor_large', label: 'Indoor Large', next: 'tech_question_9', prev: 'start' },
        { value: 'indoor_small', label: 'Indoor Small', next: 'tech_question_9', prev: 'start' },
        { value: 'outdoor_large', label: 'Outdoor Large', next: 'tech_question_9', prev: 'start' },
        { value: 'outdoor_small', label: 'Outdoor Small', next: 'tech_question_9', prev: 'start' },
      ]
    },
    corporate_type: {
      id: 'corporateType',
      text: "Select a corporate event type:",
      options: [
        { value: 'keynote', label: 'Keynote Presentation', next: 'tech_question_13', prev: 'start' },
        { value: 'day_event', label: 'Day Event – Keynotes + Panels', next: 'tech_question_13', prev: 'start' },
        { value: 'multi_location', label: 'Multi-Location', next: 'tech_question_13', prev: 'start' },
      ]
    },
    faith_type: {
      id: 'faithType',
      text: "Select a faith event type:",
      options: [
        { value: 'presenter', label: 'Stage Presenter', next: 'tech_question_14', prev: 'start' },
        { value: 'presenter_choir', label: 'Stage Presenter + Choir or Soloists', next: 'tech_question_14', prev: 'start' },
        { value: 'presenter_remote', label: 'Stage + Remote', next: 'tech_question_14', prev: 'start' },
      ]
    },

    
    tech_question_1: {
      id: 'tech_question_1',
      text: "CAMERAS - qty?",
      input: "number",
      weight: 1.5,
      next: "tech_question_2",
      prev: "sports_type",
      default: 4
    },
    tech_question_2: {
      id: 'tech_question_2',
      text: "OUTPUT GRAPHICS - qty? (i.e.: imags)",
      input: "number",
      weight: 1,
      next: "tech_question_3",
      prev: "tech_question_1",
      default: 2
    },
    tech_question_3: {
      id: 'tech_question_3',
      text: "SCREEN SOURCES - qty? (i.e.: Telestrator, gamer monitor)",
      input: "number",
      weight: 1.3, 
      next: "tech_question_4",
      prev: "tech_question_2",
      default: 0
    },
    tech_question_4: {
      id: 'tech_question_4',
      text: "ENDPOINTS - qty?",
      input: "number",
      weight: 1.2,
      default: 2,
      prev: "tech_question_3",
      next: "done"
    },



    tech_question_5: {
      id: 'tech_question_1',
      text: "CAMERAS - qty?",
      input: "number",
      weight: 1.5,
      next: "tech_question_6",
      prev: "esports_type",
      default: 4
    },
    tech_question_6: {
      id: 'tech_question_2',
      text: "OUTPUT GRAPHICS - qty? (i.e.: imags)",
      input: "number",
      weight: 1,
      next: "tech_question_7",
      prev: "tech_question_5",
      default: 2
    },
    tech_question_7: {
      id: 'tech_question_7',
      text: "SCREEN SOURCES - qty? (i.e.: Telestrator, gamer monitor)",
      input: "number",
      weight: 1.3, 
      next: "tech_question_8",
      prev: "tech_question_6",
      default: 0
    },
    tech_question_8: {
      id: 'tech_question_8',
      text: "ENDPOINTS - qty?",
      input: "number",
      weight: 1.2,
      default: 2,
      prev: "tech_question_7",
      next: "done"
    },



    tech_question_9: {
      id: 'tech_question_1',
      text: "CAMERAS - qty?",
      input: "number",
      weight: 1.5,
      next: "tech_question_10",
      prev: "music_type",
      default: 4
    },
    tech_question_10: {
      id: 'tech_question_2',
      text: "OUTPUT GRAPHICS - qty? (i.e.: imags)",
      input: "number",
      weight: 1,
      next: "tech_question_11",
      prev: "tech_question_9",
      default: 2
    },
    tech_question_11: {
      id: 'tech_question_11',
      text: "SCREEN SOURCES - qty? (i.e.: Telestrator, gamer monitor)",
      input: "number",
      weight: 1.3, 
      next: "tech_question_12",
      prev: "tech_question_10",
      default: 0
    },
    tech_question_12: {
      id: 'tech_question_12',
      text: "ENDPOINTS - qty?",
      input: "number",
      weight: 1.2,
      default: 2,
      prev: "tech_question_11",
      next: "done"
    },




    tech_question_13: {
      id: 'tech_question_13',
      text: "CAMERAS - qty?",
      input: "number",
      weight: 1.5,
      next: "tech_question_14",
      prev: "corporate_type",
      default: 4
    },
    tech_question_14: {
      id: 'tech_question_14',
      text: "OUTPUT GRAPHICS - qty? (i.e.: imags)",
      input: "number",
      weight: 1,
      next: "tech_question_15",
      prev: "tech_question_13",
      default: 2
    },
    tech_question_15: {
      id: 'tech_question_15',
      text: "SCREEN SOURCES - qty? (i.e.: Telestrator, gamer monitor)",
      input: "number",
      weight: 1.3, 
      next: "tech_question_16",
      prev: "tech_question_14",
      default: 0
    },
    tech_question_16: {
      id: 'tech_question_16',
      text: "ENDPOINTS - qty?",
      input: "number",
      weight: 1.2,
      default: 2,
      prev: "tech_question_15",
      next: "done"
    },



    tech_question_17: {
      id: 'tech_question_17',
      text: "CAMERAS - qty?",
      input: "number",
      weight: 1.5,
      next: "tech_question_14",
      prev: "corporate_type",
      default: 4
    },
    tech_question_18: {
      id: 'tech_question_18',
      text: "OUTPUT GRAPHICS - qty? (i.e.: imags)",
      input: "number",
      weight: 1,
      next: "tech_question_15",
      prev: "tech_question_13",
      default: 2
    },
    tech_question_19: {
      id: 'tech_question_19',
      text: "SCREEN SOURCES - qty? (i.e.: Telestrator, gamer monitor)",
      input: "number",
      weight: 1.3, 
      next: "tech_question_16",
      prev: "tech_question_14",
      default: 0
    },
    tech_question_20: {
      id: 'tech_question_20',
      text: "ENDPOINTS - qty?",
      input: "number",
      weight: 1.2,
      default: 2,
      prev: "faith_type",
      next: "done"
    },
  };

  
  let currentKey = 'start';
  const container = document.getElementById('product-configurator');


  function mapPrevWordQuestion(val){
    const options = questionsMap.start.options;
  
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.value === val) {
        console.log("option.next: " + option.next);
        return option.next;
      }
    }
  }

  function showQuestion(key) {
    const question = questionsMap[key];
    if (!question) return;

    if (question.input === 'number') {
      container.innerHTML = `
<div class="fade-in-assistant">
  <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <p style="font-size: 1.1rem; margin-bottom: 1rem;"><strong>${question.text}</strong></p>
    <form id="step-form">
      <select 
        name="${question.id}" 
        required 
        style="margin-bottom: 1rem; width: 100%; padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 8px;">
        <!-- Option values from 0 to 10 -->
        <option value="0" ${question.default === 0 ? 'selected' : ''}>0</option>
        <option value="1" ${question.default === 1 ? 'selected' : ''}>1</option>
        <option value="2" ${question.default === 2 ? 'selected' : ''}>2</option>
        <option value="3" ${question.default === 3 ? 'selected' : ''}>3</option>
        <option value="4" ${question.default === 4 ? 'selected' : ''}>4</option>
        <option value="5" ${question.default === 5 ? 'selected' : ''}>5</option>
        <option value="6" ${question.default === 6 ? 'selected' : ''}>6</option>
        <option value="7" ${question.default === 7 ? 'selected' : ''}>7</option>
        <option value="8" ${question.default === 8 ? 'selected' : ''}>8</option>
        <option value="9" ${question.default === 9 ? 'selected' : ''}>9</option>
        <option value="10" ${question.default === 10 ? 'selected' : ''}>10</option>
      </select>
      <button 
        type="submit"
        style="padding: 0.6rem 1.2rem; font-size: 1rem; background-color: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Next
      </button>

      <button 
        type="button"
        id="back-button"
        style="margin-left: 5px; padding: 0.6rem 1.2rem; font-size: 1rem; background-color: #ccc; color: #333; border: none; border-radius: 8px; cursor: pointer;">
        Back
      </button>

      <button 
        type="button"
        id="start-over"
        style="margin-left: 5px; padding: 0.6rem 1.2rem; font-size: 1rem; background-color: #ccc; color: #333; border: none; border-radius: 8px; cursor: pointer;">
        Cancel
      </button>

    </form>
  </div>
</div>
`; 
    document.getElementById('start-over')?.addEventListener('click', () => {
        const prompt = document.getElementById('configurator-prompt');
        const configurator = document.getElementById('product-configurator');
        configurator.style.display = 'none';
        prompt.style.display = 'block';
        showQuestion('start');
        answers=[];
      });

    document.getElementById('back-button')?.addEventListener('click', () => {
      try{
        showQuestion(question.options[0].prev)
        answers[question.id]=0;
      } catch {
        showQuestion(question.prev);
        answers[question.id]=0;
      }
    })

} else {
      container.innerHTML = `
      <div class="fade-in-assistant">
  <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <p style="font-size: 1.1rem; margin-bottom: 1rem;"><strong>${question.text}</strong></p>
    <form id="step-form">
      ${question.options.map(opt => `
        <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; font-size: 1rem; cursor: pointer;">
          <input 
            type="radio" 
            name="${question.id}" 
            value="${opt.value}" 
            required 
            style="accent-color: #007bff;"
          />
          ${opt.label}
        </label>
      `).join('')}
        <button 
          type="submit"
          style="margin-top: 1rem; padding: 0.6rem 1.2rem; font-size: 1rem; background-color: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Next
        </button>

        <button 
          type="button"
          id="back-button"
          style="margin-left: 5px; padding: 0.6rem 1.2rem; font-size: 1rem; background-color: #ccc; color: #333; border: none; border-radius: 8px; cursor: pointer;">
          Back
        </button>

        <button 
          type="button"
          id="start-over"
          style="margin-left: 5px; padding: 0.6rem 1.2rem; font-size: 1rem; background-color: #ccc; color: #333; border: none; border-radius: 8px; cursor: pointer;">
          Cancel
        </button>
    </form>
  </div>
  </div>
`;
      document.getElementById('start-over')?.addEventListener('click', () => {
          const prompt = document.getElementById('configurator-prompt');
          const configurator = document.getElementById('product-configurator');
          configurator.style.display = 'none';
          prompt.style.display = 'block';
          showQuestion('start');
          answers=[];
        });

      document.getElementById('back-button')?.addEventListener('click', () => {
        // console.log(question.options[0].prev)
        // console.log(question.prev)
        console.log(answers)
        try{
          showQuestion(question.options[0].prev)
          answers[question.id]=0;
        } catch {
          showQuestion(question.prev);
          answers[question.id]=0;
        }
      });
    }

    document.getElementById('step-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      let selectedValue = formData.get(question.id);
      console.log(selectedValue)

      if (question.weight){
        selectedValue = question.weight * selectedValue
      }

      answers[question.id] = selectedValue;

      console.log(selectedValue)

      const next = question.next || question.options.find(opt => opt.value === selectedValue)?.next;
      if (next === 'done') {
        showRecommendation();
      } else {
        currentKey = next;
        showQuestion(currentKey);
      }
    });
  }

  const recommendations = {
    small: {truck: "Sprinter", value: 10},
    medium: {truck: "Medium Truck (36')", value: 20},
    large: {truck: "Large Truck (53')", value: 30}
  };

  function showRecommendation() {
    total = 0
    for (const [key, value] of Object.entries(answers)) {
        const num = parseInt(value);
        if (!isNaN(num)) {
            total += num;
        }
    }
    
    let truckSize = "large";

    if (total <= recommendations.small.value) {
        truckSize = "small";
    } else if (total <= recommendations.medium.value) {
        truckSize = "medium";
    }

    const product = recommendations[truckSize].truck;
    container.innerHTML = `
    <div class="fade-in-assistant">
      <div style="background: #e8f0fe; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">
        <p style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">Recommended Setup:</p>
        <p style="font-size: 1.5rem; color: #007bff; margin-bottom: 1.5rem;">${product}</p>
        <button 
          id="use-config-btn"
          style="padding: 0.75rem 1.5rem; font-size: 1rem; background-color: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Use Configuration
        </button>

        <button 
          type="button"
          id="start-over"
          style="margin-left: 5px; padding: 0.6rem 1.2rem; font-size: 1rem; background-color: #ccc; color: #333; border: none; border-radius: 8px; cursor: pointer;">
          Start Over
        </button>
      </div>
      </div>
    `;
    document.getElementById('start-over')?.addEventListener('click', () => {
        const prompt = document.getElementById('configurator-prompt');
        const configurator = document.getElementById('product-configurator');

        configurator.style.display = 'none';
        prompt.style.display = 'block';
        showQuestion('start');
        answers=[];
      });

      

      document.getElementById('use-config-btn')?.addEventListener('click', () => {
        if (!product) {
            console.error(`No configuration available for truck size: ${truckSize}`);
            return;
        }
    
        let configRecommendation = productConfigurations[truckSize];
    
        if (!configRecommendation) {
            console.error(`No product configuration available for ${product}`);
            return;
        }
    
        let dropdowns = document.querySelectorAll(".truck-dropdown-item");
    
        dropdowns.forEach(dropdown => {

            let productValue = configRecommendation[dropdown.id];
    
            if (productValue) {
                dropdown.value = productValue;
            } else {
                dropdown.value = ""; 
            }
        });

          // Automatically save the template when the button is pressed
          saveTemplateConfig(configRecommendation, product);
    });
    
  }

  showQuestion(currentKey);


// SAVE USER TEMPLATE FROM CONFIG
async function saveTemplateConfig(configRecommendation, truckSize) {
  let authToken = localStorage.getItem("authToken");

  if (!authToken) {
      console.error("Authorization token is missing.");
      return;
  }

  let headers = new Headers();
  headers.append("Authorization", `Bearer ${authToken}`);
  headers.append("Content-Type", "application/json");

  // Use the product configuration as the template name
  let templateName = configRecommendation ? truckSize : "Default Template";

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
      console.error("No products selected for template.");
      return;
  }

  let payload = {
      template_name: templateName,
      products: selectedProducts
  };

  try {
      // Check for existing templates with the same name
      let existingTemplateIndex = templatesData.findIndex(template => template.template_name === templateName);

      if (existingTemplateIndex !== -1) {
          // Get the template ID
          let templateId = templatesData[existingTemplateIndex].template_id;

          // Delete the existing template silently
          try {
              let deleteResponse = await fetch('https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/templates', {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${authToken}`
                  },
                  body: JSON.stringify({ template_id: templateId })
              });

              let deleteData = await deleteResponse.json();

              if (deleteResponse.ok) {
                  // Remove the template from the local array
                  templatesData = templatesData.filter(template => template.template_id !== templateId);
              } else {
                  console.error("Failed to delete duplicate template:", deleteData.error);
                  return;
              }
          } catch (deleteError) {
              console.error("Error deleting duplicate template:", deleteError);
              return;
          }
      }

      // Save the new template
      let response = await fetch('https://ho0xnj2g3f.execute-api.us-east-1.amazonaws.com/api/templates', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
      });

      let result = await response.json();
      if (response.ok) {
          // Add new template to templatesData array
          const newTemplateId = result.template_id || (templatesData.length + 1).toString();
          templatesData.push({
              template_id: newTemplateId,
              template_name: templateName,
              products: selectedProducts
          });

          console.log("Template saved successfully!");

          // Refresh the dropdown after saving
          await fetchUserTemplates();

          // Update the dropdown with the new template list
          updateTemplateDropdown(templateName);

          // Wait for the dropdown to update and then select the new template
          setTimeout(() => {
              let templateDropdown = document.getElementById('template-dropdown');
              templateDropdown.value = templateName;
              templateDropdown.dispatchEvent(new Event('change'));
          }, 50); // Small delay to ensure dropdown updates

          // Immediately load the saved template using the template name
          loadTemplateProducts(templateName);
      } else {
          console.error("Error saving template:", result.message);
      }
  } catch (error) {
      console.error("Error saving template:", error);
  }
}

// Update the template dropdown and set the selected value
function updateTemplateDropdown(selectedTemplateName) {
  let templateDropdown = document.getElementById('template-dropdown');

  // Clear existing options
  templateDropdown.innerHTML = '';

  // Repopulate with updated templatesData
  templatesData.forEach(template => {
      let option = document.createElement('option');
      option.value = template.template_name;
      option.textContent = template.template_name;
      templateDropdown.appendChild(option);
  });

  // Set the newly saved template as selected
  templateDropdown.value = selectedTemplateName;

  // Trigger a change event to update the UI
  templateDropdown.dispatchEvent(new Event('change'));
}



  // OPENING ASSISTANT SCRIPTS
  document.addEventListener('DOMContentLoaded', function () {
  const prompt = document.getElementById('configurator-prompt');
  const denyPrompt = document.getElementById('deny-configurator-prompt');
  const configurator = document.getElementById('product-configurator');
  const yesBtn = document.getElementById('assist-yes');
  const noBtn = document.getElementById('assist-no');
  const denyChangeBtn = document.getElementById('deny-assist-change');
  const denyCloseBtn = document.getElementById('deny-assist-close');
  const startOverBtn = document.getElementById('start-over')

  const contactDiv = document.getElementById("truck")


  yesBtn.addEventListener('click', function () {
    configurator.style.display = 'block';
    prompt.style.display = 'none';
  });

  noBtn.addEventListener('click', function () {
    prompt.style.display = 'none';
    denyPrompt.style.display = 'block'
  });

  denyChangeBtn.addEventListener('click', function () {
    prompt.style.display = 'block';
    denyPrompt.style.display = 'none'
  });

  denyCloseBtn.addEventListener('click', function () {
    denyPrompt.style.display = 'none'
    contactDiv.style.paddingTop = "110px"
  });

  startOverBtn.addEventListener('click', function () {
    showQuestion("start")
    answers=[]
  });


});
