var myOptions;
var map;
var geoXml;

var myDB;

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

    //**************************************************************************************************************************************************************
    //Prueba File-Transfer

    $("#cmdBajarLogo").click(function(){
        alert("Bajando mapita (aunque seguro da error [o no])!!!")

        var fileTransfer = new FileTransfer();

        var ahora = new Date();

        var uri = encodeURI("http://riancarga.inta.gob.ar/WsEAR/ArmarKML.aspx?rnd=" + ahora.getTime() + "&IdProvincia=42&IdCampania=6&IdCultivo=6");
        var fileURL =  "///storage/emulated/0/DCIM/RIAN/ISSA/unMapita.kml";

        fileTransfer.download(
            uri, fileURL, function(entry) {
                alert("Bajo!: " + entry.toURL());
            },
            
            function(error) {
                alert("download error source " + error.source);
                alert("download error target " + error.target);
                alert("download error code" + error.code);
            },
            
            false, {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );
    });    

    //**************************************************************************************************************************************************************
    //Cambio un mapa por el otro descargado
    $("#cmdCambiarMapa").click(function(){
        alert("Limpio el mapa")
        //------------------------------------------------------------------
        //Primero limpio el mapa
        if (geoXml.docs.length > 1) {
            for (var k = 0; k < geoXml.docs.length - 1; k++) {
                geoXml.docs.shift();
            }
        }

        if (geoXml.docs[0].gpolygons[0]) {
            geoXml.docs[0].gpolygons[0].infoWindow.close();
        }
        for (var i = geoXml.docs[0].gpolygons.length; i > 0; i--) {
            geoXml.docs[0].gpolygons[i - 1].setMap(null);
            geoXml.docs[0].gpolygons.pop();
        }
        for (var k = geoXml.docs[0].gpolylines.length; k > 0; k--) {
            geoXml.docs[0].gpolylines[k - 1].setMap(null);
            geoXml.docs[0].gpolylines.pop();
        }

        //------------------------------------------------------------------
        //Cargo el nuevo mapa
        alert("Cargo el nuevo mapa! :B :B :B")
        geoXml.parse("///storage/emulated/0/DCIM/RIAN/ISSA/unMapita.kml");
    });

    //**************************************************************************************************************************************************************
    //Test SQLite
    alert("A ver si pudo instalar la versión Cordova-sqlite-evcore-extbuild-free??")
    /*$("#cmdInsertarDatos").click(function(){
        alert("Insertando registro SQLite :B")
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
            tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
            tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
        }, function(error) {
            alert('Transaction ERROR: ' + error.message);
        }, function() {
            alert('Populated database OK');
        });
        alert("¿Pasó por acá? (CARGA)")
    });

    $("#cmdMostrarDatos").click(function(){
        alert("Muestro los datos!")
        db.transaction(function(tx) {
            tx.executeSql('SELECT count(*) AS mycount FROM DemoTable', [], function(tx, rs) {
                alert('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
            }, function(tx, error) {
                alert('SELECT error: ' + error.message);
            });
        });
        alert("¿Pasó por acá? (MUESTRO DATOS)")
    });*/

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*$("#createTable").click(function(){
        myDB.transaction(function(transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS phonegap_pro (id integer primary key, title text, desc text)', [],
            function(tx, result) {
                alert("Table created successfully");
            }, 
            function(error) {
                  alert("Error occurred while creating the table.");
            });
        });
    });

    //Insert New Data
    $("#insert").click(function(){
      var title=$("#title").val();
      var desc=$("#desc").val();
      console.log(title +""+ desc);
      myDB.transaction(function(transaction) {
            var executeQuery = "INSERT INTO phonegap_pro (title, desc) VALUES (?,?)";             
            transaction.executeSql(executeQuery, [title,desc]
                , function(tx, result) {
                     alert('Inserted');
                },
                function(error){
                     alert('Error occurred'); 
                });
        });
    });

    //Display Table Data
    $("#showTable").click(function(){
      $("#TableData").html("");
      myDB.transaction(function(transaction) {
      transaction.executeSql('SELECT * FROM phonegap_pro', [], function (tx, results) {
           var len = results.rows.length, i;
           $("#rowCount").html(len);
           for (i = 0; i < len; i++){
              $("#TableData").append("<tr><td>"+results.rows.item(i).id+"</td><td>"+results.rows.item(i).title+"</td><td>"+results.rows.item(i).desc+"</td><td><a href='edit.html?id="+results.rows.item(i).id+"&title="+results.rows.item(i).title+"&desc="+results.rows.item(i).desc+"'>Edit</a> &nbsp;&nbsp; <a class='delete' href='#' id='"+results.rows.item(i).id+"'>Delete</a></td></tr>");
           }
        }, null);
      });
    });*/


    document.addEventListener('deviceready', function(event) 
    {
        //**********************************************************************************************************************************************************
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
        
        window.plugins.OneSignal.setSubscription(true);
        window.plugins.OneSignal.enableNotificationWhenActive(true);
        //////////////////////////////////////////////////////////////////////////////////////////         

        //////////////////////////////////////////////////////////////////////////////////////////
        //SQLite
        //db = window.sqlitePlugin.openDatabase({name: 'BdPrueba.db', location: 'default'});
        myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});

        ////////////////////////////////////////////////////////////////////////////////////////// 
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