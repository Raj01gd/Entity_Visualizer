function validate() {
    var sName = $("#sName").val();
    var dName = $("#dName").val();
    var isSecure = $("#isIntSec").val();
    var userId = $("#userId").val();
    var pwd = $("#pwd").val();
    if (isSecure != '') {
        if (isSecure == "true") {
            if (sName != null && sName != '' && dName != null && dName != '') {
                return true;
            }
            else {

                alert("Invalid Input");
                return false;
            }
        }
        if (isSecure == "false") {
            if (sName != null && sName != '' && dName != null && dName != '') {
                if (userId != null && userId != '' && pwd != null && pwd != '') {
                    return true;
                }
            }
            else {

                alert("Invalid Input");
                return false;
            }
        }
    }
    else {
        alert("Invalid Input");
        return false;
    }
    
}

$(document).ready(function () {
    $("#isIntSec").change(function () {
        var isSec = $("#isIntSec").val();
        if (isSec == "false") {
            $(".credentials").removeClass("hidden");
        }
        else {
            $(".credentials").addClass("hidden");
        }
    })
})