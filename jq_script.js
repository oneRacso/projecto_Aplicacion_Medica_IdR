$(document).ready(function () {

    let database = loadDB();
    console.log(database.ref().child('users'));
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
        // database.ref('users/'+id.val()+'/').set({
        //     list: $("select").val(),
        // });

        $("body").on("click", ".addValue", function () {
            console.log($(this).parent().text());
            let updates = {};
            updates['/users/'+id.val()+'/'+$(this).parent().text()+'/'] = 7;
            database.ref().update(updates);            
        })

        let updates = {};
        updates['/users/'+id.val()+'/'+$("select").val()+'/'] = [];
        database.ref().update(updates);
        $("#states").append("<div class=''>"+
            "<h2>"+$("select").val()+"<input type='button' value='+' class='addValue'></h2>"+
        "</div>");
        // console.log($("select").val());
        // $(".addValue").click(function () {
        //     console.log("LOLI");
        // })
    });

});

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
            console.log("BIENVENIDO");
            $("#login").hide();
            $("#states").show();
        }
        else {
            console.log("ERROR");
            id.val("");
        };
    })
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