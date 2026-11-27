/* Pay with Crypto — plan form (prototype: no request is sent) */
(function () {
  var form = document.querySelector('.cr-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.querySelector('.cr-form__done').hidden = false;
    form.querySelector('button[type="submit"]').disabled = true;
  });
})();
