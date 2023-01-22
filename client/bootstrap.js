const myModal = new bootstrap.Modal("#expenseModal", {
  keyboard: false,
});
window.openModal = function () {
  myModal.show();
};

window.hideModal = function () {
  myModal.hide();
};
