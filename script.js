(function () {
  const canvas = document.getElementById("canvas");
  const createBtn = document.getElementById("createBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const saveBtn = document.getElementById("saveBtn");
  const loadBtn = document.getElementById("loadBtn");
  const trashZone = document.getElementById("trashZone");
  const elementCountSpan = document.getElementById("elementCount");
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  const modalConfirm = document.getElementById("modalConfirm");
  const modalCancel = document.getElementById("modalCancel");

  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");
  const bgColorInput = document.getElementById("bgColor");
  const borderWidthInput = document.getElementById("borderWidth");
  const borderColorInput = document.getElementById("borderColor");
  const borderRadiusInput = document.getElementById("borderRadius");
  const textInput = document.getElementById("text");
  const fontSizeInput = document.getElementById("fontSize");
  const textColorInput = document.getElementById("textColor");
  const fontFamilySelect = document.getElementById("fontFamily");
  const canvasColorInput = document.getElementById("canvasColor");

  const widthError = document.getElementById("widthError");
  const heightError = document.getElementById("heightError");

  let elements = [];
  let nextId = 1;

  // Spalvų pasirinkimas
  document.querySelectorAll(".color-label").forEach((label) => {
    label.addEventListener("click", () => {
      const type = label.dataset.color;
      let input;
      if (type === "bg") input = bgColorInput;
      else if (type === "border") input = borderColorInput;
      else if (type === "text") input = textColorInput;
      else if (type === "canvas") input = canvasColorInput;
      if (input) input.click();
    });
  });

  canvasColorInput.addEventListener("change", (e) => {
    canvas.style.backgroundColor = e.target.value;
  });

  window.addEventListener("load", () => {
    widthInput.value = "0";
    heightInput.value = "0";
    borderWidthInput.value = "0";
  });

  function showModal(message, onConfirm, onCancel) {
    modalMessage.textContent = message;
    modal.style.display = "flex";
    const confirmHandler = () => {
      modal.style.display = "none";
      modalConfirm.removeEventListener("click", confirmHandler);
      modalCancel.removeEventListener("click", cancelHandler);
      if (onConfirm) onConfirm();
    };
    const cancelHandler = () => {
      modal.style.display = "none";
      modalConfirm.removeEventListener("click", confirmHandler);
      modalCancel.removeEventListener("click", cancelHandler);
      if (onCancel) onCancel();
    };
    modalConfirm.addEventListener("click", confirmHandler);
    modalCancel.addEventListener("click", cancelHandler);
  }

  function createElement() {
    const width = parseInt(widthInput.value) || 0;
    const height = parseInt(heightInput.value) || 0;
    const text = textInput.value.trim();

    if ((width === 0 || height === 0) && text === "") {
      widthError.textContent = "Reikia pločio/aukščio arba teksto";
      heightError.textContent = "Reikia pločio/aukščio arba teksto";
      return;
    }
    widthError.textContent = "";
    heightError.textContent = "";

    const id = nextId++;
    const div = document.createElement("div");
    div.className = "element";
    div.setAttribute("data-id", id);

    if (width > 0) div.style.width = width + "px";
    if (height > 0) div.style.height = height + "px";
    div.style.backgroundColor = bgColorInput.value;
    div.style.border = `${borderWidthInput.value}px solid ${borderColorInput.value}`;

    // PATAISYMAS: apvalinimas ne daugiau 50%
    let radius = parseInt(borderRadiusInput.value);
    if (radius > 50) radius = 50;
    if (radius < 0) radius = 0;
    div.style.borderRadius = radius + "%";

    div.style.color = textColorInput.value;
    div.style.fontSize = fontSizeInput.value + "px";
    div.style.fontFamily = fontFamilySelect.value;
    div.style.left = "20px";
    div.style.top = "20px";
    div.innerText = text || "";

    canvas.appendChild(div);
    elements.push({ id, element: div });
    updateCount();
    makeDraggableAndRotatable(div);
  }

  function makeDraggableAndRotatable(el) {
    let rot = 0;
    let isDragging = false;
    let offsetX, offsetY;
    let rotationActive = false;
    let wheelHandler = null;

    // Sukimas
    el.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      rotationActive = true;
      if (wheelHandler) el.removeEventListener("wheel", wheelHandler);
      wheelHandler = (wheelEvent) => {
        if (!rotationActive) return;
        wheelEvent.preventDefault();
        rot += wheelEvent.deltaY > 0 ? -5 : 5;
        el.style.transform = `rotate(${rot}deg)`;
      };
      el.addEventListener("wheel", wheelHandler);

      const disableRotation = () => {
        rotationActive = false;
        document.removeEventListener("click", disableRotation);
      };
      document.addEventListener("click", disableRotation, { once: true });
    });

    // Vilkimas
    el.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      isDragging = true;

      const rect = el.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      el.style.zIndex = 999;
      el.style.cursor = "grabbing";

      const onMouseMove = (moveEvent) => {
        if (!isDragging) return;

        let newLeft = moveEvent.clientX - offsetX - canvasRect.left;
        let newTop = moveEvent.clientY - offsetY - canvasRect.top;

        newLeft = Math.min(
          Math.max(newLeft, 0),
          canvas.clientWidth - el.offsetWidth,
        );
        newTop = Math.min(
          Math.max(newTop, 0),
          canvas.clientHeight - el.offsetHeight,
        );

        el.style.left = newLeft + "px";
        el.style.top = newTop + "px";

        // Patikrinti ar elementas kerta šiukšliadėžę
        const trashRect = trashZone.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const crossesTrash =
          elRect.bottom > trashRect.top && elRect.top < trashRect.bottom;
        if (crossesTrash) {
          el.style.opacity = "0.4";
        } else {
          el.style.opacity = "1";
        }
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        const trashRect = trashZone.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        // PATAISYMAS: tikriname ar bet kuri elemento dalis kerta šiukšliadėžę
        const crossesTrash =
          elRect.bottom > trashRect.top && elRect.top < trashRect.bottom;

        if (crossesTrash) {
          el.remove();
          elements = elements.filter((e) => e.element !== el);
          updateCount();
        }
        el.style.opacity = "1";
        el.style.zIndex = "";
        el.style.cursor = "grab";
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  function updateCount() {
    elementCountSpan.textContent = elements.length;
  }

  function clearAll() {
    if (elements.length === 0) return;
    showModal(
      "Ar tikrai išvalyti viską?",
      () => {
        elements.forEach((el) => el.element.remove());
        elements = [];
        updateCount();
      },
      () => {},
    );
  }

  function saveToLocalStorage() {
    const data = elements.map((el) => ({
      id: el.id,
      width: el.element.style.width,
      height: el.element.style.height,
      text: el.element.innerText,
      left: el.element.style.left,
      top: el.element.style.top,
      bgColor: el.element.style.backgroundColor,
      border: el.element.style.border,
      borderRadius: el.element.style.borderRadius,
      color: el.element.style.color,
      fontSize: el.element.style.fontSize,
      fontFamily: el.element.style.fontFamily,
      transform: el.element.style.transform,
    }));
    localStorage.setItem("shapesData", JSON.stringify(data));
    alert("Išsaugota!");
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("shapesData");
    if (!saved) {
      alert("Nėra duomenų");
      return;
    }
    showModal(
      "Įkėlus, esami bus išvalyti. Tęsti?",
      () => {
        elements.forEach((el) => el.element.remove());
        elements = [];
        const data = JSON.parse(saved);
        data.forEach((item) => {
          const div = document.createElement("div");
          div.className = "element";
          div.style.cssText = `
          width: ${item.width}; height: ${item.height};
          background-color: ${item.bgColor}; border: ${item.border};
          border-radius: ${item.borderRadius}; color: ${item.color};
          font-size: ${item.fontSize}; font-family: ${item.fontFamily};
          left: ${item.left}; top: ${item.top};
          transform: ${item.transform};
        `;
          div.innerText = item.text;
          canvas.appendChild(div);
          elements.push({ id: item.id, element: div });
          makeDraggableAndRotatable(div);
        });
        updateCount();
      },
      () => {},
    );
  }

  createBtn.addEventListener("click", createElement);
  clearAllBtn.addEventListener("click", clearAll);
  saveBtn.addEventListener("click", saveToLocalStorage);
  loadBtn.addEventListener("click", loadFromLocalStorage);

  fontFamilySelect.addEventListener("change", () => {
    document.querySelector(".font-preview").style.fontFamily =
      fontFamilySelect.value;
  });
  document.querySelector(".font-preview").style.fontFamily =
    fontFamilySelect.value;
})();
