document.addEventListener("DOMContentLoaded", () => {

  const display = document.getElementById("display");
  const historyBtn = document.getElementById("historyBtn");
  const historyModal = document.getElementById("historyModal");
  const historyList = document.getElementById("historyList");
  const colorPicker = document.getElementById("colorPicker");

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
      document.documentElement.style.setProperty("--themeColor", this.value);
      document.body.style.background = this.value + "22";
    });
  }

  // ---------- History Button ----------
  if (historyBtn) {
    historyBtn.addEventListener("click", openHistory);
  }

});