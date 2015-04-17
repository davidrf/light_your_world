/**
 * light_shows.js
 *
 * Global JavaScript.
 */

// url global variable
// var url = "10.10.11.132";
var url = "192.168.0.12";
var light_sequence_list = [];
var light_effect_hash = {};

// this will be called when the DOM is ready
$(function() {
  //get light effect list
  get_light_effect_list();

  $('.new_light_sequence').change(function() {
    updateOneBulb();
  });

  $('#user_light_shows').change(function() {
    updateLightSequences(this.value);
  });

  $('.delete_light_show').click(function(event) {
    event.preventDefault();
    deleteLightSequence(this);
  });

  $('.edit_light_show').click(function(event) {
    event.preventDefault();
    editLightSequence(this);
  });
});

function editLightSequence(a_element) {
  var href_array = a_element.href.split("/");
  var light_sequence_id = href_array[href_array.length - 1];
};

function deleteLightSequence(a_element) {
  var href_array = a_element.href.split("/");
  var light_sequence_id = href_array[href_array.length - 1];

  $.ajax({
    method: "DELETE",
    url: "/light_sequences/" + light_sequence_id
  })
    .done(function() {
      $("tr#light_sequence_" + light_sequence_id).remove();
    });
};

function updateLightSequences(light_show_id){
  $('form#new_light_sequence').attr("action",
    "/light_shows/" + light_show_id + "/light_sequences"
  );

  $.getJSON("/light_shows/" + light_show_id + "/light_sequences")
    .done(function(data, textStatus, jqXHR) {
      var light_sequences_html = "";
      for (var i = 0; i < data.length; i++) {
        light_sequences_html += buildTableRow(data[i]);
        console.log(buildTableRow(data[i]));
      }
      $('tr.light_sequence_row').remove();
      $('tbody').append(light_sequences_html);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown.toString());
  });

};

function buildTableRow(light_sequence){
  var id = light_sequence["id"];
  var light_effect_id = light_sequence["light_effect_id"];
  var light_effect_name = light_effect_hash[light_effect_id];
  var power = light_sequence["on"] === 1 ? "On" : "Off";
  var html = "<tr class='light_sequence_row' id='light_sequence_" + id + "'>";
  html += "<td id='scheduled_time_" + id + "'>" + light_sequence["scheduled_time"] + "</td>";
  html += "<td id='light_effect_" + id + "'>" + light_effect_name + "</td>";
  html += "<td id='light_id_" + id + "'>" + light_sequence["light_id"] + "</td>";
  html += "<td id='transition_time_" + id + "'>" + light_sequence["transition_time"] + "</td>";
  html += "<td id='power_" + id + "'>" + power + "</td>";
  html += "<td>";
  html += "<div class='small-6 column text-center'>";
  html += "<a class='edit_light_show' href='/light_sequences/" + id + "'>Edit</a>";
  html += "</div>";
  html += "<div class='small-6 column text-center'>";
  html += "<a class='edit_light_show' href='/light_sequences/" + id + "'>Delete</a>";
  html += "</div>";
  html += "</td>";
  html += "</tr>";

  return html;
};

function updateOneBulb(){
  var light_effect_id = $("#light_sequence_light_effect_id").val();
  var light_id = $("#light_sequence_light_id").val();
  var transition_time = $("#light_sequence_transition_time").val();
  var power_on = $('#light_sequence_on').is(':checked');

  $.getJSON("/light_effects/" + light_effect_id, { id: light_effect_id } )
    .done(function(data, textStatus, jqXHR) {
      var hue = data["hue"];
      var brightness = data["brightness"];
      var saturation = data["saturation"];

      $.ajax({
        method:"PUT",
        url: urlConstructor(light_id),
        data: dataConstructor(hue, brightness, saturation, transition_time, power_on)
      });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown.toString());
  });
};

function urlConstructor(light_id){
  return "http://" + url + "/api/newdeveloper/lights/" + light_id + "/state";
};

function dataConstructor(hue, brightness, saturation, transition_time, power_on){
  var data = '{';
  if (power_on === false) {
    data += '"on":false';
  } else {
    if (power_on === true) {
      data += '"on":true,';
    }
    data += '"hue":' + hue + ',';
    data += '"bri":' + brightness + ',';
    data += '"sat":' + saturation  + ',';
    data += '"transitiontime":' + transition_time;
  }
  data += '}';
  return data;
};
