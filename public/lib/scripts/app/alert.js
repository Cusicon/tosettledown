$(document).ready(() => {
  var message = $("div#messages ul");
  // var image = $("div#messages ul").attr('data-src');
  var text = $("div#messages ul li").text();
  var mode = $("div#messages ul").attr("class");

  if (text != "") {
    alert(mode, text);
  }
  message.html("");
});

var alert = (mode, msg) => {
  var upperMode = mode.replace(mode.charAt(0), mode.charAt(0).toUpperCase());
  swal({
    title: upperMode,
    text: msg,
    icon: mode || null,
    closeOnEsc: true,
    closeOnClickOutside: true
  });
}
