const ui = document.querySelectorAll('.ui');
const userId = document.getElementById('userId');
const deleteBtns = document.querySelectorAll('.deleteBtn');
const actionModal = document.getElementById('actionModal');
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');

deleteBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    userId.value = ui[i].value;
    console.log(userId.value);
    actionModal.classList.toggle('hidden');
  });
});

btnNo.addEventListener('click', () => {
  actionModal.classList.add('hidden');
});
btnYes.addEventListener('click', () => {
  actionModal.classList.add('hidden');
});
