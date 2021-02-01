var _oConfigData;
var _aTabelaAlimentos;
var _oModal;
const MODAL_TYPE_ERROR = 1;
const MODAL_TYPE_INFO = 2;
const MODAL_TYPE_FOOD_DETAILS = 3;

const ALIMENTO = {
    CODIGO: "Cod",
    NOME_ALIMENTO: "Nome do alimento",
    HIDRATOS: "Hidratos de carbono -[g]"
}

function loadConfigurationData() {
    $.getJSON("dados/catarina.json", function (oData) {
        if (oData) {
            _oConfigData = oData;
            initializeLocalization(_oConfigData.selectedLanguage);
            loadTabelaAlimentos();
        } else {
            throw "Não foi possível obter os dados de configuração";
        }
    }).fail(function () {
        throw "Não foi possível obter os dados de configuração";
    });
}

function loadTabelaAlimentos() {
    $.getJSON("dados/tabelaAlimentos.min.json", function (oData) {
        if (oData) {
            _aTabelaAlimentos = oData;

            _aTabelaAlimentos = _aTabelaAlimentos.sort(function (a, b) {
                if (a[ALIMENTO.NOME_ALIMENTO] < b[ALIMENTO.NOME_ALIMENTO]) {
                    return -1;
                }
                if (a[ALIMENTO.NOME_ALIMENTO] > b[ALIMENTO.NOME_ALIMENTO]) {
                    return 1;
                }
                return 0;
            });

            $.LoadingOverlay("hide");

        } else {
            throw "Não foi possível obter os dados da tabelaAlimentos";
        }
    }).fail(function () {
        throw "Não foi possível obter os dados da tabelaAlimentos";
    });
}

function refreshTableDOM(aSelectedItems) {
    $("#zrq-table-body tr").remove();

    var sHtml = "";

    if (!aSelectedItems) {
        aSelectedItems = _aTabelaAlimentos;
    }

    for (let index = 0; index < aSelectedItems.length; index++) {
        const oElement = aSelectedItems[index];
        sHtml += "<tr>";
        // sHtml += "<th scope='row'>" + oElement[ALIMENTO.CODIGO] + "</th>";
        sHtml += "<td>" + oElement[ALIMENTO.NOME_ALIMENTO] + "</td>";
        sHtml += "<td>" + oElement[ALIMENTO.HIDRATOS] + "</td>";
        sHtml += "<td onclick='onClickDetails(" + oElement[ALIMENTO.CODIGO] + ")'><svg class='zrq-icon-details' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-info-circle-fill' viewBox='0 0 16 16'><path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'/></svg></td>";
        sHtml += "</tr>";
    }

    $("#zrq-table-body").html(sHtml);
}

function initializeFormFields() {
    if (_oConfigData) {
        $("#zrq-nome").html(" " + _oConfigData.name + "!");
        $("#zrq-form-pesquisar").attr("placeholder", $.localize.data.i18n["tabela-search-ph"]);
        // $("#zrq-form-pesquisar").attr("placeholder", $.localize.data.i18n["config-name-placeholder"]);
        // $("#zrq-form-pesquisar").val(_oConfigData.name);


    }
    else {
        throw "Não existem dados de configuração. Não é possível correr a função initializeFormFields";
    }
}

function onClickDetails(sIdAlimento) {
    var oElement = _aTabelaAlimentos.find(x => x[ALIMENTO.CODIGO] === sIdAlimento);
    if (oElement) {
        showModal(null, oElement, MODAL_TYPE_FOOD_DETAILS);
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
            $("#modalTitle").html(sTitle);
            $("#modalText").html(sBody);
            break;
        case MODAL_TYPE_FOOD_DETAILS:
            if (oDados) {
                $("#modalCSS").addClass(["bg-primary", "text-white"]);
                var aKeys = getSortedObjectkeys(oDados);
                var sCod = "";
                var sNivel1 = "";
                var sNivel2 = "";
                var sNivel3 = "";

                for (let i = 0; i < aKeys.length; i++) {
                    switch (aKeys[i]) {
                        case "Cod":
                            sCod += "<p><strong>" + $.localize.data.i18n["tabela-tbl-id"] + ": </strong>" + oDados[aKeys[i]] + "</p>";
                            break;
                        case "Nome do alimento":
                            sTitle += oDados[aKeys[i]];
                            break;
                        case "Nível 1":
                            sNivel1 += "<p><strong>" + aKeys[i] + ": </strong>" + oDados[aKeys[i]] + "</p>";
                            break;
                        case "Nível 2":
                            sNivel2 += "<p><strong>" + aKeys[i] + ": </strong>" + oDados[aKeys[i]] + "</p>";
                            break;
                        case "Nivel 3":
                            sNivel3 += "<p><strong>" + aKeys[i] + ": </strong>" + oDados[aKeys[i]] + "</p>";
                            break;
                        default:
                            sBody += "<p><strong>" + aKeys[i] + ": </strong>" + oDados[aKeys[i]] + "</p>";
                            break;
                    }
                }
            } else {
                throw $.localize.data.i18n["msg-error-smodal-calc"];
            }
            $("#modalTitle").html(sTitle);
            $("#modalText").html(sCod + sNivel1 + sNivel2 + sNivel3 + "<hr/>" + sBody);
            break;
    }

    _oModal.show()
}

function getSortedObjectkeys(obj) {
    var aKeys = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            aKeys.push(key);
        }
    }
    return aKeys.sort();
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
            language: "en",
            callback: function (data, defaultCallback) {
                defaultCallback(data);
                initializeFormFields();
            }
        });
    }
}

function onBtnClear(sValue) {
    $("#zrq-form-pesquisar").val("");
    $("#zrq-table-body tr").remove();
}

function filterTable(sValue) {
    var rePattern = new RegExp(sValue, "i");
    var arr = $(_aTabelaAlimentos)
        .filter(function (i, n) {
            return n[ALIMENTO.NOME_ALIMENTO].search(rePattern) !== -1;
        });

    refreshTableDOM(arr);

}

$('#zrq-form-pesquisar').on('keyup', function (oEvent) {
    var sValue = $(this).val();
    if (oEvent.keyCode === 27) {
        $("#zrq-form-pesquisar").val("");
        $("#zrq-table-body tr").remove();
    } else {
        if (sValue.length >= 2) {
            filterTable(sValue);
        }
    }
});

function initializeModal() {
    _oModal = new bootstrap.Modal(document.getElementById('myModal'))
}

$(document).ready(function () {
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    try {
        $.LoadingOverlay("show");
        initializeModal();
        // initializeButtonEvents();
        loadConfigurationData();
    } catch (error) {
        showModal("Não foi posível arrancar com a app.", error, true);
    }
});
