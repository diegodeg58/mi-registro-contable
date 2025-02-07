function processRequestButton(button, ajax, done, fail) {
  const originalText = button.text();
  button
    .prop("disabled", true)
    .removeClass("btn-primary")
    .addClass("btn-warning")
    .text("Procesando...");

  ajax
    .done(done)
    .fail(fail)
    .always(() => {
      button
        .prop("disabled", false)
        .removeClass("btn-warning")
        .addClass("btn-primary")
        .text(originalText);
    });
}

function toJsonForm(form) {
  return form.serializeArray().reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});
}

const appendAlert = (message, type) => {
  const alert = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  $("#liveAlertPlaceholder").html(alert);
  $("#liveAlertPlaceholder").removeClass("d-none");
};