let baseHeight = 200;
let waveDelta = 10;

$(document).ready(function () {
    //http://magicseaweed.com/developer/forecast-api    
    // Key:  e035ec3907acbee73a5eea8ba2f3e2fc
    // Secret: 540640344910004ab01b572179c1c7ae
    //http://magicseaweed.com/api/e035ec3907acbee73a5eea8ba2f3e2fc/forecast/?spot_id=${spotId}
    //Access to two locations.
    //Jenness Beach - 881
    //2nd Beach - 846
    //get height, speed based on magicseaweed data for spot. Add some randomness and variation based on min/max breaking height.
    //timestamps are in unix encoding, convert at https://www.unixtimestamp.com/index.php    



    $('#wave2').drawWaves({
        height: baseHeight,
        waveDelta: waveDelta,
        speed: .15,
        color: '#1F538F'
    });
    $('#wave1').drawWaves({
        height: baseHeight - 5,
        waveDelta: waveDelta,
        speed: .25,
        color: '#407DB3'
    });   

    $(".cross").hide();
    $(".menu").hide();
    $(".hamburger").click(function () {
        $(".menu").slideToggle("slow", function () {
            $(".hamburger").hide();
            $(".cross").show();
        });
    });

    $(".cross").click(function () {
        $(".menu").slideToggle("slow", function () {
            $(".cross").hide();
            $(".hamburger").show();
        });
    });

    $(".spot").click(function () {

        let selected = getSelected();
        if (selected.length) {
            selected.removeAttr("selected")
        }

        let spotId = $(this).data("mswid");
        $(this).attr("selected", true)

        getData(spotId, 0);

        $(".menu").slideToggle("slow", function () {
            $(".cross").hide();
            $(".hamburger").show();
        });
    })

    $("#range-timeslot").change(function () {
        var selected = getSelected();

        getData(selected.data("mswid"), $(this).val())
    })
});

function getData(spotId, index) {
    $.ajax("http://magicseaweed.com/api/e035ec3907acbee73a5eea8ba2f3e2fc/forecast/?spot_id=" + spotId, {
        success: function (data) {
            console.log(data);
            redrawWaves(data, index);
        }
    });
}

function getDateTime(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000);
    return date.toLocaleString();
}

function getSelected() {
    return $('.spot[selected="selected"]');
}

function fillConditionInfo(timeBlock) {
    let name = getSelected().text();

    $("#spot-name").text(name);
    $("#spot-time").text("Time: " + getDateTime(timeBlock.localTimestamp));
    $("#spot-combined-height").text("Combined Height: " + timeBlock.swell.components.combined.height + "ft");
    $("#spot-primary-height").text("Primary Height: " + timeBlock.swell.components.primary.height + "ft");   

    //$("#range-container").show();
}

function redrawWaves(mswData, index) {

    let heightMultiplier = 30;
    let periodMultiplier = .1;
    let timeBlock = mswData[index];

    fillConditionInfo(timeBlock);
     
    $('#wave2').text(`<path id="wave2" d=""></path>`);
    $('#wave2').drawWaves({
        height: baseHeight,
        waveDelta: timeBlock.swell.components.combined.height * heightMultiplier,
        speed: timeBlock.swell.components.combined.period * periodMultiplier,
        color: '#1F538F'
    });

    $('#wave1').text(`<path id="wave1" d=""></path>`);
    $('#wave1').drawWaves({
        height: baseHeight - 5,
        waveDelta: timeBlock.swell.components.primary.height * heightMultiplier,
        speed: timeBlock.swell.components.primary.period * periodMultiplier,
        color: '#407DB3'
    });
}