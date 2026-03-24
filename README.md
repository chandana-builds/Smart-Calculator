# 🧮 Smart Calculator with AI Chatbot

An advanced **Smart Calculator** that combines traditional computation with an **AI-powered math assistant** capable of solving problems step-by-step — including **image-based problem recognition**.

Designed to provide not just answers, but **clear mathematical understanding**.

---

## 🚀 Live Demo

🔗 https://smart-calculator-m3013e6x5-chandana-builds-projects.vercel.app/

---

## 🧠 Core Capabilities

### 🔢 Intelligent Calculator Engine

* Supports standard arithmetic operations
* Handles **scientific functions**:

  * `sin`, `cos`, `tan`
  * `log`, `ln`
  * `√`, `π`, `e`
* Automatically balances parentheses for error reduction
* Built-in expression evaluation using JavaScript engine

---

### 🤖 AI Math Chatbot (Step-by-Step Solver)

* Integrated AI assistant for solving math problems
* Provides **structured, step-by-step explanations**
* Enforces **strict mathematical reasoning (BODMAS / order of operations)**
* Maintains conversation context for follow-up queries

---

### 🖼️ Image-Based Problem Solving

* Upload an image containing a math problem 📷
* AI extracts and interprets the problem
* Returns a **logical, step-by-step solution**
* Similar workflow to modern AI tools (vision + reasoning)

---

### 🎨 Dynamic UI Customization

* Real-time **color theme picker**
* Automatic **text contrast adjustment** for accessibility
* Smooth animations and responsive interface

---

### 🧾 Persistent Calculation History

* Stores previous calculations using `localStorage`
* View, clear, and manage history via modal interface

---

## 🛠️ Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Frontend   | HTML, CSS, JavaScript                     |
| UI/UX      | Custom CSS animations + responsive layout |
| Storage    | Browser LocalStorage                      |
| AI Backend | OpenRouter API (LLM + Vision Model)       |
| Model Used | `nvidia/nemotron-nano-12b-v2-vl`          |

---

## 🧩 System Architecture

* **Calculator Engine** → Handles real-time expression evaluation
* **Chat Module** → Manages user interaction & message rendering
* **AI Integration Layer** → Sends requests to OpenRouter API
* **Image Processing Flow**:

  1. Convert image → Base64
  2. Send to AI model
  3. Extract + solve problem
* **State Management** → Maintains chat history in memory

---

## 📂 Repository

🔗 https://github.com/chandana-builds/Smart-Calculator

---

## ⚙️ Setup & Installation

```bash id="setup123"
# Clone the repository
git clone https://github.com/chandana-builds/Smart-Calculator.git

# Navigate to project directory
cd Smart-Calculator

# Open index.html directly in browser
# OR use Live Server (VS Code recommended)
```

---

## 🔐 Environment Note

⚠️ The API key is currently included in the frontend for demonstration purposes.
For production use:

* Move API calls to a **backend server**
* Store API keys securely using environment variables

---

## ⚠️ Known Limitations

* Uses `eval()` for expression parsing (not सुरक्षित for untrusted input)
* AI responses depend on external API reliability
* Image recognition accuracy depends on input clarity

---

## 🚀 Future Enhancements

* Replace `eval()` with a secure math parser
* Add **graph plotting** for equations
* Improve OCR accuracy for complex handwritten inputs
* Backend integration for secure API handling
* Mobile app version (Android / Play Store)

---

## 🤝 Contributing

Contributions are welcome.
Feel free to fork the repository and submit pull requests.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Chandana**
🔗 https://github.com/chandana-builds

---

## 💡 Concept

This project bridges the gap between a calculator and a tutor —
transforming problem-solving into a **learning experience**, not just computation.

---
