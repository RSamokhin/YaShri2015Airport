var request = require('sync-request'),
    models = require("../models")(),
    url = require('url'),
    parse = require('co-body');



module.exports.requestAirport = function * (airport, year, month, day, hour) {

    var self = this,
        urlDep = 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/' +
            airport + '/' +
            'dep' + '/' +
            year + '/' +
            month + '/' +
            day  + '/' +
            hour + '/?appId=01e8e01e&appKey=1d0c14aeebb6875e849b703c8863c724&utc=false&numHours=6',
        urlArr = 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/' +
            airport + '/' +
            'arr' + '/' +
            year + '/' +
            month + '/' +
            day  + '/' +
            hour + '/?appId=01e8e01e&appKey=1d0c14aeebb6875e849b703c8863c724&utc=false&numHours=5',
        result = [];
    function getFormatedAirportData (url) {
        var result = [],
            res = ~(url).indexOf('/arr/') ? models.svoarr() : models.svodep(), //JSON.parse(request('GET', url).getBody('utf8')),
            flightStatuses = res.flightStatuses,
            airlines = models.airlines(),
            airports = res.appendix.airports,
            equipments = res.appendix.equipments;
        flightStatuses.forEach(function (flight) {
            var departureAirport = airports.filter(function (airport) {
                    return  flight.departureAirportFsCode === airport.fs;
                })[0],
                arrivalAirport = airports.filter(function (airport) {
                    return  flight.arrivalAirportFsCode === airport.fs;
                })[0],
                rflight = {
                    type: (airport === flight.arrivalAirportFsCode) ? 'arrival' : 'departure',
                    flight: flight.carrierFsCode + flight.flightNumber,
                    codeshares: flight.codeshares ? flight.codeshares.map(function (share) {
                        return share.fsCode + share.flightNumber;
                    }) : [],
                    carrierFsCode: flight.carrierFsCode,
                    carrier: airlines.filter(function (carrier) {
                        return carrier.fs === flight.carrierFsCode
                    })[0].name,
                    departureAirportFsCode: flight.departureAirportFsCode,
                    departureAirportCountry: departureAirport.countryName,
                    departureAirportCity: departureAirport.city,
                    departureAirportName: departureAirport.name,
                    arrivalAirportFsCode: flight.arrivalAirportFsCode,
                    arrivalAirportCountry: arrivalAirport.countryName,
                    arrivalAirportCity: arrivalAirport.city,
                    arrivalAirportName: arrivalAirport.name,
                    departureDate: flight.departureDate.dateLocal,
                    arrivalDate: flight.arrivalDate.dateLocal,
                    time: (airport === flight.arrivalAirportFsCode) ? (function () {
                        var tdate = new Date(flight.arrivalDate.dateLocal);
                        return (tdate.getUTCHours() > 9 ? tdate.getUTCHours() : '0' + tdate.getUTCHours().toString())+':'+(tdate.getUTCMinutes() > 9 ? tdate.getUTCMinutes() :  '0'+ tdate.getUTCMinutes().toString());
                    })(): (function () {
                        var tdate = new Date(flight.departureDate.dateLocal);
                        return (tdate.getUTCHours() > 9 ? tdate.getUTCHours() : '0' + tdate.getUTCHours().toString())+':'+(tdate.getUTCMinutes() > 9 ? tdate.getUTCMinutes() :  '0'+ tdate.getUTCMinutes().toString());
                    })(),
                    status: (function () {
                        var status = '';
                        switch (flight.status) {
                            case 'A':
                                return 'Active';
                                break;
                            case 'C':
                                return 'Canceled';
                                break;
                            case 'D':
                                return 'Diverted';
                                break;
                            case 'DN':
                                return 'Data source needed';
                                break;
                            case 'L':
                                return 'Landed';
                                break;
                            case 'NO':
                                return 'Not Operational';
                                break;
                            case 'R':
                                return 'Redirected';
                                break;
                            case 'S':
                                return 'Scheduled';
                                break;
                            case 'U':
                                return 'Unknown';
                                break;
                        }
                    }) (),
                    flightEquipmentCode: flight.flightEquipment ? flight.flightEquipment.scheduledEquipmentIataCode : '-',
                    flightEquipment: (function () {
                        var eq = flight.flightEquipment ? equipments.filter(function (equipement) {
                            return equipement.iata === flight.flightEquipment.scheduledEquipmentIataCode
                        }) : [];
                        return (eq.length > 0) ? eq[0].name : '-';
                    }) (),
                    tailNumber: flight.flightEquipment ? flight.flightEquipment.tailNumber : '-',
                    arrivalTerminal: flight.airportResources ? flight.airportResources.arrivalTerminal : null,
                    departureTerminal: flight.airportResources ? flight.airportResources.departureTerminal : null,
                    terminal: (airport === flight.arrivalAirportFsCode) ? (flight.airportResources ? flight.airportResources.arrivalTerminal : null) : ( flight.airportResources ? flight.airportResources.departureTerminal : null),
                    estimatedGateDeparture: flight.operationalTimes.estimatedGateDeparture ? flight.operationalTimes.estimatedGateDeparture.dateLocal : null,
                    actualGateDeparture: flight.operationalTimes.actualGateDeparture ? flight.operationalTimes.actualGateDeparture.dateLocal : null,
                    estimatedGateArrival: flight.operationalTimes.estimatedGateArrival ? flight.operationalTimes.estimatedGateArrival.dateLocal : null,
                    actualGateArrival: flight.operationalTimes.actualGateArrival ? flight.operationalTimes.actualGateArrival.dateLocal : null
                };
            rflight.codeshares.push(flight.carrierFsCode + flight.flightNumber);
            result.push(rflight);
            if (flight.codeshares) {
                flight.codeshares.forEach(function (share) {
                    var cFlight = JSON.parse(JSON.stringify(rflight));
                    cFlight.flight = share.fsCode + share.flightNumber;
                    cFlight.carrierFsCode = share.fsCode;
                    cFlight.carrier = airlines.filter(function (carrier) {
                        return carrier.fs === share.fsCode;
                    })[0].name;
                    result.push(cFlight);
                });
            }
        });
        return result;
    };
    result = result.concat(getFormatedAirportData(urlArr)).concat(getFormatedAirportData(urlDep)).sort(function (a, b) {
        var dateA = (a.type === 'arrival') ? new Date(a.arrivalDate) : new Date(a.departureDate);
        var dateB = (b.type === 'arrival') ? new Date(b.arrivalDate) : new Date(b.departureDate);
        return dateA - dateB;
    });
    this.body = result;

};

module.exports.requestAirports = function * () {
    this.body = models.airports();
};

module.exports.requestAirportsFilter = function * (p) {
    var queryData = url.parse(this.url, true).query,
        airports = models.airports();
    Object.keys(queryData).forEach(function (param) {
        airports = airports.filter(function (el) {
            return el[param] !== undefined && ~el[param].toLowerCase().indexOf(queryData[param].toLowerCase());
        });
    });
    if (typeof p === 'string') {
        var result = {};
        airports.map(function (el) {
            var value = el[p];
            if (value !== undefined || ~Object.keys(el).indexOf(p))
                result[value] = result[value] !== undefined ?  result[value]+1 : 1;
        });
        airports = Object.keys(result).map(function (key) {
            return {
                name: key,
                count: result[key]
            }
        });
    }
    this.body = airports;
};