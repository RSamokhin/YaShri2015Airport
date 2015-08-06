var ajaxSetup = {

    },
    Handlers = {
        listAirportSuggestions: function () {
            var $input = $(this).parent().find('input'),
                p = $input.data('filter'),
                query = {};
            $('.header__airport-container').find('input:not(.m-button)').each(function (el) {
                var $el = $(this);
                if ($el.val().length) {
                    query[$el.data('filter')]=$el.val();
                }
            });
            console.log(p);
            $.ajax({
                url: '/api/proxy/airports/filter/'+p,
                type: 'get',
                dataType: 'JSON',
                data: query,
                success: function (data) {
                    console.log(data);

                }
            });
        },
        iconsSwitch: function () {
            var $input = $(this).parent().find('input');
            if ($input.val().length) {
                $input.next().next().addClass('m-clear');
            } else {
                $input.next().next().removeClass('m-clear');
            }
        },
        clearInput: function () {
            $(this).parent().find('input').val('');
            Handlers.iconsSwitch.call(this);
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

