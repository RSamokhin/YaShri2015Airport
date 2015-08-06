var ajaxSetup = {

    },
    Handlers = {
        listAirportSuggestions: function () {
            console.log(this);
        }
    },
    dataContainer = {};
$(function(){
    $('[data-bind-events]').each(function () {
        var $domElement = $(this),
            domElement = this,
            bindEvents = this.dataset.bindEvents.split(',');
        bindEvents.forEach(function (bEvent) {
            var bindFunction = $domElement.data('bind-' + bEvent).split(',');
            bindFunction.forEach(function (bFunction) {
                $domElement.bind(bEvent, eval('Handlers.'+bFunction));
            });
        })
    });
});

