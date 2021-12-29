const parents = document.querySelector(".parent");
const child = document.querySelector(".child");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const bgModal = document.querySelector(".bg-modal");
const navToggle = document.querySelector(".dropdown");
const navDropdown = document.querySelector(".nav__dropdown");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const img = document.getElementById("img");
const imgsrc = document.getElementById("imgsrc");
const notesInput = document.getElementById("notes");
const notes_btn = document.getElementById("notes-btn");
const notesView = document.querySelector(".notes-view");
const notesValue = document.getElementById("notes-value");
const menu = document.querySelector(".account__menu");
const dropdown = document.querySelector(".dropdown");
const noteNodes = document.querySelectorAll(".state");
const noteText = document.querySelectorAll(".note-text");
const notesBtn = document.querySelector(".notes__btn");
const noteId = document.getElementById("noteId");

window.onclick = function (e) {
  if (!e.target.matches(".dropdown")) {
    let op = document.getElementsByClassName("nav__dropdown");
    for (let i = 0; i < op.length; i++) {
      let open = op[i];
      if (open.classList.contains("dropdown-show")) {
        open.classList.remove("dropdown-show");
      }
    }
  }
};

window.onclick = function (e) {
  if (!e.target.matches(".dropdown")) {
    let op = document.getElementsByClassName("account__menu");
    for (let i = 0; i < op.length; i++) {
      let open = op[i];
      if (open.classList.contains("show-menu")) {
        open.classList.remove("show-menu");
      }
    }
  }
};
if (dropdown) {
  dropdown.addEventListener("click", () => {
    menu.classList.toggle("show-menu");
  });
}

if (noteNodes) {
  noteNodes.forEach((note, i) => {
    note.addEventListener("click", () => {
      noteText[i].classList.toggle("done");
      notesBtn.classList.add("notes__btn-show");
    });
  });
}

let notes = "";

if (notes_btn) {
  notes_btn.addEventListener("click", () => {
    const input = notesInput.value.trim();
    notes += `${input};`;
    if (input.length > 5) {
      const tag = document.createElement("li");
      const text = document.createTextNode(input);
      tag.appendChild(text);
      notesView.appendChild(tag);
      notesInput.value = "";
    }

    notesValue.value = notes;
  });
}

let index = 0;
const MAX_INDEX = 3;
if (right) {
  right.addEventListener("click", () => {
    if (index != MAX_INDEX) {
      index += 1;
    } else {
      index = 0;
    }
    let src = `/assets/img/ava-${index + 1}.png`;
    img.src = src;
    imgsrc.value = src;
  });
}

if (left) {
  left.addEventListener("click", () => {
    if (index != 0) {
      index -= 1;
    } else {
      index = MAX_INDEX;
    }

    let src = `/assets/img/ava-${index + 1}.png`;
    img.src = src;
    imgsrc.value = src;
  });
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navDropdown.classList.toggle("dropdown-show");
  });
}

if (modal) {
  modal.addEventListener("click", () => {
    console.log("click");
    bgModal.classList.add("show-modal");
  });
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    bgModal.classList.remove("show-modal");
  });
}

if (parents) {
  parents.addEventListener("click", () => {
    child.classList.toggle("active");
  });
}
