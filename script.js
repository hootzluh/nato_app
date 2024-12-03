// Load FAQ data
let faqs = [];

// Fetch the JSON file
fetch("Change_Healthcare_FAQ_Modified.json")
  .then((response) => response.json())
  .then((data) => (faqs = data));

// Get elements
const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results");

// Search and display results
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase().trim();
  resultsContainer.innerHTML = ""; // Clear previous results

  // Split query into individual words
  const queryWords = query.split(/\s+/);

  // Filter and display results
  const filteredFaqs = faqs.filter((faq) => {
    const questionText = faq.Question.toLowerCase();
    const responseText = faq.Response.toLowerCase();
    const keywordText = faq.Keywords.map((keyword) =>
      keyword.toLowerCase()
    ).join(" ");

    // Check if all query words match any part of the FAQ entry
    return queryWords.every(
      (word) =>
        questionText.includes(word) ||
        responseText.includes(word) ||
        keywordText.includes(word)
    );
  });

  if (filteredFaqs.length === 0 && query.length > 0) {
    // Show a "no results" message
    const noResults = document.createElement("p");
    noResults.textContent = "No matching FAQs found.";
    noResults.style.color = "#d08770"; // A soft red for emphasis
    resultsContainer.appendChild(noResults);
  }

  filteredFaqs.forEach((faq) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";

    const question = document.createElement("h2");
    question.textContent = faq.Question;

    // Apply audience-specific styling
    if (faq.Audience === "Agents") {
      question.classList.add("agent-highlight");
    } else {
      question.classList.add("caller-highlight");
    }

    const response = document.createElement("p");
    response.textContent = faq.Response;

    resultItem.appendChild(question);
    resultItem.appendChild(response);
    resultsContainer.appendChild(resultItem);
  });
});

 // Populate dropdown times with AM/PM format
function populateTimeDropdown(selectId) {
  const dropdown = document.getElementById(selectId);
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const period = hour < 12 ? 'AM' : 'PM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 0, 13–23 to 12-hour format
      const time = `${formattedHour}:${String(min).padStart(2, '0')} ${period}`;
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      dropdown.appendChild(option);
    }
  }
}
populateTimeDropdown('contactTime');
populateTimeDropdown('primaryContactTime');
    // Handle form switching
    document.getElementById('formSelector').addEventListener('change', function () {
      const selected = this.value;
      document.getElementById('normalForm').style.display = selected === 'normal' ? 'block' : 'none';
      document.getElementById('onBehalfForm').style.display = selected === 'onBehalf' ? 'block' : 'none';
    });

    // Submit form and redirect
    function submitForm(formType) {
      let deepLink = 'https://teams.microsoft.com/l/channel/19%3A18ba15fa79fd453eadfa89873dcbeebd%40thread.tacv2/Escalations%20Approval%20Request?groupId=7d496639-9181-41e2-be7e-da9b526bd34c';
      const params = new URLSearchParams();

      if (formType === 'normal') {
        params.append('message', `
          **Name:** ${document.getElementById('name').value}
          **Email:** ${document.getElementById('email').value}
          **Address:** ${document.getElementById('address').value}
          **Best Contact Number/Time:** ${document.getElementById('contactNumber').value} @ ${document.getElementById('contactTime').value}
          **Reason for Escalation:** ${document.getElementById('reason').value}
          **FAQs Read:** ${document.getElementById('faqs').value}
          **Lead Initials:** ${document.getElementById('lead').value}
        `);
      } else if (formType === 'onBehalf') {
        const primaryContact = document.querySelector('input[name="primaryContact"]:checked').value;
        params.append('message', `
          **Primary Contact:** ${primaryContact}
          **Caller Name:** ${document.getElementById('callerName').value}
          **Caller Relation to Impacted:** ${document.getElementById('relation').value}
          **Impacted Name:** ${document.getElementById('impactedName').value}
          **Primary Contact Email:** ${document.getElementById('primaryEmail').value}
          **Impacted Address:** ${document.getElementById('impactedAddress').value}
          **Primary Contact Best Contact Number/Time:** ${document.getElementById('primaryContactNumber').value} @ ${document.getElementById('primaryContactTime').value}
          **Reason for Escalation:** ${document.getElementById('reasonEscalation').value}
          **FAQs Read:** ${document.getElementById('faqsRead').value}
          **Lead Initials:** ${document.getElementById('leadInitials').value}
        `);
      }

      deepLink += `&${params.toString()}`;
      window.open(deepLink, '_blank'); // Open in new tab
    }
