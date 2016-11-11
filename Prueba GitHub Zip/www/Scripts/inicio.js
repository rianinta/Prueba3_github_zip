$(function(){
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

    //*****************************************************************************************************
    //Prueba armar mapa
    var myOptions;
    var map;
    var geoXml;

    myOptions = {
        center: new google.maps.LatLng(-40, -64),
        streetViewControl: false,
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), myOptions);

    geoXml = new geoXML3.parser({
        map: map,
        singleInfoWindow: true,
        zoom: false,
        afterParse: useTheData
    });

    var ahora = new Date();
    geoXml.parse("http://riancarga.inta.gob.ar/WsEAR/ArmarKML.aspx?rnd=" + ahora.getTime() + "&IdProvincia=22&IdCampania=6&IdCultivo=6");

    //**************************************************************************************************************************************************************
    //Prueba LocalStorage
    /*if(localStorage.ValorPrueba == undefined){
        $("#txtValorStorage").text("-Sin valor-")
    } else {
        $("#txtValorStorage").text(localStorage.ValorPrueba)
    }*/
    if (localStorage.getItem("ValorPrueba") === null) {
        $("#txtValorStorage").text("-Sin valor-")
    }else{
        $("#txtValorStorage").text(localStorage.ValorPrueba)
    }

    $("#cmdGuardar").click(function(){
        /*localStorage.ValorPrueba = $("#IngresoValorStorage").val()
        alert("@" + localStorage.ValorPrueba + "@")*/
        localStorage.setItem('ValorPrueba', $("#IngresoValorStorage").val())
        $("#txtValorStorage").text(localStorage.ValorPrueba)
    });



    $("#cmdBorrar").click(function(){
        //localStorage.ValorPrueba = undefined
        localStorage.removeItem('ValorPrueba')
        $("#txtValorStorage").text("-Sin valor-")
    });

    document.addEventListener('deviceready', function(event) 
    {
        //************************************************************************************************************************************************************
        //PLUGINS

        //////////////////////////////////////////////////////////////////////////////////////////
        //Fullscreen (sirve para cuadros de texto, para que no baje la barrita de arriba)
        function successFullscreen()
        {
            console.log("It worked!");
        }

        function errorFullscreen(error)
        {
            console.log(error);
        }

        AndroidFullScreen.immersiveMode(successFullscreen, errorFullscreen);
        alert("Fullscreen ok!")
    });
            
});

function CargoCultivosEnCombo(response){
    var datos = jQuery.parseJSON(response.d);
    var MuestroLalala = ''

    $.each(datos, function(index, Valores) {
        MuestroLalala = MuestroLalala + "(" + Valores.IdCultivo + ") " + Valores.Cultivo + "|"
    });

    $("#modificado").text(MuestroLalala)
}

function useTheData(doc) {
    $("#modificado").text($("#modificado").text() + "|KML Cargado")
}