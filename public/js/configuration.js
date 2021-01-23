var _oConfigData;
var _oModal;

function initializeConfigurationData() {
    $.getJSON("testData.json", function (oData) {
        if (oData) {
            _oConfigData = oData;
            _oConfigData.lastModifiedDate = new Date("1-15-2000 14:35:20");
            initializeLocalization(_oConfigData.selectedLanguage);
        } else {
            throw "Não foi possível obter os dados de configuração";
        }
    }).fail(function () {
        throw "Não foi possível obter os dados de configuração";
    });
}

function initializeFormFields() {
    if (_oConfigData) {
        $("#zrq-nome").html(" " + _oConfigData.name + "!");
        $("#zrq-form-name").attr("placeholder", $.localize.data.i18n["config-name-placeholder"]);
        $("#zrq-form-name").val(_oConfigData.name);
        $('#zrq-language').val(_oConfigData.selectedLanguage);
        $("#zrq-form-email").val(_oConfigData.email);

        var sHtml = "";
        for (var index in _oConfigData.config) {
            var oElement = _oConfigData.config[index];
            sHtml += "<tr>";
            sHtml += "<th scope='row'>" + getIndexContent(index) + "</th>";
            sHtml += "<td>" + getInputFieldInsulina(index, oElement.insulinaPorcao) + "</td>";
            sHtml += "<td>" + getInputFieldFsi(index, oElement.fsiCorreccao) + "</td>";
            sHtml += "</tr>";
        }
        $("#zrq-table-body").html(sHtml);
    }
    else {
        throw "Não existem dados de configuração. Não é possível correr a função initializeFormFields";
    }
}

function getIndexContent(sIndex) {
    var sHourBegin = sIndex;
    var sHourEnd = (parseInt(sIndex) + 1).toString();

    if (sHourBegin.length === 1) {
        sHourBegin = "0" + sHourBegin;
    }

    if (sHourEnd.length === 1) {
        sHourEnd = "0" + sHourEnd;
    }

    return sHourBegin + "h-" + sHourEnd + "h";
}

function getInputFieldInsulina(sIndex, iValue) {
    var str = "<input type='number' class='form-control'";
    str += " id='" + `zrq-form-config-${sIndex}-insulina` + "'";
    str += " name='" + `zrq-form-config-${sIndex}-insulina` + "'";
    str += " value='" + iValue + "' />";
    return str;
}

function getInputFieldFsi(sIndex, iValue) {
    var str = "<input type='number' class='form-control'";
    str += " id='" + `zrq-form-config-${sIndex}-fsi` + "'";
    str += " name='" + `zrq-form-config-${sIndex}-fsi` + "'";
    str += " value='" + iValue + "' />";
    return str;
}
function onBtnSave() {
    var str = $("form#configurationForm").serialize();
}

// function isInt(n) {
//     return Number(n) === n && n % 1 === 0;
// }

// function isFloat(n) {
//     return Number(n) === n && n % 1 !== 0;
// }

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


$(document).ready(function () {
    try {
        // initializeModal();
        // initializeButtonEvents();
        initializeConfigurationData();
    } catch (error) {
        showModal("Não foi posível arrancar com a app.", error, true);
    }
});
