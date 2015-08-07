var ajaxSetup = {

    },
    Handlers = {
        click: {
            listAirportSuggestions: function () {
                var $input = $(this).parent().find('input'),
                    p = $input.data('filter'),
                    query = {},
                    $suggestions = $input.parent().children('.header__search-suggestions'),
                    $allSuggestions=$('.header__search-suggestions');
                $allSuggestions.html('');
                if (!$suggestions.hasClass('m-visible')) {
                    $allSuggestions.removeClass('m-visible');
                    $('.header__airport-container').find('.header__search-box:not(.m-button)').each(function (el) {
                        var $el = $(this);
                        if ($el.val().length) {
                            query[$el.data('filter')] = $el.val();
                        }
                    });
                    $.ajax({
                        url: '/api/proxy/airports/filter/' + p,
                        type: 'get',
                        dataType: 'JSON',
                        data: query,
                        success: function (data) {
                            if (data.length) {
                                if (data.length > 300) {
                                    data = {
                                        "name": "To many results",
                                        "count": 0
                                    }

                                }
                                $('#tAirportSearchResult').tmpl(data).appendTo($suggestions);
                                if (data.length === 1 && data[0].count > 0) {
                                    $suggestions.find('.header__search__result-info').trigger('click');
                                } else {
                                    $suggestions.addClass('m-visible');

                                }
                            }
                        }
                    });
                } else {
                    $suggestions.removeClass('m-visible');
                    $suggestions.html('');
                }
            },
            clearInput: function () {
                $(this).parent().find('input').val('');
                Handlers.keyup.iconsSwitch.call(this);
            },
            continueAirportSearch: function () {
                var $inputExample = $(this),
                    $input = $(this).closest('.header__search').children('.header__search-box'),
                    count = $inputExample.next().val();
                if (count !== '0') {
                    $input.val($inputExample.val());
                    $('.header__search-suggestions').removeClass('m-visible');
                    //$input.parent().next().children('.header__search-box:not(.m-button)').next('.header__search-button').trigger('click');
                    //$input.trigger('keyup');
                }
            }
        },
        keyup: {
            iconsSwitch: function () {
                var $input = $(this).parent().children('input'),
                    $allSuggestions=$('.header__search-suggestions');
                $allSuggestions.removeClass('m-visible');
                if ($input.val().length) {
                    $input.next().next().addClass('m-clear');
                    $input.attr('data-contains',$input.val());
                    $input
                } else {
                    $input.next().next().removeClass('m-clear');
                    $input.attr('data-contains','').removeAttr('contains');
                }
                $input.next().trigger('click');
            }
        }
    },
    dataContainer = {};
$(function(){
    Object.keys(Handlers).forEach(function (eve) {
        Object.keys(Handlers[eve]).forEach(function (fun) {
            $(document).on(eve, '[data-bind-'+eve+'*="'+fun+'"]', Handlers[eve][fun]);
        })
    });

    /*$('[data-bind-events]').each(function () {
        var $domElement = $(this),
            domElement = this,
            bindEvents = this.dataset.bindEvents.split(',');
        bindEvents.forEach(function (bEvent) {
            var bindFunction = $domElement.data('bind-' + bEvent).split(',');
            bindFunction.forEach(function (bFunction) {
                $(document).on(bEvent, $domElement, eval('Handlers.'+bFunction));
            });
        })
    });*/
});

