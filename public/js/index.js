
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

var _oConfigData;
var _oModal;
const MODAL_TYPE_ERROR = 1;
const MODAL_TYPE_INFO = 2;
const MODAL_TYPE_RESULTS = 3;

function initializeConfigurationData() {
    $.getJSON("testData.json", function (oData) {
        if (oData) {
            _oConfigData = oData;
            _oConfigData.lastModifiedDate = new Date("1-15-2000 14:35:20");
            initializeFormFields();
        } else {
            throw "Não foi possível obter os dados de configuração";
        }
    }).fail(function () {
        throw "Não foi possível obter os dados de configuração";
    });
}

function changeBackground() {
    var sNumber = (Math.floor(Math.random() * 101) + 1).toString();
    if (sNumber.length === 1) {
        sNumber = "00" + sNumber;
    }

    if (sNumber.length === 2) {
        sNumber = "0" + sNumber;
    }

    debugger;

    var str = "url('../img/patterns/image" + sNumber + ".png')";
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
        changeBackground();
    });

    // Algoritmo para botao CALCULAR 
    $("#btnCalcular").click(function (evt) {
        try {
            evt.preventDefault();
            var iGlicemia = parseInt($("#inGlicemia").val());
            var iPorcoesHC = parseFloat($("#inPorcoes").val());
            var oDados = calculaDosesInsulina(iGlicemia, iPorcoesHC);
            changeBackground();
            showModal(null, oDados, MODAL_TYPE_RESULTS);
        } catch (sError) {
            showModal("Não foi possivel efectuar o calculo", sError, MODAL_TYPE_ERROR);
        }
    });
}



function showModal(sMsg, oDados, sType) {
    var sTitle = "";
    var sBody = "";

    if (!oDados) {
        oDados = "";
    }

    $("#modalCSS").removeClass(["bg-danger", "bg-primary", "bg-warning", "text-white"]);

    switch (sType) {
        case MODAL_TYPE_ERROR:
            if (!sMsg) {
                throw "Houve um erro. showModal não tem sMsg";
            }

            sTitle = "Ocorreu um erro";
            if (oDados) {
                sBody = sMsg + "<div class='zrq-error-msg'>========<br>" + JSON.stringify(oDados)
                    + "</div>";
            } else {
                sBody = sMsg;
            }
            $("#modalCSS").addClass(["bg-danger", "text-white", "bg-warning", "text-black"]);
            break;
        case MODAL_TYPE_RESULTS:
            sTitle = "Doses de insulina a administrar";
            if (oDados) {
                validaDados(oDados);
                if (oDados.calculoDasDosesInsulina <= 0) {
                    $("#modalCSS").addClass(["bg-warning", "text-black"]);
                    sBody += "<p>Atenção: valor calculado da insulina é menor ou igual a zero!!</p>";
                    sBody += "<h3>" + oDados.calculoDasDosesInsulina + "</h3>";
                } else {
                    $("#modalCSS").addClass(["bg-primary", "text-white"]);
                    sBody += "<h3>" + oDados.calculoDasDosesInsulina + "</h3>";
                }
                sBody += "<div class='zrq-error-msg'>========";
                sBody += "<br>VALORES UTILIZADOS PARA O CÁLCULO";
                sBody += "<br>(A) Glicemia introduzida: " + oDados.glicemiaIntroduzida;
                sBody += "<br>(B) Porções introduzidas: " + oDados.porcoesIntroduzidas;
                sBody += "<br>(C) Insulina configurada para as " + oDados.horaCorrente + "h: " + oDados.registoInsulina;
                sBody += "<br>(D) FSI configurado para as " + oDados.horaCorrente + "h: " + oDados.registoFSI;
                sBody += "<br><br>Fórmula utilizada para o cálculo:";
                sBody += "<br>Doses de insulina = (A-100)/D) + (BxC)";
                sBody += "</div>";
            } else {
                throw "Houve um erro no cáclculo. showModal não tem oDados";
            }
            break;
    }

    $("#modalTitle").html(sTitle);
    $("#modalText").html(sBody);
    _oModal.show()
}

function validaDados(oDados) {
    if (!oDados.registoInsulina) {
        throw "Registo oDados.registoInsulina inexistente";
    }

    if (!oDados.registoFSI) {
        throw "Registo oDados.registoFSI inexistente";
    }

    if (!oDados.calculoDasDosesInsulina) {
        throw "Registo oDados.calculoDasDosesInsulina inexistente";
    }

    if (!oDados.horaCorrente) {
        throw "Registo oDados.horaCorrente inexistente";
    }

    if (!oDados.glicemiaIntroduzida) {
        throw "Registo oDados.glicemiaIntroduzida inexistente";
    }

    if (!oDados.porcoesIntroduzidas) {
        throw "Registo oDados.porcoesIntroduzidas inexistente";
    }
}

function calculaDosesInsulina(iGlicemia, iPorcoesHC) {
    var oDados = {};

    if (!iGlicemia) {
        throw "Não é possível efectuar cáclulo sem valor da GLICEMIA";
    }

    if (!iPorcoesHC) {
        throw "Não é possível efectuar cáclulo sem valor das PORÇÕES";
    }

    var now = new Date();

    oDados.registoInsulina = getInsulina(now);
    oDados.registoFSI = getFSI(now);
    oDados.calculoDasDosesInsulina = ((iGlicemia - 100) / oDados.registoFSI) + (iPorcoesHC * oDados.registoInsulina);
    oDados.calculoDasDosesInsulina = oDados.calculoDasDosesInsulina.toFixed(2);
    oDados.horaCorrente = now.getHours();
    oDados.glicemiaIntroduzida = iGlicemia;
    oDados.porcoesIntroduzidas = iPorcoesHC;

    return oDados;
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

function initializeModal() {
    _oModal = new bootstrap.Modal(document.getElementById('myModal'))
}

function initializeFormFields() {
    if (_oConfigData) {
        $("#zrq-nome").html("Olá " + _oConfigData.name);
    }
    else {
        throw "Não existem dados de configuração. Não é possível correr a função initializeFormFields";
    }
}


$(document).ready(function () {
    try {
        initializeModal();
        initializeButtonEvents();
        changeBackground();
        initializeConfigurationData();
    } catch (error) {
        showModal("Não foi posível arrancar com a app.", error, true);
    }
});
