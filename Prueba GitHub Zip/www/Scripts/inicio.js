var myOptions;
var map;
var geoXml;

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
    //geoXml.parse("armarMapa.aspx?rnd=" + ahora.getTime() + "&IdRegion=99&IdPrograma=64");
    geoXml.parse("http://riancarga.inta.gob.ar/WsEAR/ArmarKML.aspx?rnd=" + ahora.getTime() + "&IdProvincia=22&IdCampania=6&IdCultivo=6");

    //**************************************************************************************************************************************************************
    //Prueba LocalStorage
    if (localStorage.getItem("ValorPrueba") === null) {
        $("#txtValorStorage").text("-Sin valor-")
    }else{
        $("#txtValorStorage").text(localStorage.ValorPrueba)
    }

    $("#cmdGuardar").click(function(){
        localStorage.setItem('ValorPrueba', $("#IngresoValorStorage").val())
        $("#txtValorStorage").text(localStorage.ValorPrueba)
    });

    $("#cmdBorrar").click(function(){
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
        //////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////
        //Notificaciones (Servicio OneSignal)
        var notificationOpenedCallback = function(jsonData) {
            //console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            alert("Llegó una notificación!")
        };

        window.plugins.OneSignal
            .startInit("c932de39-2b5b-4eb2-be1f-3e09b8ca5574", "173202508128")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
        });

        window.plugins.OneSignal.setSubscription(true);
        window.plugins.OneSignal.enableNotificationWhenActive(true);
        //////////////////////////////////////////////////////////////////////////////////////////
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