const baseHeight = 200;
const waveDelta = 10;
const dataIndexKey = "dataIndex";
const spotIdKey = "spotId"

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


    let spotId = getParameterByName(spotIdKey);
    let dataIndex = getParameterByName(dataIndexKey);
    if (spotId) {
        if(!dataIndex)
        {
            dataIndex = 0;
        }
        else{
            $("#range-timeslot").val(dataIndex);
        }
        
        let spot = getSpotById(spotId);
        spot.attr("selected", true)

        getData(spotId, dataIndex);
     }
    else {
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
    }

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
        
        let spotId = $(this).data("mswid");
        window.location.href = window.location.href.split('?')[0] + "?" + spotIdKey +"="+ spotId;        

        $(".menu").slideToggle("slow", function () {
            $(".cross").hide();
            $(".hamburger").show();
        });
    })

    $("#range-timeslot").change(function () {
        var selected = getSelected();

        window.location.href = window.location.href.split('?')[0] + "?" + spotIdKey +"="+ spotId + "&" + dataIndexKey + "=" + $(this).val();        
        
    })
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

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

function getSpotById(spotId) {
    return $('.spot[data-mswid="'+ spotId +'"]');
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

    $("#range-container").show();
}

function redrawWaves(mswData, index) {

    let heightMultiplier = 10;
    let periodMultiplier = .1;
    let timeBlock = mswData[index];

    fillConditionInfo(timeBlock);
    
    $('#wave2').drawWaves({
        height: baseHeight,
        waveDelta: timeBlock.swell.components.combined.height * heightMultiplier,
        speed: .15,
        color: '#1F538F'
    });
    
    $('#wave1').drawWaves({
        height: baseHeight - 5,
        waveDelta: timeBlock.swell.components.primary.height * heightMultiplier,
        speed: .25,
        color: '#407DB3'
    });
}