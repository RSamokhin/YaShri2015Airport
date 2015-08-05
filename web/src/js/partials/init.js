var ajaxSetup = {
        global: {
            type: 'GET',
            dataType: 'JSONP',
            jsonpCallback: 'callback'
        },
        credentials: {
            appId: '19d57e69',//'01e8e01e',
            appKey: 'e0ea60854c1205af43fd7b1203005d59'//'1d0c14aeebb6875e849b703c8863c724'
        },
        airportRequest: {
            url: 'https://api.flightstats.com/flex/airports/rest/v1/json/active'
        }
    },
    Handlers = {
        airportSelect: function () {
            var ajax;
            if (dataContainer.aiports === undefined) {
                ajax = {};
                $.extend(
                    ajax,
                    ajaxSetup.global,
                    ajaxSetup.airportRequest,
                    {
                        data: ajaxSetup.credentials,
                        complete: function(data) {
                            dataContainer.aiports = data;
                        }
                    }
                );
                $.ajax(ajax);
            };
        }
    },
    dataContainer = {};

$(function(){
    $('[data-bind-events]').each(function () {
        var $this = $(this),
            self = this,
            binds = this.dataset.bindEvents.split(',');
        binds.forEach(function (bind) {
            $this.bind(bind, eval($this.data('bind-' + bind)));
        })
    });
});

