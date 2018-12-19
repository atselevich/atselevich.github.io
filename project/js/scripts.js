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



    $('#wave4').drawWaves({
        height: baseHeight,
        waveDelta: waveDelta,
        speed: .15,
        color: '#1F538F'
    });
    $('#wave3').drawWaves({
        height: baseHeight - 5,
        waveDelta: waveDelta,
        speed: .25,
        color: '#407DB3'
    });
    $('#wave2').drawWaves({
        height: baseHeight - 10,
        waveDelta: waveDelta,
        speed: .45,
        color: '#b4cee4'
    })
    $('#wave1').drawWaves({
        height: baseHeight - 15,
        waveDelta: waveDelta,
        speed: .65,
        color: '#6DA2CC'
    })

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
        if(selected.length)
        {
            selected.removeAttr("selected")
        }

        let spotId = $(this).data("mswid");
        $(this).attr("selected", true)

        $.ajax("http://magicseaweed.com/api/e035ec3907acbee73a5eea8ba2f3e2fc/forecast/?spot_id=" + spotId, {
            success: function (data) {
                console.log(data);
                redrawWaves(data, 0)
            }
        })

        $(".menu").slideToggle("slow", function () {
            $(".cross").hide();
            $(".hamburger").show();
        });
    })
});

function getSelected(){
    return $('.spot[selected="selected"]');
}

function fillConditionInfo(timeBlock) {
    let name = getSelected().text();

    $("#spot-name").text(name);
    $("#spot-combined-height").text("Combined Height: " + timeBlock.swell.components.combined.height + "ft");
    $("#spot-primary-height").text("Primary Height: " + timeBlock.swell.components.primary.height + "ft");
    $("#spot-secondary-height").text("Secondary Height: " + timeBlock.swell.components.secondary.height + "ft");
    $("#spot-tertiary-height").text("Tertiary Height: " + timeBlock.swell.components.tertiary.height + "ft");
}

function redrawWaves(mswData, index) {

    let heightMultiplier = 50;
    let periodMultiplier = .1;
    let timeBlock = mswData[index];

    fillConditionInfo(timeBlock);

    $('#wave4').drawWaves({
        height: baseHeight,
        waveDelta: timeBlock.swell.components.combined.height * heightMultiplier,
        speed: timeBlock.swell.components.combined.period * periodMultiplier,
        color: '#1F538F'
    });
    $('#wave3').drawWaves({
        height: baseHeight - 5,
        waveDelta: timeBlock.swell.components.primary.height * heightMultiplier,
        speed: timeBlock.swell.components.primary.period * periodMultiplier,
        color: '#407DB3'
    });
    $('#wave2').drawWaves({
        height: baseHeight - 10,
        waveDelta: timeBlock.swell.components.secondary.height * heightMultiplier,
        speed: timeBlock.swell.components.secondary.period * periodMultiplier,
        color: '#b4cee4'
    })
    $('#wave1').drawWaves({
        height: baseHeight - 15,
        waveDelta: timeBlock.swell.components.tertiary.height * heightMultiplier,
        speed: timeBlock.swell.components.tertiary.period * periodMultiplier,
        color: '#6DA2CC'
    })
}