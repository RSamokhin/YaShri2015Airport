console.log(1);
var ajaxSetup = {

    },
    Handlers = {
        listAirportSuggestions: function () {
            console.log(this);
        }
    },
    dataContainer = {};
debugger;
$(function(){
    $('[data-bind-events]').each(function () {
        var $domElement = $(this),
            domElement = this,
            bindEvents = this.dataset.bindEvents.split(',');
        bindEvents.forEach(function (bEvent) {
            var bindFunction = domElement.dataset['bind-' + bEvent].split(',');
            bindFunction.forEach(function (bFunction) {
                $domElement.bind(bEvent, Handlers[eval(bFunction)]);
            });
        })
    });
});

