$(function(){
	alert("Hola! Ya cargué jQuery! :)")

	$("#modificado").text("Este sería un texto que cambió")

	$.ajax({
            type: "POST",
            url: "http://riancarga.inta.gob.ar/WsEAR/TraeEstadisticas.aspx/TraeCultivosPorProvincia",
            data: '{pIdProvincia: "22"}',
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: CargoCultivosEnCombo,
            failure: function(response) {
                alert(response.d);
            }
        });
});

function CargoCultivosEnCombo(response){
    var datos = jQuery.parseJSON(response.d);
    var MuestroLalala = ''

    $.each(datos, function(index, Valores) {
        MuestroLalala = MuestroLalala + "(" + Valores.IdCultivo + ") " + Valores.Cultivo + "|"
    });

    alert(MuestroLalala)
}