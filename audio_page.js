    const emojis = ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😙","😋","😜","🤑","🤗","🤔","😎","🥳"];
    const layer = document.getElementById('emojiLayer');
    for (let i = 0; i < 50; i++) {
      const e = document.createElement('div');
      e.className = 'emoji';
      e.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      e.style.left = Math.random() * 100 + 'vw';
      e.style.top = Math.random() * 100 + 'vh';
      e.style.animationDuration = (10 + Math.random() * 20) + 's';
      e.style.fontSize = (18 + Math.random() * 8) + 'px';
      layer.appendChild(e);
    }

    function toggleMenu() {
      document.getElementById("sideMenu").classList.toggle("open");
      document.getElementById("navMenu").classList.toggle("hidden-slide");
    }

    document.addEventListener('click', function (e) {
      const bubble = document.createElement('div');
      bubble.className = 'click-bubble';
      bubble.style.left = `${e.clientX}px`;
      bubble.style.top = `${e.clientY}px`;
      document.body.appendChild(bubble);
      setTimeout(() => bubble.remove(), 400);
    });

const filePopup = document.getElementById('filePopup');
const loadingPopup = document.getElementById('loadingPopup');
const fileInput = document.getElementById('fileInput');
const fileLabel = document.getElementById('fileLabel');
const fileNameDisplay = document.getElementById('fileName');
const okButton = document.getElementById('okButton');
const loadingBar = document.getElementById('loadingBar');

const contentContainer = document.getElementById('contentContainer');

document.querySelector('.upload-btn').addEventListener('click', () => {
  resetUploadPopup();
  filePopup.style.display = 'flex';
  setTimeout(() => filePopup.classList.add('show'), 10);
  contentContainer.classList.add('blur-background');
});

okButton.addEventListener('click', () => {
  filePopup.classList.remove('show');
  setTimeout(() => filePopup.style.display = 'none', 400);
  loadingPopup.style.display = 'flex';
  setTimeout(() => loadingPopup.classList.add('show'), 10);

  // Animate loading bar
  loadingBar.style.width = '0%';
  setTimeout(() => loadingBar.style.width = '100%', 10);

  // Get the uploaded file
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file before pressing OK.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  // Call API in parallel but display after 5s (loading bar)
  fetch("http://127.0.0.1:8000/predict_audio_emotion", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
  setTimeout(() => {
    loadingPopup.classList.remove('show');
    setTimeout(() => loadingPopup.style.display = 'none', 400);

    const displayBox = document.querySelector(".display-box");

    // Map emotion → emoji
    const emojiMap = {
      angry: "😠",
      calm: "😌",
      disgust: "🤢",
      fearful: "😨",
      happy: "😄",
      neutral: "😐",
      sad: "😢",
      surprised: "😲"
    };

    // Check if result is valid
    if (data.predicted_emotion) {
      const emotion = data.predicted_emotion;
      const emoji = emojiMap[emotion] || "";

      displayBox.innerHTML = `
  <div class="display-box-content">
    <div class="emotion-line">
      Emotion:
      <span class="emotion-label">${emotion} ${emoji}</span>
    </div>
    <div class="confidence-line">
      Confidence: ${(data.confidence * 100).toFixed(2)}%
    </div>
  </div>
`;
    } else {
      displayBox.innerHTML = `
  <div class="display-box-error">
    Could not detect emotion.
  </div>
`;

    }

    resetUploadPopup();
    contentContainer.classList.remove('blur-background');
  }, 5000);  // After loading bar animation ends
  })
  .catch(err => {
    setTimeout(() => {
      loadingPopup.classList.remove('show');
      setTimeout(() => loadingPopup.style.display = 'none', 400);

      const displayBox = document.querySelector(".display-box");
      displayBox.innerHTML = `
        <div style="
            font-size: 28px; 
            text-align: center; 
            color: red;
            padding-top: 140px;
        ">
          Error analyzing audio.
        </div>
      `;
      console.error("Prediction error:", err);
      resetUploadPopup();
      contentContainer.classList.remove('blur-background');
    }, 5000);
  });
});


fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    fileLabel.style.display = 'none';
    fileNameDisplay.textContent = `${file.name}`;
    fileNameDisplay.style.display = 'block';
    okButton.style.display = 'inline-block';
  }
});

function resetUploadPopup() {
  fileInput.value = '';
  fileLabel.style.display = 'inline-block';
  fileNameDisplay.textContent = '';
  fileNameDisplay.style.display = 'none';
  okButton.style.display = 'none';
}
