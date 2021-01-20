var _oConfigData;
var _oModal;

function initializeConfigurationData() {
    $.getJSON("/testData.json", function (oData) {
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

function initializeFormFields() {
    if (_oConfigData) {
        $("#zrq-nome").html("Olá " + _oConfigData.name);
        $("#zrq-form-name").val(_oConfigData.name);
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
    var str = "<input type='text' class='form-control'";
    str += " id='" + `zrq-form-config-${sIndex}-insulina` + "'";
    str += " value='" + iValue + "' />";
    return str;
}

function getInputFieldFsi(sIndex, iValue) {
    var str = "<input type='text' class='form-control'";
    str += " id='" + `zrq-form-config-${sIndex}-fsi` + "'";
    str += " value='" + iValue + "' />";
    return str;
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
