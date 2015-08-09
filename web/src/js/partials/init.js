var ajaxSetup = {
        getAirportsParamsSearch: function (p ) {
            var query = {},
                ajaxSetup = {};
            $('.header__airport-container').find('.header__search-box:not(.m-button)').each(function () {
                var $el = $(this);
                if ($el.val().length) {
                    query[$el.data('filter')] = $el.val();
                }
            });
            ajaxSetup = {
                url: '/api/proxy/airports/filter/' + p,
                type: 'get',
                dataType: 'JSON',
                data: query
            };
            return ajaxSetup;
        }
    },
    Handlers = {
        mouseenter: {
            hoverTableColumn:function () {
                var $td = $(this),
                    n = parseInt($(this).index()) + 1;
                $('.content__table-tr td:nth-child(' + n + ')').addClass('m-highlighted');
            }
        },
        mouseleave: {
            hoverLeaveTableColumn: function () {
                var $td = $(this),
                    n = parseInt($(this).index()) + 1;
                $('.content__table-tr td:nth-child(' + n + ')').removeClass('m-highlighted');
            }
        },
        scroll: {
            tableScroll: function () {
               $(document.body).addClass('m-scrolled')
            }
        },
        click: {
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
                        ajaxSetup.getAirportsParamsSearch(p)
                    ));
                } else {
                    $suggestions.removeClass('m-visible');
                    $suggestions.html('');
                }
            },
            clearInput: function () {
                var weight = $(this).data('weight'),
                    self = this,
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
                Handlers.keyup.acAirportSearch.call(this);
            },
            showResults: function () {
                var $timeContainer = $('.header__time-container');
                if ($('.header__search-box.m-green').length === 4) {
                    $timeContainer.removeClass('m-hidden');
                    $.ajax($.extend(
                        {},
                        {
                            success: function (data) {
                                $('#airportTime').attr('data-time-offset', data[0].name)
                            }
                        },
                        ajaxSetup.getAirportsParamsSearch('offset')
                    ));
                } else {
                    $('.header__search-box:not(.m-green)').each(function () {
                        if (!$(this).hasClass('m-button')) {
                            $(this).animate({backgroundColor: 'red'}, 'slow').animate({backgroundColor: 'white'}, 'slow').queue(function () {
                                $(this).removeAttr('style');
                            });
                        }
                    });
                    $('.header__search-box:not(.m-green)').first().trigger('click');
                }
            },
            showMenu: function () {
                $(document.body).removeClass('m-scrolled')
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
    },
    dataContainer = {};
$(function(){
    Object.keys(Handlers).forEach(function (eve) {
        Object.keys(Handlers[eve]).forEach(function (fun) {
            $(document).on(eve, '[data-bind-'+eve+'*="'+fun+'"]', Handlers[eve][fun]);
        });
    });
    digitalWatch();
    $('section.content').on('scroll' ,function(){
        Handlers.scroll.tableScroll();
    });








    var flights = [
        {
            "flight": 1302,
            "type": "depature",
            "airlines": "Hometown",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Levine",
            "destination": "Matheny",
            "departure": "Tuesday, April 29, 2014 2:38 PM",
            "arrival": "Tuesday, May 13, 2014 9:02 AM",
            "status": "intime",
            "comment": "eu officia"
        },
        {
            "flight": 5418,
            "type": "depature",
            "airlines": "Krag",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Tran",
            "destination": "Madrid",
            "departure": "Thursday, October 9, 2014 6:20 PM",
            "arrival": "Monday, May 12, 2014 1:17 AM",
            "status": "intime",
            "comment": "voluptate veniam"
        },
        {
            "flight": 2997,
            "type": "arrival",
            "airlines": "Empirica",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Gilmore",
            "destination": "Dawn",
            "departure": "Monday, October 13, 2014 5:46 PM",
            "arrival": "Friday, February 28, 2014 9:05 AM",
            "status": "earlier",
            "comment": "eu enim"
        },
        {
            "flight": 8505,
            "type": "arrival",
            "airlines": "Bitendrex",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Gordon",
            "destination": "Tonopah",
            "departure": "Tuesday, April 7, 2015 4:35 AM",
            "arrival": "Sunday, February 15, 2015 12:53 PM",
            "status": "intime",
            "comment": "duis quis"
        },
        {
            "flight": 8237,
            "type": "arrival",
            "airlines": "Photobin",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Fletcher",
            "destination": "Steinhatchee",
            "departure": "Thursday, July 9, 2015 7:54 PM",
            "arrival": "Saturday, July 25, 2015 10:27 PM",
            "status": "earlier",
            "comment": "est dolore"
        },
        {
            "flight": 3485,
            "type": "arrival",
            "airlines": "Waretel",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Orr",
            "destination": "Bluffview",
            "departure": "Tuesday, October 14, 2014 5:10 PM",
            "arrival": "Tuesday, April 21, 2015 8:11 PM",
            "status": "later",
            "comment": "incididunt est"
        },
        {
            "flight": 7377,
            "type": "arrival",
            "airlines": "Lunchpod",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Marshall",
            "destination": "Forestburg",
            "departure": "Sunday, August 17, 2014 2:14 PM",
            "arrival": "Friday, September 26, 2014 3:34 PM",
            "status": "intime",
            "comment": "nulla ad"
        },
        {
            "flight": 3812,
            "type": "arrival",
            "airlines": "Zizzle",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Knowles",
            "destination": "Dola",
            "departure": "Sunday, November 23, 2014 10:23 AM",
            "arrival": "Monday, July 13, 2015 10:13 PM",
            "status": "earlier",
            "comment": "amet nisi"
        },
        {
            "flight": 8605,
            "type": "depature",
            "airlines": "Stockpost",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Cannon",
            "destination": "Bradenville",
            "departure": "Thursday, February 12, 2015 6:37 PM",
            "arrival": "Sunday, September 14, 2014 6:37 PM",
            "status": "later",
            "comment": "sint incididunt"
        },
        {
            "flight": 8765,
            "type": "arrival",
            "airlines": "Biotica",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Cruz",
            "destination": "Turah",
            "departure": "Monday, October 13, 2014 11:02 PM",
            "arrival": "Thursday, February 12, 2015 3:35 PM",
            "status": "intime",
            "comment": "id consequat"
        },
        {
            "flight": 7301,
            "type": "arrival",
            "airlines": "Geekular",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Mendez",
            "destination": "Chamizal",
            "departure": "Tuesday, November 4, 2014 10:13 PM",
            "arrival": "Tuesday, September 2, 2014 11:09 PM",
            "status": "intime",
            "comment": "elit nisi"
        },
        {
            "flight": 2060,
            "type": "depature",
            "airlines": "Fleetmix",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Chaney",
            "destination": "Glendale",
            "departure": "Saturday, March 14, 2015 2:32 PM",
            "arrival": "Tuesday, February 17, 2015 7:54 AM",
            "status": "later",
            "comment": "nulla pariatur"
        },
        {
            "flight": 4673,
            "type": "depature",
            "airlines": "Comvex",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Abbott",
            "destination": "Orick",
            "departure": "Friday, February 7, 2014 8:12 PM",
            "arrival": "Wednesday, June 10, 2015 11:40 PM",
            "status": "earlier",
            "comment": "qui incididunt"
        },
        {
            "flight": 1745,
            "type": "arrival",
            "airlines": "Insource",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Higgins",
            "destination": "Snelling",
            "departure": "Thursday, August 6, 2015 3:37 AM",
            "arrival": "Monday, January 6, 2014 5:12 AM",
            "status": "earlier",
            "comment": "dolor Lorem"
        },
        {
            "flight": 5767,
            "type": "depature",
            "airlines": "Emoltra",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Watkins",
            "destination": "Florence",
            "departure": "Tuesday, March 11, 2014 6:55 AM",
            "arrival": "Tuesday, July 14, 2015 10:11 PM",
            "status": "later",
            "comment": "consectetur irure"
        },
        {
            "flight": 3800,
            "type": "depature",
            "airlines": "Remotion",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Wilson",
            "destination": "Eastmont",
            "departure": "Wednesday, May 28, 2014 7:55 PM",
            "arrival": "Thursday, January 16, 2014 3:36 PM",
            "status": "later",
            "comment": "labore dolore"
        },
        {
            "flight": 1429,
            "type": "arrival",
            "airlines": "Candecor",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Johns",
            "destination": "Kent",
            "departure": "Sunday, October 12, 2014 4:29 AM",
            "arrival": "Tuesday, January 14, 2014 9:36 AM",
            "status": "later",
            "comment": "elit cillum"
        },
        {
            "flight": 8381,
            "type": "arrival",
            "airlines": "Genesynk",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Garza",
            "destination": "Bridgetown",
            "departure": "Tuesday, August 19, 2014 4:55 PM",
            "arrival": "Thursday, July 30, 2015 1:17 PM",
            "status": "intime",
            "comment": "ea irure"
        },
        {
            "flight": 6333,
            "type": "arrival",
            "airlines": "Harmoney",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Zamora",
            "destination": "Coinjock",
            "departure": "Wednesday, January 14, 2015 10:47 PM",
            "arrival": "Friday, November 14, 2014 4:10 AM",
            "status": "later",
            "comment": "fugiat anim"
        },
        {
            "flight": 5078,
            "type": "arrival",
            "airlines": "Neurocell",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Booth",
            "destination": "Bawcomville",
            "departure": "Friday, July 31, 2015 6:14 PM",
            "arrival": "Sunday, September 21, 2014 4:50 AM",
            "status": "earlier",
            "comment": "culpa proident"
        },
        {
            "flight": 9644,
            "type": "arrival",
            "airlines": "Zolarity",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Meyer",
            "destination": "Rosewood",
            "departure": "Thursday, May 8, 2014 2:22 PM",
            "arrival": "Wednesday, April 2, 2014 1:14 AM",
            "status": "intime",
            "comment": "voluptate nostrud"
        },
        {
            "flight": 5561,
            "type": "depature",
            "airlines": "Senmei",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Franklin",
            "destination": "Needmore",
            "departure": "Sunday, March 8, 2015 1:52 PM",
            "arrival": "Saturday, October 25, 2014 1:38 AM",
            "status": "earlier",
            "comment": "id aliqua"
        },
        {
            "flight": 4213,
            "type": "depature",
            "airlines": "Stelaecor",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Shannon",
            "destination": "Bynum",
            "departure": "Tuesday, September 23, 2014 1:08 AM",
            "arrival": "Saturday, November 8, 2014 11:35 AM",
            "status": "earlier",
            "comment": "velit irure"
        },
        {
            "flight": 8203,
            "type": "depature",
            "airlines": "Schoolio",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Alston",
            "destination": "Harold",
            "departure": "Friday, January 3, 2014 12:11 AM",
            "arrival": "Sunday, June 8, 2014 4:49 AM",
            "status": "earlier",
            "comment": "cupidatat in"
        },
        {
            "flight": 6626,
            "type": "depature",
            "airlines": "Xinware",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Wagner",
            "destination": "Maybell",
            "departure": "Monday, March 23, 2015 10:18 AM",
            "arrival": "Monday, May 26, 2014 8:11 AM",
            "status": "later",
            "comment": "magna do"
        },
        {
            "flight": 8105,
            "type": "arrival",
            "airlines": "Magnina",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Hughes",
            "destination": "Kiskimere",
            "departure": "Tuesday, February 18, 2014 8:54 AM",
            "arrival": "Tuesday, June 17, 2014 4:51 PM",
            "status": "earlier",
            "comment": "amet magna"
        },
        {
            "flight": 6423,
            "type": "depature",
            "airlines": "Zisis",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Emerson",
            "destination": "Ruckersville",
            "departure": "Sunday, March 22, 2015 3:19 PM",
            "arrival": "Tuesday, January 27, 2015 5:46 AM",
            "status": "later",
            "comment": "laborum laborum"
        },
        {
            "flight": 6608,
            "type": "depature",
            "airlines": "Isoplex",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Jones",
            "destination": "Wanamie",
            "departure": "Thursday, September 11, 2014 11:45 AM",
            "arrival": "Sunday, July 13, 2014 1:54 AM",
            "status": "intime",
            "comment": "nisi voluptate"
        },
        {
            "flight": 7916,
            "type": "arrival",
            "airlines": "Fangold",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Rivers",
            "destination": "Dennard",
            "departure": "Friday, January 9, 2015 12:41 PM",
            "arrival": "Saturday, November 1, 2014 8:15 AM",
            "status": "later",
            "comment": "aliquip incididunt"
        },
        {
            "flight": 3873,
            "type": "arrival",
            "airlines": "Dentrex",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Rodriguez",
            "destination": "Allensworth",
            "departure": "Thursday, October 2, 2014 5:10 AM",
            "arrival": "Monday, June 9, 2014 1:11 PM",
            "status": "earlier",
            "comment": "non eu"
        },
        {
            "flight": 1577,
            "type": "arrival",
            "airlines": "Zillactic",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Howe",
            "destination": "Bath",
            "departure": "Tuesday, March 25, 2014 4:47 PM",
            "arrival": "Wednesday, February 5, 2014 3:00 PM",
            "status": "later",
            "comment": "consectetur incididunt"
        },
        {
            "flight": 7494,
            "type": "depature",
            "airlines": "Gorganic",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Hardy",
            "destination": "Rehrersburg",
            "departure": "Wednesday, February 19, 2014 4:52 AM",
            "arrival": "Sunday, April 6, 2014 3:26 PM",
            "status": "later",
            "comment": "fugiat nisi"
        },
        {
            "flight": 1076,
            "type": "arrival",
            "airlines": "Kegular",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Pena",
            "destination": "Gorham",
            "departure": "Thursday, March 19, 2015 10:37 PM",
            "arrival": "Friday, February 6, 2015 1:01 PM",
            "status": "earlier",
            "comment": "nisi exercitation"
        },
        {
            "flight": 3785,
            "type": "depature",
            "airlines": "Buzzopia",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Baldwin",
            "destination": "Bendon",
            "departure": "Tuesday, July 7, 2015 10:30 AM",
            "arrival": "Saturday, July 19, 2014 6:55 AM",
            "status": "intime",
            "comment": "minim pariatur"
        },
        {
            "flight": 8496,
            "type": "depature",
            "airlines": "Slax",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Hardin",
            "destination": "Lupton",
            "departure": "Monday, April 13, 2015 10:18 PM",
            "arrival": "Thursday, June 4, 2015 3:13 PM",
            "status": "earlier",
            "comment": "proident magna"
        },
        {
            "flight": 7665,
            "type": "depature",
            "airlines": "Urbanshee",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Webb",
            "destination": "Grenelefe",
            "departure": "Sunday, June 21, 2015 8:25 PM",
            "arrival": "Saturday, August 30, 2014 6:10 AM",
            "status": "intime",
            "comment": "non voluptate"
        },
        {
            "flight": 1461,
            "type": "depature",
            "airlines": "Anarco",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Reilly",
            "destination": "Savage",
            "departure": "Wednesday, July 8, 2015 9:10 AM",
            "arrival": "Saturday, January 11, 2014 4:40 AM",
            "status": "earlier",
            "comment": "culpa reprehenderit"
        },
        {
            "flight": 5726,
            "type": "depature",
            "airlines": "Zanymax",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Mcpherson",
            "destination": "Lewis",
            "departure": "Wednesday, January 22, 2014 5:06 AM",
            "arrival": "Wednesday, May 7, 2014 9:51 AM",
            "status": "earlier",
            "comment": "ad cillum"
        },
        {
            "flight": 7395,
            "type": "depature",
            "airlines": "Vortexaco",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Olson",
            "destination": "Drummond",
            "departure": "Thursday, March 26, 2015 3:45 PM",
            "arrival": "Thursday, July 16, 2015 10:13 PM",
            "status": "earlier",
            "comment": "nisi nulla"
        },
        {
            "flight": 9896,
            "type": "arrival",
            "airlines": "Petigems",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Mcintosh",
            "destination": "Lund",
            "departure": "Saturday, August 16, 2014 5:43 PM",
            "arrival": "Tuesday, May 26, 2015 11:48 AM",
            "status": "later",
            "comment": "nisi magna"
        },
        {
            "flight": 6571,
            "type": "depature",
            "airlines": "Sarasonic",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Padilla",
            "destination": "Lindisfarne",
            "departure": "Sunday, November 16, 2014 3:11 PM",
            "arrival": "Sunday, June 15, 2014 2:00 AM",
            "status": "later",
            "comment": "pariatur labore"
        },
        {
            "flight": 2770,
            "type": "depature",
            "airlines": "Sultrax",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Anthony",
            "destination": "Clarktown",
            "departure": "Saturday, September 6, 2014 2:24 AM",
            "arrival": "Wednesday, January 8, 2014 2:57 PM",
            "status": "intime",
            "comment": "eiusmod ad"
        },
        {
            "flight": 5585,
            "type": "arrival",
            "airlines": "Exovent",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Clark",
            "destination": "Waiohinu",
            "departure": "Saturday, February 8, 2014 3:03 AM",
            "arrival": "Friday, December 26, 2014 1:36 PM",
            "status": "intime",
            "comment": "aliqua excepteur"
        },
        {
            "flight": 6374,
            "type": "arrival",
            "airlines": "Aclima",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Kidd",
            "destination": "Avalon",
            "departure": "Thursday, July 17, 2014 9:31 PM",
            "arrival": "Thursday, February 12, 2015 7:20 PM",
            "status": "later",
            "comment": "anim ullamco"
        },
        {
            "flight": 9550,
            "type": "depature",
            "airlines": "Tersanki",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Hernandez",
            "destination": "Kenmar",
            "departure": "Friday, April 11, 2014 11:30 PM",
            "arrival": "Monday, February 2, 2015 7:21 PM",
            "status": "later",
            "comment": "occaecat et"
        },
        {
            "flight": 7287,
            "type": "arrival",
            "airlines": "Snowpoke",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Erickson",
            "destination": "Cartwright",
            "departure": "Friday, January 9, 2015 7:04 PM",
            "arrival": "Friday, September 5, 2014 2:46 PM",
            "status": "later",
            "comment": "quis consequat"
        },
        {
            "flight": 5601,
            "type": "depature",
            "airlines": "Eyeris",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Guzman",
            "destination": "Lisco",
            "departure": "Thursday, May 14, 2015 1:45 PM",
            "arrival": "Thursday, June 25, 2015 9:53 AM",
            "status": "later",
            "comment": "amet in"
        },
        {
            "flight": 6626,
            "type": "arrival",
            "airlines": "Dancity",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Russo",
            "destination": "Salix",
            "departure": "Friday, December 12, 2014 12:11 AM",
            "arrival": "Wednesday, March 25, 2015 11:04 PM",
            "status": "intime",
            "comment": "culpa irure"
        },
        {
            "flight": 8852,
            "type": "depature",
            "airlines": "Quarex",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Richardson",
            "destination": "Slovan",
            "departure": "Friday, March 13, 2015 7:32 PM",
            "arrival": "Tuesday, March 31, 2015 3:55 PM",
            "status": "intime",
            "comment": "commodo esse"
        },
        {
            "flight": 8790,
            "type": "depature",
            "airlines": "Apex",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Page",
            "destination": "Stonybrook",
            "departure": "Monday, June 22, 2015 12:24 AM",
            "arrival": "Friday, January 9, 2015 10:42 AM",
            "status": "earlier",
            "comment": "et consectetur"
        },
        {
            "flight": 5163,
            "type": "depature",
            "airlines": "Zillanet",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Winters",
            "destination": "Warsaw",
            "departure": "Monday, January 20, 2014 5:47 PM",
            "arrival": "Tuesday, June 24, 2014 8:31 AM",
            "status": "intime",
            "comment": "amet cupidatat"
        },
        {
            "flight": 6090,
            "type": "depature",
            "airlines": "Glasstep",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Mullins",
            "destination": "Summerfield",
            "departure": "Friday, September 5, 2014 1:23 PM",
            "arrival": "Friday, April 11, 2014 8:00 PM",
            "status": "earlier",
            "comment": "duis consequat"
        },
        {
            "flight": 3567,
            "type": "depature",
            "airlines": "Hatology",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Chang",
            "destination": "Cucumber",
            "departure": "Saturday, November 29, 2014 2:48 AM",
            "arrival": "Monday, February 24, 2014 2:44 PM",
            "status": "earlier",
            "comment": "minim irure"
        },
        {
            "flight": 4394,
            "type": "depature",
            "airlines": "Pathways",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Mcmillan",
            "destination": "Beaverdale",
            "departure": "Sunday, August 3, 2014 7:05 AM",
            "arrival": "Thursday, May 15, 2014 2:12 AM",
            "status": "intime",
            "comment": "Lorem reprehenderit"
        },
        {
            "flight": 4949,
            "type": "depature",
            "airlines": "Calcu",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Lawrence",
            "destination": "Faxon",
            "departure": "Wednesday, August 6, 2014 2:06 PM",
            "arrival": "Thursday, August 21, 2014 10:00 AM",
            "status": "later",
            "comment": "ex labore"
        },
        {
            "flight": 4331,
            "type": "arrival",
            "airlines": "Qaboos",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Booker",
            "destination": "Harborton",
            "departure": "Friday, August 1, 2014 6:52 PM",
            "arrival": "Tuesday, January 13, 2015 10:18 PM",
            "status": "intime",
            "comment": "voluptate non"
        },
        {
            "flight": 1020,
            "type": "depature",
            "airlines": "Elemantra",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Lara",
            "destination": "Gila",
            "departure": "Thursday, February 19, 2015 7:14 AM",
            "arrival": "Thursday, January 2, 2014 4:54 PM",
            "status": "later",
            "comment": "enim ipsum"
        },
        {
            "flight": 4631,
            "type": "depature",
            "airlines": "Zentia",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Bryan",
            "destination": "Sterling",
            "departure": "Monday, July 6, 2015 5:45 PM",
            "arrival": "Sunday, November 2, 2014 6:58 AM",
            "status": "later",
            "comment": "adipisicing labore"
        },
        {
            "flight": 3320,
            "type": "depature",
            "airlines": "Sunclipse",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Nixon",
            "destination": "Hiko",
            "departure": "Sunday, January 19, 2014 8:29 AM",
            "arrival": "Wednesday, December 31, 2014 11:53 AM",
            "status": "intime",
            "comment": "et deserunt"
        },
        {
            "flight": 9545,
            "type": "depature",
            "airlines": "Exostream",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Hawkins",
            "destination": "Homeland",
            "departure": "Monday, April 20, 2015 10:50 PM",
            "arrival": "Wednesday, December 17, 2014 6:28 PM",
            "status": "intime",
            "comment": "aute quis"
        },
        {
            "flight": 3898,
            "type": "depature",
            "airlines": "Corecom",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Noel",
            "destination": "Whitestone",
            "departure": "Friday, March 27, 2015 10:13 PM",
            "arrival": "Wednesday, July 16, 2014 8:51 AM",
            "status": "intime",
            "comment": "in non"
        },
        {
            "flight": 6288,
            "type": "depature",
            "airlines": "Kineticut",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Chandler",
            "destination": "Chicopee",
            "departure": "Wednesday, March 18, 2015 2:36 AM",
            "arrival": "Friday, April 18, 2014 11:34 PM",
            "status": "intime",
            "comment": "exercitation et"
        },
        {
            "flight": 7765,
            "type": "depature",
            "airlines": "Isostream",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Joyner",
            "destination": "Allentown",
            "departure": "Saturday, April 18, 2015 9:25 AM",
            "arrival": "Friday, October 17, 2014 2:00 AM",
            "status": "earlier",
            "comment": "incididunt qui"
        },
        {
            "flight": 9442,
            "type": "arrival",
            "airlines": "Globoil",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Roberson",
            "destination": "Dyckesville",
            "departure": "Thursday, December 18, 2014 8:23 PM",
            "arrival": "Thursday, March 27, 2014 8:57 AM",
            "status": "intime",
            "comment": "id exercitation"
        },
        {
            "flight": 4841,
            "type": "depature",
            "airlines": "Speedbolt",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Mooney",
            "destination": "Boling",
            "departure": "Thursday, May 14, 2015 8:39 PM",
            "arrival": "Tuesday, July 8, 2014 1:20 PM",
            "status": "later",
            "comment": "Lorem incididunt"
        },
        {
            "flight": 7679,
            "type": "arrival",
            "airlines": "Darwinium",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Hinton",
            "destination": "Manchester",
            "departure": "Thursday, January 23, 2014 4:40 AM",
            "arrival": "Tuesday, October 28, 2014 6:04 PM",
            "status": "intime",
            "comment": "eiusmod ex"
        },
        {
            "flight": 1696,
            "type": "arrival",
            "airlines": "Kinetica",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Watts",
            "destination": "Callaghan",
            "departure": "Monday, June 30, 2014 4:57 PM",
            "arrival": "Wednesday, April 30, 2014 7:23 PM",
            "status": "later",
            "comment": "ullamco ipsum"
        },
        {
            "flight": 7066,
            "type": "arrival",
            "airlines": "Pulze",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Pierce",
            "destination": "Washington",
            "departure": "Tuesday, April 28, 2015 2:08 PM",
            "arrival": "Friday, May 16, 2014 6:03 PM",
            "status": "earlier",
            "comment": "nulla pariatur"
        },
        {
            "flight": 2052,
            "type": "depature",
            "airlines": "Portaline",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Buchanan",
            "destination": "Guilford",
            "departure": "Monday, June 1, 2015 5:00 AM",
            "arrival": "Tuesday, April 29, 2014 10:23 PM",
            "status": "later",
            "comment": "reprehenderit voluptate"
        },
        {
            "flight": 8312,
            "type": "depature",
            "airlines": "Ginkogene",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Cantrell",
            "destination": "Kingstowne",
            "departure": "Thursday, December 25, 2014 1:01 PM",
            "arrival": "Thursday, December 4, 2014 2:58 PM",
            "status": "intime",
            "comment": "exercitation ex"
        },
        {
            "flight": 3417,
            "type": "arrival",
            "airlines": "Paprikut",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Christian",
            "destination": "Whipholt",
            "departure": "Wednesday, August 5, 2015 4:14 AM",
            "arrival": "Wednesday, February 4, 2015 5:54 PM",
            "status": "later",
            "comment": "incididunt fugiat"
        },
        {
            "flight": 3732,
            "type": "arrival",
            "airlines": "Twiist",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Morrison",
            "destination": "Abrams",
            "departure": "Friday, July 18, 2014 12:57 PM",
            "arrival": "Friday, April 18, 2014 7:02 AM",
            "status": "earlier",
            "comment": "anim culpa"
        },
        {
            "flight": 8606,
            "type": "depature",
            "airlines": "Bitrex",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Keith",
            "destination": "Roland",
            "departure": "Thursday, June 26, 2014 1:27 AM",
            "arrival": "Wednesday, July 15, 2015 2:06 AM",
            "status": "earlier",
            "comment": "sint sint"
        },
        {
            "flight": 7101,
            "type": "depature",
            "airlines": "Martgo",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Terrell",
            "destination": "Celeryville",
            "departure": "Sunday, May 24, 2015 6:09 PM",
            "arrival": "Thursday, June 11, 2015 11:31 AM",
            "status": "earlier",
            "comment": "dolore eu"
        },
        {
            "flight": 8955,
            "type": "depature",
            "airlines": "Blurrybus",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Prince",
            "destination": "Draper",
            "departure": "Friday, October 24, 2014 6:29 PM",
            "arrival": "Monday, July 13, 2015 6:14 AM",
            "status": "later",
            "comment": "officia excepteur"
        },
        {
            "flight": 6690,
            "type": "depature",
            "airlines": "Earwax",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Briggs",
            "destination": "Whitewater",
            "departure": "Wednesday, May 13, 2015 2:21 PM",
            "arrival": "Tuesday, March 3, 2015 3:54 AM",
            "status": "intime",
            "comment": "Lorem aute"
        },
        {
            "flight": 8656,
            "type": "depature",
            "airlines": "Roughies",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Wheeler",
            "destination": "Brantleyville",
            "departure": "Friday, April 10, 2015 2:36 AM",
            "arrival": "Thursday, February 20, 2014 10:18 PM",
            "status": "intime",
            "comment": "duis commodo"
        },
        {
            "flight": 2878,
            "type": "arrival",
            "airlines": "Techtrix",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Lowe",
            "destination": "Bergoo",
            "departure": "Sunday, March 29, 2015 6:52 PM",
            "arrival": "Wednesday, January 29, 2014 3:25 PM",
            "status": "earlier",
            "comment": "minim exercitation"
        },
        {
            "flight": 5507,
            "type": "depature",
            "airlines": "Qnekt",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Day",
            "destination": "Crayne",
            "departure": "Tuesday, January 28, 2014 12:14 AM",
            "arrival": "Sunday, February 22, 2015 11:40 AM",
            "status": "intime",
            "comment": "eu cupidatat"
        },
        {
            "flight": 7487,
            "type": "depature",
            "airlines": "Multron",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Velasquez",
            "destination": "Harrison",
            "departure": "Monday, January 12, 2015 8:08 AM",
            "arrival": "Thursday, September 18, 2014 7:11 AM",
            "status": "intime",
            "comment": "labore mollit"
        },
        {
            "flight": 4361,
            "type": "arrival",
            "airlines": "Diginetic",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Santana",
            "destination": "Levant",
            "departure": "Tuesday, July 15, 2014 8:33 PM",
            "arrival": "Tuesday, June 16, 2015 10:14 AM",
            "status": "later",
            "comment": "minim adipisicing"
        },
        {
            "flight": 3989,
            "type": "depature",
            "airlines": "Vinch",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Durham",
            "destination": "Galesville",
            "departure": "Tuesday, January 20, 2015 11:11 PM",
            "arrival": "Saturday, December 27, 2014 11:31 AM",
            "status": "earlier",
            "comment": "nisi nostrud"
        },
        {
            "flight": 5532,
            "type": "depature",
            "airlines": "Entogrok",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Hart",
            "destination": "Bowie",
            "departure": "Friday, February 14, 2014 10:26 PM",
            "arrival": "Monday, September 1, 2014 8:23 AM",
            "status": "earlier",
            "comment": "tempor deserunt"
        },
        {
            "flight": 3827,
            "type": "arrival",
            "airlines": "Housedown",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Mcgee",
            "destination": "Esmont",
            "departure": "Monday, January 26, 2015 10:57 AM",
            "arrival": "Monday, December 22, 2014 8:25 PM",
            "status": "earlier",
            "comment": "laborum adipisicing"
        },
        {
            "flight": 4670,
            "type": "depature",
            "airlines": "Icology",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Navarro",
            "destination": "Warren",
            "departure": "Monday, June 9, 2014 12:56 PM",
            "arrival": "Wednesday, February 4, 2015 2:46 AM",
            "status": "intime",
            "comment": "ut id"
        },
        {
            "flight": 3292,
            "type": "arrival",
            "airlines": "Geologix",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Little",
            "destination": "Walker",
            "departure": "Sunday, July 26, 2015 3:39 AM",
            "arrival": "Tuesday, June 23, 2015 9:56 AM",
            "status": "later",
            "comment": "nostrud esse"
        },
        {
            "flight": 5056,
            "type": "depature",
            "airlines": "Xyqag",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Dunn",
            "destination": "Sardis",
            "departure": "Wednesday, January 22, 2014 11:02 PM",
            "arrival": "Saturday, June 7, 2014 3:52 AM",
            "status": "earlier",
            "comment": "quis eu"
        },
        {
            "flight": 6725,
            "type": "depature",
            "airlines": "Cuizine",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Gibbs",
            "destination": "Beason",
            "departure": "Saturday, August 23, 2014 5:20 AM",
            "arrival": "Monday, March 9, 2015 11:20 AM",
            "status": "earlier",
            "comment": "sint incididunt"
        },
        {
            "flight": 6249,
            "type": "depature",
            "airlines": "Xerex",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Sweet",
            "destination": "Roderfield",
            "departure": "Monday, January 20, 2014 7:03 AM",
            "arrival": "Friday, February 6, 2015 7:50 AM",
            "status": "later",
            "comment": "labore elit"
        },
        {
            "flight": 7428,
            "type": "depature",
            "airlines": "Jetsilk",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Chen",
            "destination": "Maury",
            "departure": "Wednesday, August 27, 2014 4:31 PM",
            "arrival": "Saturday, July 12, 2014 3:59 PM",
            "status": "intime",
            "comment": "occaecat irure"
        },
        {
            "flight": 5387,
            "type": "depature",
            "airlines": "Chorizon",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Morris",
            "destination": "Lavalette",
            "departure": "Tuesday, April 28, 2015 8:04 AM",
            "arrival": "Saturday, January 17, 2015 12:36 AM",
            "status": "intime",
            "comment": "ex ullamco"
        },
        {
            "flight": 4592,
            "type": "depature",
            "airlines": "Yogasm",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Yang",
            "destination": "Hardyville",
            "departure": "Monday, June 29, 2015 6:20 PM",
            "arrival": "Friday, October 31, 2014 7:56 AM",
            "status": "earlier",
            "comment": "laborum amet"
        },
        {
            "flight": 8178,
            "type": "depature",
            "airlines": "Kindaloo",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Holder",
            "destination": "Mapletown",
            "departure": "Monday, September 22, 2014 11:03 AM",
            "arrival": "Saturday, February 7, 2015 1:18 PM",
            "status": "later",
            "comment": "ex et"
        },
        {
            "flight": 8696,
            "type": "depature",
            "airlines": "Ultrasure",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Wolfe",
            "destination": "Kimmell",
            "departure": "Sunday, July 20, 2014 4:32 AM",
            "arrival": "Wednesday, February 11, 2015 10:44 AM",
            "status": "intime",
            "comment": "duis cillum"
        },
        {
            "flight": 9791,
            "type": "depature",
            "airlines": "Uberlux",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Espinoza",
            "destination": "Belfair",
            "departure": "Monday, March 2, 2015 10:02 PM",
            "arrival": "Tuesday, September 23, 2014 1:15 AM",
            "status": "earlier",
            "comment": "nostrud occaecat"
        },
        {
            "flight": 7599,
            "type": "arrival",
            "airlines": "Hivedom",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Montoya",
            "destination": "Morningside",
            "departure": "Thursday, March 13, 2014 11:44 AM",
            "arrival": "Friday, February 7, 2014 1:27 AM",
            "status": "later",
            "comment": "aliquip est"
        },
        {
            "flight": 1879,
            "type": "arrival",
            "airlines": "Enormo",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Carr",
            "destination": "Stollings",
            "departure": "Sunday, October 26, 2014 2:23 AM",
            "arrival": "Thursday, January 16, 2014 3:55 PM",
            "status": "earlier",
            "comment": "est est"
        },
        {
            "flight": 9732,
            "type": "depature",
            "airlines": "Insurity",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Fisher",
            "destination": "Harrodsburg",
            "departure": "Thursday, April 30, 2015 12:37 AM",
            "arrival": "Friday, August 29, 2014 7:42 PM",
            "status": "later",
            "comment": "exercitation deserunt"
        },
        {
            "flight": 6400,
            "type": "arrival",
            "airlines": "Zilch",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Bullock",
            "destination": "Beyerville",
            "departure": "Sunday, April 5, 2015 2:53 PM",
            "arrival": "Saturday, February 7, 2015 11:17 PM",
            "status": "intime",
            "comment": "non veniam"
        },
        {
            "flight": 9608,
            "type": "arrival",
            "airlines": "Songbird",
            "logo": "http://randomimage.setgetgo.com/get.php?height=50&width=50&type=1",
            "planeType": "Rosa",
            "destination": "Genoa",
            "departure": "Saturday, April 5, 2014 9:21 PM",
            "arrival": "Tuesday, January 6, 2015 3:21 AM",
            "status": "earlier",
            "comment": "excepteur ad"
        }
    ];

    $('#flightRow').tmpl(flights).appendTo('#contentRow');





});

function digitalWatch() {
    var mydate = new Date(),
        offset =  document.getElementById("airportTime").dataset.timeOffset;
    mydate.setUTCMinutes(mydate.getMinutes()+ offset*60);
    var hours = mydate.getUTCHours();
    var minutes = mydate.getUTCMinutes();
    var seconds = mydate.getUTCSeconds();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("airportTime").innerHTML = hours + ":" + minutes + ":" + seconds;
    setTimeout("digitalWatch()", 1000);
}