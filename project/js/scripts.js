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

    $('#wave1').drawWaves({
        //height: .5
        speed: .15,
        color: '#1F538F'
    });
    $('#wave2').drawWaves({
        speed: .25,
        color: '#407DB3'
    });
    $('#wave3').drawWaves({
        speed: .45,
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

    $(".spot").click(function(){
        
        let spotId = $(this).data("mswid");       

        $.ajax("http://magicseaweed.com/api/e035ec3907acbee73a5eea8ba2f3e2fc/forecast/?spot_id=" + spotId,{
            success: function(data){
                alert(data);
            }
        } )
        
        $(".menu").slideToggle("slow", function () {
            $(".cross").hide();
            $(".hamburger").show();
        });
    })
});