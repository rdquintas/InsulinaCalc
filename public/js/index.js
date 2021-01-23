
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
            initializeLocalization(_oConfigData.selectedLanguage);
        } else {
            throw $.localize.data.i18n["msg-error-config-fails"];
        }
    }).fail(function () {
        throw $.localize.data.i18n["msg-error-config-fails"];
    });
}

function changeBackground() {
    var sNumber = (Math.floor(Math.random() * 100) + 1).toString();
    if (sNumber.length === 1) {
        sNumber = "00" + sNumber;
    }

    if (sNumber.length === 2) {
        sNumber = "0" + sNumber;
    }

    var str = "url('img/patterns/image" + sNumber + ".png')";
    $("body").css("background-image", str);
}

function onAlteraGlicemia(sValue) {
    $("#inGlicemia").val(parseInt(sValue));
}

function onAlteraPorcoes(sValue) {
    $("#inPorcoes").val(parseFloat(sValue));
}

function onBotaoLimpar(oButton) {
    $("#inGlicemia").val(null);
    $("#inPorcoes").val(null);
    $("#rangeGlicemia").val("225");
    $("#rangePorcoes").val("15");
    changeBackground();
}

function onBotaoCalcular(oButton) {
    try {
        var iGlicemia = parseInt($("#inGlicemia").val());
        var iPorcoesHC = parseFloat($("#inPorcoes").val());
        var oDados = calculaDosesInsulina(iGlicemia, iPorcoesHC);
        changeBackground();
        showModal(null, oDados, MODAL_TYPE_RESULTS);
    } catch (sError) {
        showModal($.localize.data.i18n["msg-error-calc-fails"], sError, MODAL_TYPE_ERROR);
    }
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
                throw $.localize.data.i18n["msg-error-smodal"];
            }

            sTitle = $.localize.data.i18n["modal-title-error"];
            if (oDados) {
                sBody = sMsg + "<div class='zrq-error-msg'>========<br>" + JSON.stringify(oDados)
                    + "</div>";
            } else {
                sBody = sMsg;
            }
            $("#modalCSS").addClass(["bg-danger", "text-white", "bg-warning", "text-black"]);
            break;
        case MODAL_TYPE_RESULTS:
            sTitle = $.localize.data.i18n["modal-title-doses"];
            if (oDados) {
                validaDados(oDados);
                if (oDados.calculoDasDosesInsulina <= 0) {
                    $("#modalCSS").addClass(["bg-warning", "text-black"]);
                    sBody += "<p>" + $.localize.data.i18n["modal-title-warning"] + "</p>";
                    sBody += "<h3>" + oDados.calculoDasDosesInsulina + "</h3>";
                } else {
                    $("#modalCSS").addClass(["bg-primary", "text-white"]);
                    sBody += "<h3>" + oDados.calculoDasDosesInsulina + "</h3>";
                }

                sBody += getAccordeonWithDetails(oDados);

            } else {
                throw $.localize.data.i18n["msg-error-smodal-calc"];
            }
            break;
    }

    $("#modalTitle").html(sTitle);
    $("#modalText").html(sBody);
    _oModal.show()
}

function getAccordeonWithDetails(oDados) {
    var sHtml = "";
    sHtml += "<div class='accordion' id='accordionExample'>";
    sHtml += "<div class='accordion-item'>";
    sHtml += "<h2 class='accordion-header' id='headingOne'>";
    sHtml += "<button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>";
    sHtml += $.localize.data.i18n["modal-title-accordion"];
    sHtml += "</button>";
    sHtml += "</h2>";
    sHtml += "<div id='collapseOne' class='accordion-collapse collapse hide' aria-labelledby='headingOne' data-bs-parent='#accordionExample'>";
    sHtml += "<div class='accordion-body'>";
    sHtml += "<br>(A) " + $.localize.data.i18n["modal-calc-glicemia"] + ": " + oDados.glicemiaIntroduzida;
    sHtml += "<br>(B) " + $.localize.data.i18n["modal-calc-portions"] + ": " + oDados.porcoesIntroduzidas;
    sHtml += "<br>(C) " + $.localize.data.i18n["modal-calc-insulina"] + " " + oDados.horaCorrente + "h: " + oDados.registoInsulina;
    sHtml += "<br>(D) " + $.localize.data.i18n["modal-calc-fsi"] + " " + oDados.horaCorrente + "h: " + oDados.registoFSI;
    sHtml += "<br><br>" + $.localize.data.i18n["modal-calc-title"] + ":";
    sHtml += "<br><strong>" + $.localize.data.i18n["modal-calc-doses"] + " = (A-100)/D) + (BxC)</strong>";
    sHtml += "</div>";
    sHtml += "</div>";
    sHtml += "</div>";
    sHtml += "</div>";

    return sHtml;
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
        throw $.localize.data.i18n["msg-error-no-glicemia"];
    }

    if (!iPorcoesHC) {
        throw $.localize.data.i18n["msg-error-no-portions"];
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
        throw $.localize.data.i18n["msg-error-getinsulina"];
    }

    var currentHour = now.getHours();
    var currentRecord = _oConfigData.config[currentHour];

    if (currentRecord && currentRecord.insulinaPorcao) {
        return currentRecord.insulinaPorcao;
    } else {
        throw $.localize.data.i18n["msg-error-getinsulina-config"] + " " + currentHour;
    }
}

function getFSI(now) {
    if (!now) {
        throw $.localize.data.i18n["msg-error-getfsi"];
    }

    var currentHour = now.getHours();
    var currentRecord = _oConfigData.config[currentHour];

    if (currentRecord && currentRecord.fsiCorreccao) {
        return currentRecord.fsiCorreccao;
    } else {
        throw $.localize.data.i18n["msg-error-getfsi-config"] + " " + currentHour;
    }
}

function initializeModal() {
    _oModal = new bootstrap.Modal(document.getElementById('myModal'))
}

function initializeFormFields() {
    if (_oConfigData) {
        $("#zrq-nome").html(" " + _oConfigData.name + "!");
        $("#inGlicemia").attr("placeholder", $.localize.data.i18n["placeholder-glicemia"]);
        $("#inPorcoes").attr("placeholder", $.localize.data.i18n["placeholder-portions"]);
    }
    else {
        throw $.localize.data.i18n["msg-error-app-config"];
    }
}


function initializeLocalization(sLanguage) {
    try {
        if (!sLanguage) {
            sLanguage = (navigator.language || navigator.userLanguage) || "en";
        }

        var aAvailableLangs = ["en", "pt"];
        if ((aAvailableLangs.indexOf(sLanguage) > -1) === false) {
            sLanguage = "en";
        }

        $("[data-localize]").localize("i18n", {
            language: sLanguage,
            callback: function (data, defaultCallback) {
                defaultCallback(data);
                initializeFormFields();
            }
        });

    } catch (error) {
        // just in case some stupid shit happens
        $("[data-localize]").localize("i18n", {
            language: sLanguage,
            callback: function (data, defaultCallback) {
                defaultCallback(data);
                initializeFormFields();
            }
        });
    }
}


$(document).ready(function () {
    try {
        initializeModal();
        changeBackground();
        initializeConfigurationData();
    } catch (error) {
        showModal($.localize.data.i18n["msg-error-app-start"], error, true);
    }
});
