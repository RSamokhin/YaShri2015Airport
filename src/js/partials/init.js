var ajaxSetup = {
    global: {
        type: 'GET',
        dataType: 'JSON'
    },
    setup: {
        appId: '01e8e01e',
        appKey: '1d0c14aeebb6875e849b703c8863c724'
    },
    airportRequest: {
        url: 'https://api.flightstats.com/flex/airports/rest/v1/json/active'

    }
},
    Handlers = {
        airportSelect: function () {
            console.log(this);
        }
    };

$(function(){
    $('[data-bind-event]').each(function () {
        var $this = $(this);
        $this.bind(this.dataset.bindEvent, eval(this.dataset.bindFunction));
    });
});

