console.log("✅ script.js loaded successfully");

const chatBox = document.getElementById("chat-box");

const input = document.getElementById("user-input");

const sendBtn = document.getElementById("send-btn");

const newChatBtn =
  document.getElementById("new-chat-btn");

const recentChatsDiv =
  document.getElementById("recent-chats");

const themeBtn =
  document.getElementById("theme-toggle-btn");

const voiceBtn =
  document.getElementById("voice-btn");

// -----------------------------
// NEW FEATURE ELEMENTS
// -----------------------------
const exportBtn =
  document.getElementById("export-chat-btn");

const clearBtn =
  document.getElementById("clear-history-btn");

const searchInput =
  document.getElementById("search-chat-input");
const totalChecksText =
  document.getElementById("total-checks");

const highRiskText =
  document.getElementById("high-risk-count");

const mediumRiskText =
  document.getElementById("medium-risk-count");

const lowRiskText =
  document.getElementById("low-risk-count");

const avgScoreText =
  document.getElementById("avg-score");


let step = 0;

let formData = {};

let currentChatMessages = [];

// -----------------------------
// ADD BOT MESSAGE
// -----------------------------
function addBotMessage(text) {

  const div = document.createElement("div");

  div.className = "bot-msg";

  div.innerText = text;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;

  currentChatMessages.push({
    type: "bot",
    text: text
  });
}

// -----------------------------
// ADD USER MESSAGE
// -----------------------------
function addUserMessage(text) {

  const div = document.createElement("div");

  div.className = "user-msg";

  div.innerText = text;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;

  currentChatMessages.push({
    type: "user",
    text: text
  });
}

// -----------------------------
// TYPING ANIMATION
// -----------------------------
function showTypingAnimation() {

  const div = document.createElement("div");

  div.className = "bot-msg typing-msg";

  div.innerHTML = `
    <div class="typing">
      <span>XCare is analyzing</span>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;

  return div;
}

// -----------------------------
// START CHAT
// -----------------------------
function startChat() {

  chatBox.innerHTML = "";

  step = 0;

  formData = {};

  currentChatMessages = [];

  addBotMessage(
`Hi 👋 I’m XCare.

Before we begin, please enter your details:

Age, Gender, Height(cm), Weight(kg)

Example: 22, male, 170, 65`
  );
}

startChat();

// -----------------------------
// SEND EVENTS
// -----------------------------
sendBtn.addEventListener("click", handleSend);

input.addEventListener("keypress", function(e) {

  if (e.key === "Enter") {

    handleSend();
  }
});

// -----------------------------
// HANDLE SEND
// -----------------------------
async function handleSend() {

  const text = input.value.trim();

  if (!text) return;

  addUserMessage(text);

  input.value = "";

  // STEP 1
  if (step === 0) {

    const parts = text.split(",");

    if (parts.length !== 4) {

      addBotMessage(
        "❌ Enter details correctly.\nExample: 22, male, 170, 65"
      );

      return;
    }

    formData.age = parts[0].trim();

    formData.gender = parts[1].trim();

    formData.height = parts[2].trim();

    formData.weight = parts[3].trim();

    step++;

    addBotMessage(
      "Please list your symptoms (comma separated)."
    );

    return;
  }

  // STEP 2
  if (step === 1) {

    formData.symptoms = text;

    step++;

    addBotMessage(
      "How many days have you been experiencing these symptoms?"
    );

    return;
  }

  // STEP 3
  if (step === 2) {

    formData.duration = text;

    step++;

    addBotMessage(
      "How severe are the symptoms? (mild / moderate / severe)"
    );

    return;
  }

  // STEP 4
  if (step === 3) {

    formData.severity = text;

    await analyzeWithBackend();

    step++;

    return;
  }
}

// -----------------------------
// ANALYZE BACKEND
// -----------------------------
async function analyzeWithBackend() {

  const typingDiv = showTypingAnimation();

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/chat",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(formData)
      }
    );

    const result = await response.json();

    console.log(result);

    typingDiv.remove();

    addBotMessage(result.reply);

    addBotMessage(
      "👉 Click + New Chat to start again."
    );

    saveRecentChat();

  } catch (err) {

    console.error(err);

    typingDiv.remove();

    addBotMessage("❌ Server not responding.");
  }
}

// -----------------------------
// SAVE RECENT CHAT
// -----------------------------
function saveRecentChat() {

  if (!formData.symptoms) return;

  const chatItem =
    document.createElement("div");

  chatItem.className =
    "recent-chat-item";

  chatItem.innerText =
    formData.symptoms;

  const savedMessages =
    [...currentChatMessages];

  chatItem.dataset.search =
    formData.symptoms.toLowerCase();

  chatItem.addEventListener("click", () => {

    chatBox.innerHTML = "";

    savedMessages.forEach(msg => {

      const div =
        document.createElement("div");

      div.className =
        msg.type === "bot"
          ? "bot-msg"
          : "user-msg";

      div.innerText = msg.text;

      chatBox.appendChild(div);
    });

    chatBox.scrollTop =
      chatBox.scrollHeight;
  });

  recentChatsDiv.prepend(chatItem);
}

// -----------------------------
// NEW CHAT
// -----------------------------
newChatBtn.addEventListener(
  "click",
  startChat
);

// -----------------------------
// THEME TOGGLE
// -----------------------------
const savedTheme =
  localStorage.getItem("xcare-theme");

if (savedTheme === "light") {

  document.body.classList.add(
    "light-mode"
  );

  themeBtn.innerText =
    "☀ Light Mode";
}

else {

  themeBtn.innerText =
    "🌙 Dark Mode";
}

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle(
    "light-mode"
  );

  if (
    document.body.classList.contains(
      "light-mode"
    )
  ) {

    localStorage.setItem(
      "xcare-theme",
      "light"
    );

    themeBtn.innerText =
      "☀ Light Mode";
  }

  else {

    localStorage.setItem(
      "xcare-theme",
      "dark"
    );

    themeBtn.innerText =
      "🌙 Dark Mode";
  }
});

// -----------------------------
// VOICE INPUT
// -----------------------------
const SpeechRecognition =

  window.SpeechRecognition ||

  window.webkitSpeechRecognition;

if (SpeechRecognition) {

  const recognition =
    new SpeechRecognition();

  recognition.continuous = false;

  recognition.lang = "en-US";

  recognition.interimResults = false;

  // START
  voiceBtn.addEventListener("click", () => {

    recognition.start();

    voiceBtn.classList.add(
      "voice-active"
    );

    voiceBtn.innerText = "🎙";
  });

  // RESULT
  recognition.onresult = (event) => {

    const transcript =

      event.results[0][0].transcript;

    input.value = transcript;
  };

  // END
  recognition.onend = () => {

    voiceBtn.classList.remove(
      "voice-active"
    );

    voiceBtn.innerText = "🎤";
  };

  // ERROR
  recognition.onerror = () => {

    voiceBtn.classList.remove(
      "voice-active"
    );

    voiceBtn.innerText = "🎤";

    alert(
      "Voice recognition failed. Try again."
    );
  };
}

else {

  console.log(
    "Speech Recognition not supported."
  );
}

// -----------------------------
// DAILY HEALTH TIPS
// -----------------------------
const healthTips = [

  "Drink at least 2 liters of water daily.",

  "Sleep 7-8 hours every night.",

  "Exercise regularly for better heart health.",

  "Avoid excessive junk food consumption.",

  "Wash your hands frequently to prevent infections.",

  "Take breaks from screen time regularly.",

  "Eat more fruits and vegetables daily.",

  "Practice meditation to reduce stress.",

  "Regular health checkups are important.",

  "Maintain a healthy body weight."
];

const tipText =
  document.getElementById("health-tip-text");

function loadRandomHealthTip() {

  const randomIndex =
    Math.floor(
      Math.random() * healthTips.length
    );

  tipText.innerText =
    healthTips[randomIndex];
}

loadRandomHealthTip();

// -----------------------------
// EXPORT CHAT FEATURE
// -----------------------------
if (exportBtn) {

  exportBtn.addEventListener("click", () => {

    let chatText = "XCare AI Health Report\n\n";

    currentChatMessages.forEach(msg => {

      if (msg.type === "bot") {

        chatText +=
          "XCare: " + msg.text + "\n\n";
      }

      else {

        chatText +=
          "User: " + msg.text + "\n\n";
      }
    });

    const blob = new Blob(
      [chatText],
      { type: "text/plain" }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "xcare-chat-report.txt";

    a.click();

    URL.revokeObjectURL(url);
  });
}

// -----------------------------
// CLEAR HISTORY FEATURE
// -----------------------------
if (clearBtn) {

  clearBtn.addEventListener("click", () => {

    const confirmClear =
      confirm(
        "Are you sure you want to clear all recent chats?"
      );

    if (confirmClear) {

      recentChatsDiv.innerHTML = "";
    }
  });
}

// -----------------------------
// SEARCH CHAT FEATURE
// -----------------------------
if (searchInput) {

  searchInput.addEventListener(
    "keyup",
    () => {

      const value =
        searchInput.value.toLowerCase();

      const allChats =
        document.querySelectorAll(
          ".recent-chat-item"
        );

      allChats.forEach(chat => {

        const text =
          chat.dataset.search;

        if (text.includes(value)) {

          chat.style.display = "block";
        }

        else {

          chat.style.display = "none";
        }
      });
    }
  );
}

const tipText =
  document.getElementById("health-tip-text");

function loadRandomHealthTip() {

  const randomIndex =
    Math.floor(
      Math.random() * healthTips.length
    );

  tipText.innerText =
    healthTips[randomIndex];
}

loadRandomHealthTip();

// -----------------------------
// EXPORT CHAT FEATURE
// -----------------------------
if (exportBtn) {

  exportBtn.addEventListener("click", () => {

    let chatText = "XCare AI Health Report\n\n";

    currentChatMessages.forEach(msg => {

      if (msg.type === "bot") {

        chatText +=
          "XCare: " + msg.text + "\n\n";
      }

      else {

        chatText +=
          "User: " + msg.text + "\n\n";
      }
    });

    const blob = new Blob(
      [chatText],
      { type: "text/plain" }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "xcare-chat-report.txt";

    a.click();

    URL.revokeObjectURL(url);
  });
}

// -----------------------------
// CLEAR HISTORY FEATURE
// -----------------------------
if (clearBtn) {

  clearBtn.addEventListener("click", () => {

    const confirmClear =
      confirm(
        "Are you sure you want to clear all recent chats?"
      );

    if (confirmClear) {

      recentChatsDiv.innerHTML = "";
    }
  });
}

// -----------------------------
// SEARCH CHAT FEATURE
// -----------------------------
if (searchInput) {

  searchInput.addEventListener(
    "keyup",
    () => {

      const value =
        searchInput.value.toLowerCase();

      const allChats =
        document.querySelectorAll(
          ".recent-chat-item"
        );

      allChats.forEach(chat => {

        const text =
          chat.dataset.search;

        if (text.includes(value)) {

          chat.style.display = "block";
        }

        else {

          chat.style.display = "none";
        }
      });
    }
  );
}
// -----------------------------
// DOWNLOAD REPORT
// -----------------------------

if (downloadBtn) {

  downloadBtn.addEventListener(
    "click",
    () => {

      const blob = new Blob(
        [latestReport],
        {
          type: "text/plain"
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "XCare_Health_Report.txt";

      link.click();

      URL.revokeObjectURL(url);
    }
  );
}
function updateAnalytics(
  risk,
  score
) {

  totalChecks++;

  totalHealthScore += score;

  if (risk === "HIGH") {

    highRiskCount++;
  }

  else if (
    risk === "MEDIUM"
  ) {

    mediumRiskCount++;
  }

  else {

    lowRiskCount++;
  }

  totalChecksText.innerText =
    `Total Checks: ${totalChecks}`;

  highRiskText.innerText =
    `🔴 High Risk: ${highRiskCount}`;

  mediumRiskText.innerText =
    `🟠 Medium Risk: ${mediumRiskCount}`;

  lowRiskText.innerText =
    `🟢 Low Risk: ${lowRiskCount}`;

  avgScoreText.innerText =
    `Average Score: ${Math.round(
      totalHealthScore /
      totalChecks
    )}`;
}
function loadNearbyHospitals() {

  if (!navigator.geolocation) {

    hospitalList.innerHTML =
      "Location not supported.";

    return;
  }

  navigator.geolocation.getCurrentPosition(

    function(position) {

      const lat =
        position.coords.latitude;

      const lon =
        position.coords.longitude;

      hospitalList.innerHTML = `

<a class="hospital-link"
href="https://www.google.com/maps/search/hospitals/@${lat},${lon},15z"
target="_blank">

🏥 View Nearby Hospitals

</a>

<small>
📍 Location detected successfully
</small>
`;
    },

    function() {

      hospitalList.innerHTML =
        "❌ Location permission denied.";
    }
  );
}
loadNearbyHospitals();
