document.addEventListener("DOMContentLoaded", () => {

  const display = document.getElementById("display");
  const historyBtn = document.getElementById("historyBtn");
  const historyModal = document.getElementById("historyModal");
  const historyList = document.getElementById("historyList");
  const colorPicker = document.getElementById("colorPicker");

  // AI Elements
  const aiBtn = document.getElementById("aiBtn");
  const aiPanel = document.getElementById("aiPanel");
  const chatInput = document.getElementById("chatInput");
  const chatLog = document.getElementById("chatLog");

  // Image Upload Elements
  const imageUpload = document.getElementById("imageUpload");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const imagePreview = document.getElementById("imagePreview");
  let selectedImageBase64 = null;
  let selectedImageMimeType = null;

  // OpenRouter API Key details
  const API_KEY = "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";

  // Chat History for REST API
  let chatHistory = [];

  const systemInstruction = `You are a professional Math Tutor AI. 
CRITICAL RULE: Always provide a step-by-step mathematical solution. 
NEVER talk about unrelated fictional characters, multicultural insights, or non-math topics. 
If an image is provided, identify the math problem in it and solve it logically. 
If you cannot find a math problem, state: 'I couldn't find a clear math problem in this image. Please try another.' 
Always use clear Markdown for your steps.`;

  // ---------- Calculator ----------
  window.append = function (value) {
    if (!display) return;
    display.value += value;
  };

  window.clearDisplay = function () {
    if (!display) return;
    display.value = "";
  };

  window.deleteLast = function () {
    if (!display) return;
    display.value = display.value.slice(0, -1);
  };

  window.toggleScientific = function () {
    const scientificDiv = document.getElementById("scientific");
    if (scientificDiv) {
      scientificDiv.classList.toggle("hidden");
    }
  };

  window.calculate = function () {
    if (!display) return;
    try {
      let expression = display.value;
      // Auto-close unclosed parentheses
      const openParen = (expression.match(/\(/g) || []).length;
      const closeParen = (expression.match(/\)/g) || []).length;
      expression += ')'.repeat(openParen - closeParen);

      const result = eval(expression);
      saveHistory(display.value + " = " + result);
      display.value = result;
    } catch (error) {
      display.value = "Error";
    }
  };

  // ---------- History ----------
  function saveHistory(entry) {
    let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
    history.push(entry);
    localStorage.setItem("calcHistory", JSON.stringify(history));
  }

  function loadHistory() {
    if (!historyList) return;

    let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
    historyList.innerHTML = "";

    if (history.length === 0) {
      historyList.innerHTML = "<p>No history</p>";
    } else {
      history.forEach(item => {
        const p = document.createElement("p");
        p.textContent = item;
        historyList.appendChild(p);
      });
    }
  }

  window.openHistory = function () {
    if (!historyModal) return;
    historyModal.style.display = "flex";
    loadHistory();
  };

  window.closeHistory = function () {
    if (!historyModal) return;
    historyModal.style.display = "none";
  };

  window.clearHistory = function () {
    localStorage.removeItem("calcHistory");
    loadHistory();
  };

  // ---------- Color Picker ----------
  if (colorPicker) {
    colorPicker.addEventListener("input", function () {
      // Calculate perceptive luminance for text contrast
      const hex = this.value.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      const textColor = (yiq >= 128) ? '#000000' : '#ffffff';

      document.documentElement.style.setProperty("--themeColor", this.value);
      document.documentElement.style.setProperty("--themeTextColor", textColor);
      document.body.style.background = this.value + "22";
    });
  }

  // ---------- History Button ----------
  if (historyBtn) {
    historyBtn.addEventListener("click", openHistory);
  }

  // ---------- AI Chat Logic ----------
  window.toggleAIPanel = function () {
    if (!aiPanel) return;
    aiPanel.classList.toggle("hidden");
    if (!aiPanel.classList.contains("hidden")) {
      chatInput.focus();
    }
  };

  if (aiBtn) {
    aiBtn.addEventListener("click", toggleAIPanel);
  }

  // Handle Image Upload Preview
  window.previewImage = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImageBase64 = e.target.result.split(",")[1];
      selectedImageMimeType = file.type;
      if (imagePreview) imagePreview.src = e.target.result;
      if (imagePreviewContainer) imagePreviewContainer.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  };

  window.removeImage = function () {
    if (imageUpload) imageUpload.value = "";
    if (imagePreview) imagePreview.src = "";
    if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");
    selectedImageBase64 = null;
    selectedImageMimeType = null;
  };

  function addMessage(text, isUser, imageSrc = null) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message ${isUser ? "user-msg" : "ai-msg"}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "msg-content";

    // Text formatting
    let formattedText = text;
    if (!isUser) {
      formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");
      formattedText = formattedText.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
      formattedText = formattedText.replace(/`(.*?)`/g, "<code>$1</code>");
      formattedText = formattedText.replace(/\n/g, "<br>");
    }
    contentDiv.innerHTML = formattedText;

    // Add Image to UI if exists
    if (imageSrc) {
      const imgElem = document.createElement("img");
      imgElem.src = imageSrc;
      imgElem.className = "msg-image";
      contentDiv.insertBefore(imgElem, contentDiv.firstChild);
    }

    msgDiv.appendChild(contentDiv);
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function addLoadingIndicator() {
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message ai-msg loading-msg";

    const contentDiv = document.createElement("div");
    contentDiv.className = "msg-content typing-indicator";
    contentDiv.innerHTML = "<span></span><span></span><span></span>";

    msgDiv.appendChild(contentDiv);
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    return msgDiv;
  }

  window.sendChatMessage = async function () {
    const text = chatInput.value.trim();
    if (!text && !selectedImageBase64) return;

    // Local variables to hold image state before clearing
    const hasImage = !!selectedImageBase64;
    const base64Data = selectedImageBase64;
    const mimeType = selectedImageMimeType;
    const imageSrc = imagePreview ? imagePreview.src : null;

    // 1. Add User Message
    addMessage(text, true, hasImage ? imageSrc : null);

    // Clear Input
    chatInput.value = "";
    removeImage();

    // 2. Show loading
    const loadingElem = addLoadingIndicator();

    try {
      // 3. Prepare payload for OpenRouter REST API
      const url = `https://openrouter.ai/api/v1/chat/completions`;

      const messages = [
        { role: "system", content: systemInstruction }
      ];

      // Add previous chat history
      chatHistory.forEach(msg => {
        messages.push(msg);
      });

      // Construct current user content
      let userContent = [];
      if (text) {
        userContent.push({ type: "text", text: text });
      }
      if (hasImage) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Data}`
          }
        });
      }

      messages.push({ role: "user", content: userContent });

      const requestBody = {
        model: "meta-llama/llama-3.2-11b-vision-instruct:free",
        messages: messages,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": "https://calculator-app.local", // Optional but good practice for OpenRouter
          "X-Title": "Smart Calculator Chatbot"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter API Error details:", errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || "Unknown error"}. Please check your API Key.`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;

      // Detection for weird hallucinations (like Suzy Stretchedpants)
      const hallucinationKeywords = ["Suzy", "Harvard", "multicultural", "drug", "theft", "comics"];
      const isHallucination = hallucinationKeywords.some(kw => responseText.includes(kw));

      if (isHallucination) {
        console.warn("Hallucination detected, clearing chat history for a fresh start.");
        chatHistory = [];
        addMessage("I'm sorry, my previous thoughts got a bit mixed up. I've reset the conversation to focus specifically on your math problem. Please try asking again!", false);
        loadingElem.remove();
        return;
      }

      // Update local history
      chatHistory.push({ role: "user", content: text || "Math Problem from Image" });
      chatHistory.push({ role: "assistant", content: responseText });

      // 4. Remove loading and add AI response
      loadingElem.remove();
      addMessage(responseText, false);

    } catch (error) {
      console.error("Chatbot API Error:", error);
      loadingElem.remove();
      addMessage(`Oops! Setup Error: ${error.message} \n\n(Tip: If 'User not found' or 401, update API_KEY in script.js)`, false);
    }
  };

  // Allow "Enter" key to send message
  if (chatInput) {
    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendChatMessage();
      }
    });
  }

});