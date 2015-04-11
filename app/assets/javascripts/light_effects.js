/**
 * light_effects.js
 *
 * Global JavaScript.
 */

// url global variable
var url = "10.10.11.132";
var light_effect_list = [];

// this will be called when the DOM is ready
$(function(){
    //get light effect list
    get_light_effect_list();

    // function to look up ip address of hue lights bridge
    // lookup_url();

    // look up properties of saved effect and display them
    $('#user-light-effects').change(function () {
      var selected_light_effect = $('#user-light-effects').find(":selected").val();
      show_light_effect(selected_light_effect);
    })

    // edit light effect if
    $('#add-edit-button').click(function (event) {
      if (this.value == "Edit Light Effect") {
        event.preventDefault();
        edit_light_effect();
      }
    })

    // delete selected light effect
    $('#delete-light-effect').click(function (event) {
      event.preventDefault();
      var selected_light_effect = $('#user-light-effects').find(":selected").val();
      if (selected_light_effect) {
        destroy_light_effect(selected_light_effect);
      }
    })

    //setup before functions
    var typingTimer;                // timer identifier
    var doneTypingInterval = 500;    // time in ms, 0.5 second for example

    // on keyup of hue input, start the countdown
    $('.new_light_effect').keyup(function(){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(changecolor, doneTypingInterval);
    });

    $('#light-effect-name').keyup(function() {
      changebutton();
    });

    $('.new_light_effect').change(function(){
        changecolor();
    });

    $('#power-on').change(function(){
        toggle_power();
    });
});

// edit light effect data
function edit_light_effect(){
  var name = $("#light-effect-name").val();
  var light_effect_id = $('#user-light-effects option').filter(function () {
    return $(this).html() == name;
  }).val();

  var hue = $("#hue").val();
  var brightness = $("#brightness").val();
  var saturation = $("#saturation").val();
  var transition_time = $("#transition-time").val();
  var on = $('#power-on').is(':checked') ? "1" : "0";

  $.ajax({
    method: "PUT",
    url: "/light_effects/" + light_effect_id,
    data: { light_effect: {
      name: name,
      hue: hue, brightness:
      brightness,
      saturation: saturation,
      transition_time: transition_time,
      on: on
    } }
  })
};

// function to change button name
function changebutton() {
  var input = $('#light-effect-name').val();
  if ($.inArray(input, light_effect_list) !== -1) {
    $('#add-edit-button').val("Edit Light Effect");
  } else {
    $('#add-edit-button').val("Add Light Effect");
  }
};

// function to obtain list of light effects
function get_light_effect_list() {
  $.getJSON("/light_effects")
    .done(function(data, textStatus, jqXHR) {
      for (var i = 0; i < data.length; i++) {
        light_effect_list.push(data[i].name);
      }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown.toString());
  });
};

// get ip address of bridge
function lookup_url(){
    var parameters;
    $.getJSON("search_url.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // obtain url
        url = data[0].url;

    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        console.log(errorThrown.toString());

    });
};

// get data about saved effect and change lights to effect
function show_light_effect(light_effect_id){
    // get effect attributes from database
    $.getJSON("/light_effects/" + light_effect_id)
      .done(function(data, textStatus, jqXHR) {
          // obtain effect atrributes from JSON response
          var name = data["name"];
          var hue = data["hue"];
          var brightness = data["brightness"];
          var saturation = data["saturation"];
          var transition_time = data["transition_time"];
          var power_on = (data["transition_time"] == 1) ? true : false;

          // populate input boxes with current attributes
          $("#light-effect-name").val(name);
          $("#hue").val(hue);
          $("#brightness").val(brightness);
          $("#saturation").val(saturation);
          $("#transition-time").val(transition_time);
          $("#power-on").prop('checked', true);

          // change to edit mode
          changebutton();

          // change lights to selected effect
          var settings = '{"hue":' + hue + ',"bri":' + brightness + ',"sat":' + saturation +',"transitiontime":' + transition_time + ',"on":true}'
          $.ajax({
            method:"PUT",
            url:"http://" + url + "/api/newdeveloper/groups/0/action",
            data: settings
          })
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown.toString());
      });
};

function destroy_light_effect(light_effect_id) {
    // remove from light effect list
    var light_effect_name = $('#user-light-effects').find(":selected").text();
    var index = light_effect_list.indexOf(light_effect_name);
    light_effect_list.splice(index, 1);
    changebutton();

    // remove from light effect from page and database
    $('#user-light-effects').find(":selected").remove();
    $.ajax({
      method:"DELETE",
      url: "/light_effects/" + light_effect_id
    })
};

// function to change color of the lights
function changecolor()
{
    // validate input and set default values
    hue = $('#hue').val();
    if (isNaN(hue) || hue == "" || hue < 0 || hue > 65535)
        hue = 34495;

    bri = $('#brightness').val();
    if (isNaN(bri) || bri == "" || bri < 1 || bri > 254)
        bri = 254;

    sat = $('#saturation').val();
    if (isNaN(sat) || sat == "" || sat < 0 || sat > 254)
        sat = 254;

    transtime = $('#transition_time').val();
    if (isNaN(transtime) || transtime == "" || transtime < 0 || transtime > 100)
        transtime = 4;

    // change colors of bulbs via AJAX call
    $.ajax({
        method:"PUT",
        url:"http://" + url + "/api/newdeveloper/groups/0/action",
        data:'{"hue":' + hue + ', "bri":' + bri + ', "sat":' + sat
             +', "transitiontime":' + transtime + '}',
    })
};

// turns on lights if checkbox is checked
function toggle_power(){

    // get status of checkbox
    var on = $('#power-on').is(':checked');

    // turn on light if checked
    if(on) {
        $.ajax({
            method:"PUT",
            url:"http://" + url + "/api/newdeveloper/groups/0/action",
            data:'{"on":true}',
        })
    }
    // turn off light if unchecked
    else {
        $.ajax({
            method:"PUT",
            url:"http://" + url + "/api/newdeveloper/groups/0/action",
            data:'{"on":false}',
        })
    }
};
