
// var zrq = firebase.database().ref('ricardo')
// var database = firebase.database();

// database.ref('/').once('value', function (snapshot) {
//     debugger;
//     console.log(snapshot.val());
// });

// zrq.once('value').then((snapshot) => {
//     debugger;
//     var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';

// });

// debugger;

function initializeConfigurationData() {
    _oConfigData = {
        name: "Catarina Quintas",
        email: "quintascatarina1805@gmail.com",
        lastModifiedDate: new Date("1-15-2000 14:35:20"),
        estados: {
            doenca: 1.0,
            jejum: 1.0,
            menstruacao: 1.0,
            exercicio: 1.0
        },
        config: {
            "0": { insulinaPorcao: 0.5, fsiCorreccao: 60 },
            "1": { insulinaPorcao: 0.5, fsiCorreccao: 60 },
            "2": { insulinaPorcao: 0.5, fsiCorreccao: 60 },
            "3": { insulinaPorcao: 0.5, fsiCorreccao: 60 },
            "4": { insulinaPorcao: 0.5, fsiCorreccao: 60 },
            "5": { insulinaPorcao: 0.5, fsiCorreccao: 60 },
            "6": { insulinaPorcao: 0.5, fsiCorreccao: 60 },
            "7": { insulinaPorcao: 1.8, fsiCorreccao: 40 },
            "8": { insulinaPorcao: 1.8, fsiCorreccao: 40 },
            "9": { insulinaPorcao: 1.8, fsiCorreccao: 40 },
            "10": { insulinaPorcao: 1.8, fsiCorreccao: 40 },
            "11": { insulinaPorcao: 1.8, fsiCorreccao: 40 },
            "12": { insulinaPorcao: 0.8, fsiCorreccao: 50 },
            "13": { insulinaPorcao: 0.8, fsiCorreccao: 50 },
            "14": { insulinaPorcao: 0.8, fsiCorreccao: 50 },
            "15": { insulinaPorcao: 0.8, fsiCorreccao: 50 },
            "16": { insulinaPorcao: 1.0, fsiCorreccao: 50 },
            "17": { insulinaPorcao: 1.0, fsiCorreccao: 50 },
            "18": { insulinaPorcao: 1.0, fsiCorreccao: 50 },
            "19": { insulinaPorcao: 1.5, fsiCorreccao: 50 },
            "20": { insulinaPorcao: 1.5, fsiCorreccao: 50 },
            "21": { insulinaPorcao: 1.5, fsiCorreccao: 50 },
            "22": { insulinaPorcao: 0.5, fsiCorreccao: 50 },
            "23": { insulinaPorcao: 0.5, fsiCorreccao: 50 }
        }
    }

    if (!_oConfigData) {
        throw "Não foi possível obter os dados de configuração";
    }
}

function changeBackground() {
    var num = Math.floor(Math.random() * 55) + 1;
    var str = "url('../img/pattern (" + num + ").png')";
    $("body").css("background-image", str);
}

function initializeButtonEvents() {

    $("#btnGli_m10").click(function () {
        var val = parseFloat($("#inGlicemia").val())
        val = isNaN(val) ? 0 : val;
        val -= 10;
        if (val <= 0) {
            $("#inGlicemia").val(null);
        }
        else {
            $("#inGlicemia").val(val);
        }
    });

    $("#btnGli_m1").click(function () {
        var val = parseFloat($("#inGlicemia").val())
        val = isNaN(val) ? 0 : val;
        val -= 1;
        if (val <= 0) {
            $("#inGlicemia").val(null);
        }
        else {
            $("#inGlicemia").val(val);
        }
    });

    $("#btnGli_p10").click(function () {
        var val = parseFloat($("#inGlicemia").val())
        val = isNaN(val) ? 0 : val;
        val += 10;
        $("#inGlicemia").val(val);
    });

    $("#btnGli_p1").click(function () {
        var val = parseFloat($("#inGlicemia").val())
        val = isNaN(val) ? 0 : val;
        val += 1;
        $("#inGlicemia").val(val);
    });

    $("#btnPor_m10").click(function () {
        var val = parseFloat($("#inPorcoes").val())
        val = isNaN(val) ? 0 : val;
        val -= 1;
        if (val <= 0) {
            $("#inPorcoes").val(null);
        }
        else {
            $("#inPorcoes").val(val);
        }
    });

    $("#btnPor_m05").click(function () {
        var val = parseFloat($("#inPorcoes").val())
        val = isNaN(val) ? 0 : val;
        val -= 0.5;
        if (val <= 0) {
            $("#inPorcoes").val(null);
        }
        else {
            $("#inPorcoes").val(val);
        }
    });

    $("#btnPor_p05").click(function () {
        var val = parseFloat($("#inPorcoes").val())
        val = isNaN(val) ? 0 : val;
        val += 0.5;
        $("#inPorcoes").val(val);
    });

    $("#btnPor_p10").click(function () {
        var val = parseFloat($("#inPorcoes").val())
        val = isNaN(val) ? 0 : val;
        val += 1;
        $("#inPorcoes").val(val);
    });

    $("#btnLimpar").click(function (evt) {
        evt.preventDefault();
        $("#inGlicemia").val(null);
        $("#inPorcoes").val(null);
        // $('#cbCeia').prop('checked', false);
        // $('#cbManha').prop('checked', false);
    });

    // Algoritmo para botao CALCULAR 
    $("#btnCalcular").click(function (evt) {
        try {
            evt.preventDefault();
            $('#exampleModal').modal('toggle');

            var iGlicemia = parseInt($("#inGlicemia").val());
            var iPorcoesHC = parseFloat($("#inPorcoes").val());

            $("#modalText").html(calculaDosesInsulina(iGlicemia, iPorcoesHC));
        } catch (sError) {
            showError("Não foi possivel efectuar o calculo.", sError);
        }
    });
}

function showError(sMsg, sError) {
    var str = sMsg + "<div class='zrq-error-msg'>========<br>" + sError + "</div>";
    $("#modalText").html(str);
}

function calculaDosesInsulina(iGlicemia, iPorcoesHC) {
    if (!iGlicemia) {
        throw "Não é possível efectuar cáclulo sem valor da GLICEMIA";
    }

    if (!iPorcoesHC) {
        throw "Não é possível efectuar cáclulo sem valor das PORÇÕES";
    }

    var now = new Date();
    var iInsulina = getInsulina(now);
    var iFSI = getFSI(now);
    var iDoses = ((iGlicemia - 100) / iFSI) + (iPorcoesHC * iInsulina);
    iDoses = iDoses.toFixed(2);
    return iDoses;
}

function getInsulina(now) {
    if (!now) {
        throw "getInsulina não funciona sem data definida";
    }

    var currentHour = now.getHours();
    var currentRecord = _oConfigData.config[currentHour];

    if (currentRecord && currentRecord.insulinaPorcao) {
        return currentRecord.insulinaPorcao;
    } else {
        throw "Não foi possível obter insulinaPorcao configurada para a hora: " + currentHour;
    }
}

function getFSI(now) {
    if (!now) {
        throw "getFSI não funciona sem data definida";
    }

    var currentHour = now.getHours();
    var currentRecord = _oConfigData.config[currentHour];

    if (currentRecord && currentRecord.fsiCorreccao) {
        return currentRecord.fsiCorreccao;
    } else {
        throw "Não foi possível obter fsiCorreccao configurada para a hora: " + currentHour;
    }
}

function initializeFormFields() {
    debugger;
    if (!_oConfigData) {
        throw "Não existem dados de configuração. Não é possível correr a função initializeFormFields";
    }
}

var _oConfigData;

$(document).ready(function () {
    try {
        initializeConfigurationData();
        changeBackground();
        initializeFormFields();
        initializeButtonEvents();
    } catch (error) {
        showError("Não foi possível arrancar com a app.", error);
    }
});
