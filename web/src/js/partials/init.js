window.ajaxSetup = {
        getAirportsParamsSearch: function (p) {
            var query = {};
            $('.header__airport-container').find('.header__search-box:not(.m-button)').each(function () {
                var $el = $(this);
                if ($el.val().length) {
                    query[$el.data('filter')] = $el.val();
                }
            });
            return {
                url: '/api/proxy/airports/filter/' + p,
                type: 'get',
                dataType: 'JSON',
                data: query
            };
        },
        getFlightsInfo: function (year, month, day, hour) {
            window.digitalWatch();
            if (!(year && month && day && hour !== undefined)) {
                var mydate = new Date(window.airportDefaultDate);
                mydate.setUTCHours(mydate.getUTCHours()-1);
                year = mydate.getUTCFullYear();
                month = mydate.getUTCMonth()+1;
                day = mydate.getUTCDate();
                hour = mydate.getUTCHours();
                window.filterDate = new Date(mydate);
            }
            return {
                url: '/api/proxy/airport/' + $('.header__search-box').eq(3).val() +'/' + year + '/' + month + '/' + day +'/' + hour + '/',
                type: 'get',
                dataType: 'JSON'
            };
        }
    };
window.Handlers = {
        mouseenter: {
            hoverTableColumn:function () {
                var $td = $(this),
                    n = parseInt($(this).index()) + 1;
                $('.content__table-tr .content__table-td:nth-child(' + n + ')').addClass('m-highlighted');
            }
        },
        mouseleave: {
            hoverLeaveTableColumn: function () {
                var $td = $(this),
                    n = parseInt($(this).index()) + 1;
                $('.content__table-tr .content__table-td:nth-child(' + n + ')').removeClass('m-highlighted');
            }
        },
        click: {
            filterTableByType: function () {
                var $button = $(this),
                    param = $button.data('filter-param');
                $button.toggleClass('m-filtered');
                if (!$button.hasClass('m-filtered')) {

                }

                if (!window.detachedType){
                    window.detachedType = $([]);
                }
                window.detachedType.appendTo('.content__table');
                window.detachedType = $('.content__table').find('.m-'+param).closest('.content__table-tr');
                window.detachedType.detach();
            },
            listAirportSuggestions: function () {
                var $input = $(this).parent().find('input'),
                    p = $input.data('filter'),
                    $suggestions = $input.parent().children('.header__search-suggestions'),
                    $allSuggestions=$('.header__search-suggestions');
                $allSuggestions.html('');
                if (!$suggestions.hasClass('m-visible')) {
                    $allSuggestions.removeClass('m-visible');
                    $.ajax($.extend(
                        {},
                        {
                            beforeSend: function () {
                                $input.addClass('m-load');
                            },
                            success: function (data) {
                                if (!data || data.length === 0) {
                                    data = [];
                                }
                                $input.removeClass('m-load');
                                if (data.length) {
                                    if (data.length > 300) {
                                        data = {
                                            "name": "To many results",
                                            "count": 0
                                        }

                                    }
                                    $suggestions.html('');
                                    $('#tAirportSearchResult').tmpl(data).appendTo($suggestions);
                                    if (data.length === 1 && data[0].count > 0) {
                                        $suggestions.find('.header__search__result-info').trigger('click');
                                        $input.addClass('m-green');
                                    } else {
                                        $suggestions.addClass('m-visible');
                                        $input.removeClass('m-green');

                                    }
                                }
                            }
                        },
                        window.ajaxSetup.getAirportsParamsSearch(p)
                    ));
                } else {
                    $suggestions.removeClass('m-visible');
                    $suggestions.html('');
                }
            },
            showNext: function () {
                window.filterDate.setUTCHours( window.filterDate.getUTCHours() + 1);
                window.Handlers.click.showResults(
                    window.filterDate.getUTCFullYear(),
                    window.filterDate.getUTCMonth()+1,
                    window.filterDate.getUTCDate(),
                    window.filterDate.getUTCHours()
                );
            },
            showPrev: function () {
                window.filterDate.setUTCHours( window.filterDate.getUTCHours() - 1);
                window.Handlers.click.showResults(
                    window.filterDate.getUTCFullYear(),
                    window.filterDate.getUTCMonth()+1,
                    window.filterDate.getUTCDate(),
                    window.filterDate.getUTCHours()
                );
            },
            clearInput: function () {
                var weight = $(this).data('weight'),
                    $allSuggestions=$('.header__search-suggestions');
                $allSuggestions.removeClass('m-visible');
                $(this).parent().find('input').val('');
                $(this).parent().removeClass('m-filled');
                $('.header__search-box').each(function () {
                    var el = this;
                    if ($(el).next().next().data('weight') >= weight) {
                        $(el).val('');
                        $(el).removeClass('m-green');
                        $(el).parent().removeClass('m-filled');

                    }
                });

            },
            continueAirportSearch: function () {
                var $inputExample = $(this),
                    $input = $(this).closest('.header__search').children('.header__search-box'),
                    count = $inputExample.next().val();
                if (count !== '0') {
                    $input.val($inputExample.val());
                    $input.addClass('m-green');
                    $input.parent().addClass('m-filled');
                    $('.header__search-suggestions').removeClass('m-visible');
                    $input.parent().next().children('.header__search-box').trigger('click').focus();
                }
            },
            acAirportSearch: function () {
                window.Handlers.keyup.acAirportSearch.call(this);
            },
            showResults: function (year, month, day, hour) {
                var $timeContainer = $('.header__time-container'),
                    $tags = $('.header__tags-container'),
                    $container =  $('.content__filter-container');
                $tags.children().remove();
                $container.addClass('m-hidden');
                $('.content__filter.m-filtered').trigger('click').removeClass('m-filtered');
                if ($('.header__search-box.m-green').length === 4) {
                    $timeContainer.removeClass('m-hidden');
                    $.ajax($.extend(
                        {},
                        {
                            success: function (data) {
                                if (!data || data.length === 0) {
                                    data = [];
                                }
                                $('#airportTime').attr('data-time-offset', data[0].name);
                                $.ajax($.extend(
                                    {},
                                    {
                                        beforeSend: function () {
                                            $(document.body).addClass('m-scrolled');
                                            $('.loader').removeClass('m-hidden');
                                            $('.content').show();
                                        },
                                        success: function (data) {
                                            if (!data || data.length === 0) {
                                                data = [];
                                            }
                                            $('#contentRow').children().remove();
                                            $('.content').removeClass('m-hidden');
                                            $('.loader').addClass('m-hidden');
                                            $('#flightRow').tmpl(data).appendTo('#contentRow');
                                            window.dataFlights = data;
                                        }
                                    },
                                    window.ajaxSetup.getFlightsInfo(year, month, day, hour)
                                ));
                            }
                        },
                        window.ajaxSetup.getAirportsParamsSearch('offset')
                    ));
                    $container.addClass('m-hidden');
                } else {
                    $('.header__search-box:not(.m-green)').first().trigger('click');
                }
            },
            layerClose: function () {
                $('.layer__container').addClass('m-hidden');
                $('layer__item').remove();
            },
            showFlightInfo: function () {
                var $tr = $(this),
                    flightN = $tr.attr('data-flight'),
                    fields = {
                         "type": "Flight Type",
                         "flight": "Flight Number",
                         "codeshares":"CoSharing Flights",
                         "carrier": "Airlines",
                         "departureAirportCountry": "From County",
                         "departureAirportCity": "From City",
                         "departureAirportName": "From Airport",
                         "arrivalAirportCountry": "Destination Country",
                         "arrivalAirportCity": "Destination City",
                         "arrivalAirportName": "Destination Airport",
                         "departureDate": "Departure Planned",
                         "arrivalDate": "Arrival Planned",
                         "status": "Flight Status",
                         "flightEquipment": "Plane Type",
                         "terminal": "Terminal",
                         "estimatedGateDeparture": "Estimated Departure",
                         "actualGateDeparture": "Actual Departure",
                         "estimatedGateArrival": "Estimated Arrival",
                         "actualGateArrival": "Actual Arrival"
                    },
                    flight = window.dataFlights.filter(function (flight) {
                        return flight.flight === flightN;
                    })[0] || {},
                    resultDataObject = [];
                    Object.keys(fields).forEach(function (field) {
                        if (flight[field] !== undefined && flight[field] !== null && flight[field].length !== 0 && flight[field] !== '-') {
                            resultDataObject.push({
                                key: fields[field],
                                value: ((new Date(flight[field]) == 'Invalid Date')) ? flight[field].toString() : (new Date(flight[field])).toUTCString()
                            });
                        }
                    });
                    $('.layer__container').removeClass('m-hidden');
                $('#fullInfoRow').tmpl(resultDataObject).appendTo('.layer__container-data');
            },
            showMenu: function () {
                $(document.body).removeClass('m-scrolled')
            },
            filterResults: function () {
                $('.content__filter-container').toggleClass('m-hidden');
                $('.content__filter-input').focus();
                window.Handlers.click.showMenu();
            },
            clearFilter: function () {
                var $this = $(this),
                    $tags = $('.header__tags-container'),
                    $tbody = $('.content__table-body');
                    $this.remove();
                $tbody.find('.m-filtered-tag').each(function (i, tr) {
                    var $tr = $(tr);
                    $tr.removeClass('m-filtered-tag');
                    if (!$tr.hasClass('m-filtered-type')) {
                        $tr.addClass('m-stripes');
                    }
                });
                $tags.children().each(function (i, el) {
                    var val = $(el).text();
                    $tbody.find('.content__table-tr').each(function (i, tr) {
                        $tr = $(tr);
                        if (!~$tr.text().toLowerCase().indexOf(val)) {
                            $tr.addClass('m-filtered-tag');
                            $tr.removeClass('m-stripes')
                        }
                    });
                });
                if (!$tags.children().length)
                    $('.content__filter.m-filter ').removeClass('m-filtered');
            },
            toggleAddTag: function () {
                if(event.keyCode === 13){
                    window.Handlers.click.addFilterTag();
                }
                return false;
            },
            addFilterTag: function () {
                var $input = $('.content__filter-input'),
                    $tags = $('.header__tags-container'),
                    $tbody = $('.content__table-body'),
                    filter;
                $('.content__filter.m-filter').addClass('m-filtered');
                if ($input.val().trim().length && $tags.children().length < 5) {
                    filter = $input.val().trim().toLowerCase();
                    $tbody.find('.content__table-tr').each(function (i, tr) {
                        $tr = $(tr);
                        if (!~$tr.text().toLowerCase().indexOf(filter)) {
                            $tr.addClass('m-filtered-tag');
                        }
                    });
                    $('.content__filter-container').addClass('m-hidden');
                    $input.val('');
                    $('<span/>').addClass('header__tags-span').attr('data-bind-click', 'clearFilter').text(filter).appendTo($tags);
                    window.Handlers.click.showMenu();
                } else {
                    $($input).addClass('m-red');
                    $($tags).addClass('m-red');
                    setTimeout(function () {
                        $($tags).removeClass('m-red');
                    }, 1000);
                    setTimeout(function () {
                        $($input, $tags).removeClass('m-red');
                    }, 1000);
                }
            }
        },
        keyup: {
            acAirportSearch: function () {
                var $input = $(this).parent().children('input'),
                    $allSuggestions=$('.header__search-suggestions');
                $allSuggestions.removeClass('m-visible');
                if ($input.val().length) {
                    $input.parent().addClass('m-filled');
                } else {
                    $input.parent().removeClass('m-filled');
                }
                $input.removeClass('m-green');
                $input.next().trigger('click');
            }
        }
    };
$(function(){
    Object.keys(window.Handlers).forEach(function (eve) {
        Object.keys(window.Handlers[eve]).forEach(function (fun) {
            $(document).on(eve, '[data-bind-'+eve+'*="'+fun+'"]', window.Handlers[eve][fun]);
        });
    });
    digitalWatch();
});

function digitalWatch() {
    var mydate = new Date(),
        offset = $("#airportTime").attr('data-time-offset');
    mydate.setUTCMinutes(mydate.getMinutes()+ offset*60);
    var hours = mydate.getUTCHours(),
        minutes = mydate.getUTCMinutes(),
        seconds = mydate.getUTCSeconds();
    window.airportDefaultDate = mydate;

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("airportTime").innerHTML = hours + ":" + minutes + ":" + seconds;
    setTimeout("digitalWatch()", 1000);
}