$(document).ready(function() {
    // Altera Background Image
    var num = Math.floor(Math.random() * 55) + 1;
    var str = "url('../img/pattern (" + num + ").png')";
    $("body").css("background-image", str);

    // Algoritmo para campo GLICEMIA
    $("#btnGli_m10").click(function() {
        var val = parseInt($("#inGlicemia").val()) - 10;
        if (val > 0) {
            $("#inGlicemia").val(val);
        }
    });
    $("#btnGli_m1").click(function() {
        var val = parseInt($("#inGlicemia").val()) - 1;
        if (val > 0) {
            $("#inGlicemia").val(val);
        }
    });
    $("#btnGli_p10").click(function() {
        var val = parseInt($("#inGlicemia").val()) + 10;
        $("#inGlicemia").val(val);
    });
    $("#btnGli_p1").click(function() {
        var val = parseInt($("#inGlicemia").val()) + 1;
        $("#inGlicemia").val(val);
    });

    // Algoritmo para campo PORCOES
    $("#btnPor_m10").click(function() {
        var val = parseFloat($("#inPorcoes").val()) - 1;
        if (val > 0) {
            $("#inPorcoes").val(val);
        }
    });
    $("#btnPor_m05").click(function() {
        var val = parseFloat($("#inPorcoes").val()) - 0.5;
        if (val > 0) {
            $("#inPorcoes").val(val);
        }
    });
    $("#btnPor_p05").click(function() {
        var val = parseFloat($("#inPorcoes").val()) + 0.5;
        $("#inPorcoes").val(val);
    });
    $("#btnPor_p10").click(function() {
        var val = parseFloat($("#inPorcoes").val()) + 1;
        $("#inPorcoes").val(val);
    });

    // Algoritmo para botao LIMPAR 
    $("#btnLimpar").click(function(evt) {
        evt.preventDefault();
        $("#inGlicemia").val('150');
        $("#inPorcoes").val('0.0');
        $('#cbCeia').prop('checked', false);
        $('#cbManha').prop('checked', false);
    });

    // Algoritmo para botao CALCULAR 
    $("#btnCalcular").click(function(evt) {
        evt.preventDefault();

        var gli = parseInt($("#inGlicemia").val());
        var por = parseFloat($("#inPorcoes").val());
        var bCeia = $('#cbCeia').prop('checked');
        var bManha = $('#cbManha').prop('checked');
        var coef = 100;

        if (bCeia) {
            coef = 140;
        }

        if (bManha) {
            por = por * 1.5;
        }
        var doses = (gli - coef) / 65 + por;
        doses = doses.toFixed(2);

        $('#exampleModal').modal('toggle');
        $("#modalText").html(doses);
    });
});


// var hash = window.btoa('{"nome":"Catarina", "vDivisor":65, "vSubtractAll":100, "vSubtractCeia":140, "vPorcao":1.0, "vPorcaoManha":1.5}');
// var res = window.atob(hash);

// var str = JSON.parse(res);
// // debugger;