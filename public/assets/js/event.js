const parents = document.querySelector('.parent');
const child = document.querySelector('.child');
const signupModal = document.getElementById('signupModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const modalSignUpToggle = document.getElementById('modalSignUpToggle');
const profileMenu = document.getElementById('profileMenu');
const submenuProfile = document.getElementById('submenuProfile');
const navToggle = document.querySelector('.dropdown');
const navDropdown = document.querySelector('.nav__dropdown');
// note stuff
const notesInput = document.getElementById('note');
const notesButton = document.getElementById('notes-btn');
const noteUl = document.getElementById('note-ul');
const noteResult = document.getElementById('noteResult');
const listItem = document.querySelectorAll('.listItem');

const menu = document.querySelector('.account__menu');
const dropdown = document.querySelector('.dropdown');
const noteNodes = document.querySelectorAll('.state');
const noteText = document.querySelectorAll('.note-text');
const notesBtn = document.querySelector('.notes__btn');
const avatar = document.getElementById('avatar');
const menuNav = document.getElementById('menu');

const weightModal = document.getElementById('weightModal');
const heightModal = document.getElementById('heightModal');
const weightHeightModal = document.getElementById('weightHeightModal');
const modalId = document.getElementById('modalId');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalBorder = document.getElementById('borderModal');
const mc = document.getElementById('modalContainer');
const modalClose = document.getElementById('modalClose');
const modalContainer = document.querySelector('.cmContainer');

const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

const windowOnClick = (e, target, toggle, className) => {
  if (!e.target.matches(target)) {
    const op = document.getElementsByClassName(toggle);
    for (let i = 0; i < op.length; i += 1) {
      const open = op[i];
      if (open.classList.contains(className)) {
        open.classList.remove(className);
      }
    }
  }
};

window.onclick = function (e) {
  windowOnClick(e, '.dropdown', 'nav__dropdown', 'dropdown-show');

  if (profileMenu) {
    if (!e.target.matches('#profileMenu')) {
      const op = document.getElementById('submenuProfile');
      if (op) {
        if (!op.classList.contains('hidden')) {
          op.classList.add('hidden');
        }
      }
    }
  }

  if (!e.target.matches('#sidebarToggle')) {
    const op = document.getElementById('sidebar');
    if (op) {
      if (op.classList.contains('lg:translate-x-0')) {
        op.classList.add('-translate-x-full');
      }
    }
  }

  if (avatar) {
    if (!e.target.matches('#avatar')) {
      const op = document.getElementById('menu');
      if (op) {
        if (!op.classList.contains('hidden')) {
          op.classList.add('hidden');
        }
      }
    }
  }
};

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', e => {
    sidebar.classList.toggle('-translate-x-full');
  });
}

if (dropdown) {
  dropdown.addEventListener('click', () => {
    menu.classList.toggle('show-menu');
  });
}

if (noteNodes) {
  noteNodes.forEach((note, i) => {
    note.addEventListener('click', () => {
      noteText[i].classList.toggle('done');
      notesBtn.classList.add('notes__btn-show');
    });
  });
}

let notes = '';
// let notesId = -1;
const dbNotes = [];

if (notesButton) {
  notesButton.addEventListener('click', () => {
    const input = notesInput.value.trim();
    const tag = document.createElement('li');
    const text = document.createTextNode(input);
    if (input.length > 5) {
      notes += `${input};`;
      tag.appendChild(text);
      noteUl.appendChild(tag);
      notesInput.value = '';
    }

    noteResult.value = notes;
  });
}

if (listItem) {
  listItem.forEach(e => dbNotes.push(e.textContent));
  dbNotes.forEach(note => {
    notes += `${note};`;
  });

  listItem.forEach((item, i) => {
    item.addEventListener('click', e => {
      notesInput.value = item.textContent;
      if (dbNotes[i] === item.textContent) {
        notesId = i;
      }
    });
  });
}

if (avatar) {
  avatar.addEventListener('click', () => {
    console.log(1);
    menuNav.classList.toggle('hidden');
  });
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navDropdown.classList.toggle('dropdown-show');
  });
}

if (modalSignUpToggle) {
  modalSignUpToggle.addEventListener('click', () => {
    signupModal.classList.remove('hidden');
  });
}

if (closeSignupModal) {
  closeSignupModal.addEventListener('click', () => {
    signupModal.classList.add('hidden');
  });
}

if (profileMenu) {
  profileMenu.addEventListener('click', () => {
    submenuProfile.classList.toggle('hidden');
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    mc.classList.remove('bg-sky-50');
    mc.classList.remove('bg-pink-50');
    mc.classList.remove('bg-teal-50');
    modalTitle.classList.remove('text-sky-500');
    modalTitle.classList.remove('text-pink-500');
    modalTitle.classList.remove('text-teal-500');
    modalDesc.classList.remove('text-sky-500');
    modalDesc.classList.remove('text-pink-500');
    modalDesc.classList.remove('text-teal-500');
    modalBorder.classList.remove('border-sky-600');
    modalBorder.classList.remove('border-pink-600');
    modalBorder.classList.remove('border-teal-600');
    modalClose.classList.remove('text-sky-500');
    modalClose.classList.remove('text-pink-500');
    modalClose.classList.remove('text-teal-500');

    modalContainer.classList.add('hidden');
  });
}

if (parents) {
  parents.addEventListener('click', () => {
    child.classList.toggle('active');
  });
}
