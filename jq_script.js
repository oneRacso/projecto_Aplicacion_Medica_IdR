$(document).ready(function () {

    let database = loadDB();
    // console.log(database.ref().child('users'));
    let id = $("#details input[type='text']");
    let formButton = $("#details input[type='button']");

    formButton.on("click", function () {
        logInButton(database, id);
    });

    $(".bar input").on("click", function () {
        $(".bar input").removeClass("selected");
        $(this).addClass("selected");
        formButton.unbind();

        if ($(this).val() === "Registrar") {
            formButton.val("Registrar");
            formButton.on("click", function () {
                registerButton(database, id);
            })
        }
        else {
            formButton.val("Login");
            formButton.on("click", function () {
                logInButton(database, id);
            });

        }
    });

    $("#states input").on("click", function () {
        if ($(this).val() === "Agregar") {
            $("#states div").show();
        }
    });

    $("#states div input[type='button']").on("click", function () {
        createNewApp(id, database);
    });

    $("body").on("click", ".addValue", function () {
        let attribute = $(this).parent();
        // console.log($(this).parent().text());
        // console.log($(this).parent().children("input[type='number']").val());

        database.ref('users/'+id.val()+'/list/'+attribute.text()).once('value').then(function (snap) {

            if (!$("#"+attribute.text()+"Graph").length) {
                console.log("DONE");
                $("#"+attribute.text()).append("<div id='"+attribute.text()+"Graph' style='height:300px'></div>"+"</div>");
            }

            let list = [];
            list = snap.val();
            console.log(list);
            list.push({
                date: new Date().getSeconds()+"",
                value: parseInt(attribute.children("input[type='number']").val()),
            });
            attribute.children("input[type='number']").val("");
            createGraph(attribute.text()+"Graph", list);
            // console.log(attribute.text());
            // console.log(list);
            database.ref('users/'+id.val()+'/list/'+attribute.text()).set(list);
            
        })
           
    });

});

function createNewApp(id, database) {
    // database.ref('users/'+id.val()+'/').set({
    //     list: $("select").val(),
    // });

    database.ref('users/'+id.val()+'/list').once('value').then(function (snap) {
        // console.log(snap.val().hasOwnProperty($("select").val()));
        if (!snap.val() || !snap.val().hasOwnProperty($("select").val())){
            let updates = {};
            updates['/users/'+id.val()+'/list/'+$("select").val()+'/'] = [{
                date: 4+"",
                value: 3,
            }];
            database.ref().update(updates);
            $("#states").append("<div class='' id="+$("select").val()+">"+
                "<h2>"+$("select").val()+"<input type='button' value='+' class='addValue'>"+
                "<input type='number' placeholder='Agregar dato'></h2>"+
            "</div>");
        }
        
    })

}

function loadDB() {
    let config = {
        apiKey: "AIzaSyDxKxWIpOFJk4P212Wct3PoYPBKOJDKyRY",
        authDomain: "inter-a92ca.firebaseapp.com",
        databaseURL: "https://inter-a92ca.firebaseio.com",
        projectId: "inter-a92ca",
        storageBucket: "",
        messagingSenderId: "517546580342"
    };
    firebase.initializeApp(config);
    return firebase.database();
}

function logInButton(database, id) {
    console.log("ATTEMPT");
    database.ref('users/').once('value').then(function (snap) {
        //console.log(snap.val().hasOwnProperty($("#details input[type='text']").val()));
        if (snap.val() && snap.val().hasOwnProperty(id.val())) {
            // console.log(snap.val()[id.val()]);
            $("#login").hide();
            $("#states").show();
            $("#container").css("padding-top","50px");
            retrieveDB(snap.val()[id.val()]);
        }
        else {
            console.log("ERROR");
            id.val("");
        };
    })
}

function retrieveDB (personDB) {
    // console.log(personDB.list);
    if (personDB.list) {
        for (key of Object.keys(personDB.list)) {
            $("#states").append("<div class='' id="+key+">"+
                "<h2>"+key+"<input type='button' value='+' class='addValue'>"+
                "<input type='number' placeholder='Agregar dato'></h2>"+
                "<div id="+key+"Graph"+" style='height:300px'></div>"+
            "</div>");
            // console.log(typeof(key));
            // console.log(personDB.list.hasOwnProperty(key));
            // console.log(personDB.list[key]);
            // createGraph(key, [
            //     {a: ""+5, b: 6},
            //     {a: ""+3, b: 74}
            // ]);
            createGraph(key+"Graph", personDB.list[key]);
        }
    }
}

function createGraph(attribute, values) {
    $("#"+attribute).html("");
    //console.log(values);
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: attribute,
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: values,
        // The name of the data record attribute that contains x-values.
        xkey: 'date',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Value']
      });
}

function registerButton(database, id) {
    console.log("ATTEMPT");
    database.ref('users/').once('value').then(function (snap) {
        console.log(snap.val());
        //console.log(snap.val().hasOwnProperty($("#details input[type='text']").val()));
        if (!snap.val() || !snap.val().hasOwnProperty(id.val())) {
            console.log("LOLO");
            database.ref('users/'+id.val()).set({
                name: id.val(),
            });
        }
        else {
            console.log("Usuario ya registrado");
        };
        id.val("");
    })
}