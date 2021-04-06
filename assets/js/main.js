$(document).ready(function () {
  $(".if").click(function () {
    alert("would you like to get to know  more ?");
    var redirectWindow = window.open(
      "https://www.facebook.com/v0ras",
      "_blank"
    );
    redirectWindow.location;
  });
  $("#needHelp").click(function () {
    var needHelp = $("#needHelp").is(":checked");

    if (needHelp === true) {
      $("#helpWindow").draggable().show();
    } else {
      $("#helpWindow").hide();
    }
  });

  var figuruMasyvas = [];

  $(`if`).draggable();
  $(`#parametrai`).draggable();
  $("#tvirtinti").click(function addElement() {
    var ilgis = $("#ilgis").val();
    var aukstis = $("#aukstis").val();
    var plotas = ilgis * aukstis;
    var remelis = $("#remelis").val();
    var border_color = $("#border_color").val();
    var border_radius = $("#border_radius").val();
    var spalva = $("#spalva").val();
    var figura = $("<div class='figura'></div>").draggable();
    var tekstas = $("<p class='tekstas'></p>").draggable();
    var zodziai = $("textarea").val();
    var fontSize = $("#fontSize").val();
    var textColor = $("#textColor").val();

    if (zodziai != "" && plotas == 0) {
      $("#atvaizdavimas").append(tekstas);
      $(tekstas)
        .append(zodziai)
        .css({
          color: textColor,
          "font-size": fontSize + "px",
        });
    }
    if (zodziai == "" && plotas > 0) {
      $("#atvaizdavimas").append(figura);
      $(figura).css({
        width: ilgis,
        height: aukstis,
        border: "solid " + remelis + "px",
        "border-color": border_color,
        "border-radius": border_radius + "%",
        "background-color": spalva,
      });
    }
    if (zodziai != "" && plotas > 0) {
      $("#atvaizdavimas").append(figura);
      $(figura).append(zodziai);

      $(figura).css({
        width: ilgis,
        height: aukstis,
        border: "solid " + remelis + "px",
        "border-color": border_color,
        "border-radius": border_radius + "%",
        "background-color": spalva,
        color: textColor,
        "font-size": fontSize + "px",
      });
    }
    if (zodziai == "" && plotas == 0) {
      alert(
        "To create a shape, enter the length and width.To create letters fill the text window and select font size."
      );
      alert("Need more help? place a check mark next to 'need help ?'");
      return false;
    }

    var Figura = [
      ilgis,
      aukstis,
      plotas,
      remelis,
      border_color,
      border_radius,
      spalva,
      zodziai,
      fontSize,
      textColor,
    ];
    figuruMasyvas.push(Figura);
    var figuruKiekis = figuruMasyvas.length;
    $("#elementCreated").html(`${figuruKiekis}`);
   
    var rotation= 0 ;
    $(figura).dblclick(function () {
      $(figura).removeClass("reverseFigura,hoverFigura");
      jQuery.fn.rotate = function (degrees) {
        $(this).css({
          "-webkit-transform": "rotate(" + degrees + "deg)",
          "-moz-transform": "rotate(" + degrees + "deg)",
          "-ms-transform": "rotate(" + degrees + "deg)",
          transform: "rotate(" + degrees + "deg)",
        });
        return $(this);
      };

      $(figura).on("wheel", function (event) {
        if (event.originalEvent.deltaY < 0) {
          rotation += 1;
          $(this).rotate(rotation);
        } else {
          rotation -= 1;
          $(this).rotate(rotation);
        }
      });
    });
    $(tekstas).dblclick(function () {
      $(tekstas).removeClass("reverseFigura,hoverFigura");
      jQuery.fn.rotate = function (degrees) {
        $(this).css({
          "-webkit-transform": "rotate(" + degrees + "deg)",
          "-moz-transform": "rotate(" + degrees + "deg)",
          "-ms-transform": "rotate(" + degrees + "deg)",
          transform: "rotate(" + degrees + "deg)",
        });
        return $(this);
      };

      $(tekstas).on("wheel", function (event) {
        if (event.originalEvent.deltaY < 0) {
          rotation += 1;
          $(this).rotate(rotation);
        } else {
          rotation -= 1;
          $(this).rotate(rotation);
        }
      });
    });
    $(figura).on("click", function animacija() {
      $(figura)
        .mouseover(function () {
          $(figura).removeClass("reverseFigura").addClass("hoverFigura");
        })
        .mouseout(function () {
          $(figura).removeClass("hoverFigura").addClass("reverseFigura");
        });
    });

    $(tekstas).on("click", function () {
      $(tekstas)
        .mouseover(function () {
          $(tekstas).removeClass("reverseFigura").addClass("hoverFigura");
        })
        .mouseout(function () {
          $(tekstas).removeClass("hoverFigura").addClass("reverseFigura");
        });
    });

    $("#remove").droppable({
      activeClass: "ui-state-hover",
      accept: ".figura , .tekstas", 
      tolerance: "touch",

      drop: function (event, ui) {
        ui.helper.css({ opacity: 0.5 });
        if (!ui.draggable.hasClass("dropped"))
          setTimeout(function () {
            $(ui.helper).remove();
          }, 4700);
      },
    });
    

    $("#containerBg")
      .mouseover(function () {
        $("#containerBg").removeClass("reverse").addClass("hover");
      })
      .mouseout(function () {
        $("#containerBg").removeClass("hover").addClass("reverse");
      });
  });
  $("#containerBg").click(function () {
    var containerColor = $("#containerColor").val();
    $(container).css({
      "background-color": containerColor,
    });
  });
});
