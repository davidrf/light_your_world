/**
 * light_shows.js
 *
 * Global JavaScript.
 */

// url global variable
// var url = "10.10.11.132";
var url = "192.168.0.12";
var light_sequences = [];
var light_effect_hash = {};
var light_effect_setting = {};
var light_power_status = {
  1: false,
  2: false,
  3: false
};

// this will be called when the DOM is ready
$(function() {
  //get light effect list
  get_light_effect_list();
  updateLightSequences($('#user_light_shows option:selected').val());

  $('.new_light_sequence').change(function() {
    updateOneBulb();
  });

  $('#user_light_shows').change(function() {
    updateLightSequences(this.value);
  });

  $(document.body).on('click', '.delete_light_show', function(event) {
    event.preventDefault();
    deleteLightSequence(this);
  });

  $(document.body).on('click', '.edit_light_show' , function(event) {
    event.preventDefault();
    editLightSequence(this);
  });

  $('#play-light-show').click(function(event) {
    event.preventDefault();
    playLightShow();
  });
});

function playLightShow() {
  debugger;
};

function prepareLightSequence(light_sequence) {
  var light_effect_id = light_sequence["light_effect_id"];
  var light_id = light_sequence["light_id"];
  var power = light_sequence["on"] === 1 ? true : false;
  var data;
  if (powerChanged(light_id, power)) {
    data = dataConstructor(
      light_effect_setting[light_effect_id]["hue"],
      light_effect_setting[light_effect_id]["brightness"],
      light_effect_setting[light_effect_id]["saturation"],
      light_sequence["transition_time"],
      power
    )
  } else {
    data = dataConstructor(
      light_effect_setting[light_effect_id]["hue"],
      light_effect_setting[light_effect_id]["brightness"],
      light_effect_setting[light_effect_id]["saturation"],
      light_sequence["transition_time"]
    )
  }
  var hash = {};
  hash["scheduled_time"] = light_sequence["scheduled_time"];
  hash["light_id"] = light_sequence["light_id"];
  hash["data"] = data;
  return hash;
};

function powerChanged(id, power_status) {
  if (light_power_status[id] === power_status) {
    return false;
  } else {
    light_power_status[id] = power_status;
    return true;
  }
};

function resetLightSequences() {
  light_sequences = [];
  light_power_status = {
    1: false,
    2: false,
    3: false
  };
};

function editLightSequence(a_element) {
  var href_array = a_element.href.split("/");
  var light_sequence_id = href_array[href_array.length - 1];

  if (a_element.text == "Edit") {
    // build HTML to be appended
    var scheduled_time_input = buildInput(light_sequence_id, "scheduled_time");
    var light_effect_input = buildSelectLightEffect(light_sequence_id);
    var light_id_input = buildSelectLightId(light_sequence_id);
    var transition_time_input = buildInput(light_sequence_id, "transition_time");
    var power_input = buildCheckBox(light_sequence_id);
    // obtain original values for light sequence
    var scheduled_time_value = $('td#scheduled_time_' + light_sequence_id).text();
    var light_effect_value = $('td#light_effect_' + light_sequence_id).text();
    var light_id_value = $('td#light_id_' + light_sequence_id).text();
    var transition_time_value = $('td#transition_time_' + light_sequence_id).text();
    var power_value = $('td#power_' + light_sequence_id).text();
    // remove original values for light sequence
    $('td#scheduled_time_' + light_sequence_id).empty();
    $('td#light_effect_' + light_sequence_id).empty();
    $('td#light_id_' + light_sequence_id).empty();
    $('td#transition_time_' + light_sequence_id).empty();
    $('td#power_' + light_sequence_id).empty();
    // append HTML input fields
    $('td#scheduled_time_' + light_sequence_id).append(scheduled_time_input);
    $('td#light_effect_' + light_sequence_id).append(light_effect_input);
    $('td#light_id_' + light_sequence_id).append(light_id_input);
    $('td#transition_time_' + light_sequence_id).append(transition_time_input);
    $('td#power_' + light_sequence_id).append(power_input);
    // update HTML input fields with original values for light sequence
    $('#edit_scheduled_time_' + light_sequence_id).val(scheduled_time_value);
    $('#edit_light_effect_' + light_sequence_id + ' option').each(function() {
      if($(this).text() == light_effect_value) {
        $(this).attr('selected', 'selected');
      }
    });
    $('#edit_light_id_' + light_sequence_id + ' option').each(function() {
      if($(this).text() == light_id_value) {
        $(this).attr('selected', 'selected');
      }
    });
    $('#edit_transition_time_' + light_sequence_id).val(transition_time_value);
    if (power_value == "On") {
      $('#edit_power_' + light_sequence_id).prop('checked', true);
    }
    // change link text to update
    a_element.text = "Update";
  } else {
    var scheduled_time = $('#edit_scheduled_time_' + light_sequence_id).val();
    var light_effect = $('#edit_light_effect_' + light_sequence_id).val();
    var light_id = $('#edit_light_id_' + light_sequence_id).val();
    var transition_time = $('#edit_transition_time_' + light_sequence_id).val();
    var power = $('#edit_power_' + light_sequence_id).is(':checked') ? "1" : "0";

    $.ajax({
      method: "PUT",
      url: "/light_sequences/" + light_sequence_id,
      data: {
        light_sequence: {
          scheduled_time: scheduled_time,
          light_effect_id: light_effect,
          light_id: light_id,
          transition_time: transition_time,
          on: power
        }
      }
    })
      .done(function(light_sequence) {
        var new_light_sequence_row = buildTableRow(light_sequence);
        var light_sequence_row = $("tr#light_sequence_" + light_sequence_id);
        if (light_sequence_row[0] == $('tbody tr:first')[0]) {
          light_sequence_row.remove();
          $('tbody').prepend(new_light_sequence_row);
        } else {
          var previous_row = light_sequence_row.prev();
          light_sequence_row.remove();
          previous_row.after(new_light_sequence_row);
        }
        a_element.text = "Edit";
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
          var errors = $.parseJSON(jqXHR.responseText).errors;
          console.log(errors);
      });
  }
};

function buildCheckBox(id) {
  return "<input type='checkbox' id='edit_power_" + id + "'>";
};

function buildSelectLightId(id) {
  var html = "<select id='edit_light_id_" + id + "'>";
  for (var i = 1; i < 4; i++) {
    html += "<option value='" + i + "'>" + i + "</option>";
  }
  html += "</select>";
  return html;
};

function buildSelectLightEffect(id) {
  var html = "<select id='edit_light_effect_" + id + "'>";
  for (var key in light_effect_hash) {
    if (light_effect_hash.hasOwnProperty(key)) {
      html += "<option value='" + key + "'>" + light_effect_hash[key] + "</option>";
    }
  }
  html += "</select>";
  return html;
};

function buildInput(id, type) {
  return "<input type='number' id='edit_" + type + "_" + id + "'>";
}

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
      resetLightSequences();
      for (var i = 0; i < data.length; i++) {
        var light_sequence = data[i];
        light_sequences.push(prepareLightSequence(light_sequence));
        light_sequences_html += buildTableRow(light_sequence);
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
  html += "<a class='delete_light_show' href='/light_sequences/" + id + "'>Delete</a>";
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
