/*jshint -W069 */
/*global angular:false, btoa */
angular.module('', [])
    .factory('clientSwagger', ['$q', '$http', '$rootScope', function($q, $http, $rootScope) {
        'use strict';

        /**
         * Move your app forward with the Uber API
         * @class clientSwagger
         * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
         * @param {string} [domainOrOptions.domain] - The project domain
         * @param {string} [domainOrOptions.cache] - An angularjs cache implementation
         * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
         * @param {string} [cache] - An angularjs cache implementation
         */
        var clientSwagger = (function() {
            function clientSwagger(options, cache) {
                var domain = (typeof options === 'object') ? options.domain : options;
                this.domain = typeof(domain) === 'string' ? domain : 'https://api.uber.com/v1';
                if (this.domain.length === 0) {
                    throw new Error('Domain parameter must be specified as a string.');
                }
                cache = cache || ((typeof options === 'object') ? options.cache : cache);
                this.cache = cache;
            }

            function mergeQueryParams(parameters, queryParameters) {
                if (parameters.$queryParameters) {
                    Object.keys(parameters.$queryParameters)
                        .forEach(function(parameterName) {
                            var parameter = parameters.$queryParameters[parameterName];
                            queryParameters[parameterName] = parameter;
                        });
                }
                return queryParameters;
            }

            /**
             * HTTP Request
             * @method
             * @name clientSwagger#request
             * @param {string} method - http method
             * @param {string} url - url to do request
             * @param {object} parameters
             * @param {object} body - body parameters / object
             * @param {object} headers - header parameters
             * @param {object} queryParameters - querystring parameters
             * @param {object} form - form data object
             * @param {object} deferred - promise object
             */
            clientSwagger.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
                var options = {
                    timeout: parameters.$timeout,
                    method: method,
                    url: url,
                    params: queryParameters,
                    data: body,
                    headers: headers
                };
                if (Object.keys(form).length > 0) {
                    options.data = form;
                    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    options.transformRequest = clientSwagger.transformRequest;
                }
                $http(options)
                    .then(function(data, status, headers, config) {
                        deferred.resolve(data);
                        if (parameters.$cache !== undefined) {
                            parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                        }
                    })
                    .catch(function(data, status, headers, config) {
                        deferred.reject({
                            status: status,
                            headers: headers,
                            config: config,
                            body: data
                        });
                    });

            };

            clientSwagger.prototype.$on = function($scope, path, handler) {
                var url = this.domain + path;
                $scope.$on(url, function() {
                    handler();
                });
                return this;
            };

            clientSwagger.prototype.$broadcast = function(path) {
                var url = this.domain + path;
                //cache.remove(url);
                $rootScope.$broadcast(url);
                return this;
            };

            clientSwagger.transformRequest = function(obj) {
                var str = [];
                for (var p in obj) {
                    var val = obj[p];
                    if (angular.isArray(val)) {
                        val.forEach(function(val) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
                        });
                    } else {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
                    }
                }
                return str.join("&");
            };

            /**
             * The Products endpoint returns information about the *Uber* products
            offered at a given location. The response includes the display name
            and other details about each product, and lists the products in the
            proper display order.

             * @method
             * @name clientSwagger#getProducts
             * @param {object} parameters - method options and parameters
                 * @param {number} parameters.latitude - Latitude component of location.
                 * @param {number} parameters.longitude - Longitude component of location.
             */
            clientSwagger.prototype.getProducts = function(parameters) {
                if (parameters === undefined) {
                    parameters = {};
                }
                var deferred = $q.defer();
                var domain = this.domain,
                    path = '/products';
                var body = {},
                    queryParameters = {},
                    headers = {},
                    form = {};

                headers['Accept'] = ['application/json'];

                if (parameters['latitude'] !== undefined) {
                    queryParameters['latitude'] = parameters['latitude'];
                }

                if (parameters['latitude'] === undefined) {
                    deferred.reject(new Error('Missing required  parameter: latitude'));
                    return deferred.promise;
                }

                if (parameters['longitude'] !== undefined) {
                    queryParameters['longitude'] = parameters['longitude'];
                }

                if (parameters['longitude'] === undefined) {
                    deferred.reject(new Error('Missing required  parameter: longitude'));
                    return deferred.promise;
                }

                queryParameters = mergeQueryParams(parameters, queryParameters);

                this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

                return deferred.promise;
            };
            /**
             * The Price Estimates endpoint returns an estimated price range
            for each product offered at a given location. The price estimate is
            provided as a formatted string with the full price range and the localized
            currency symbol.<br><br>The response also includes low and high estimates,
            and the [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) currency code for
            situations requiring currency conversion. When surge is active for a particular
            product, its surge_multiplier will be greater than 1, but the price estimate
            already factors in this multiplier.

             * @method
             * @name clientSwagger#getEstimatesPrice
             * @param {object} parameters - method options and parameters
                 * @param {number} parameters.startLatitude - Latitude component of start location.
                 * @param {number} parameters.startLongitude - Longitude component of start location.
                 * @param {number} parameters.endLatitude - Latitude component of end location.
                 * @param {number} parameters.endLongitude - Longitude component of end location.
             */
            clientSwagger.prototype.getEstimatesPrice = function(parameters) {
                if (parameters === undefined) {
                    parameters = {};
                }
                var deferred = $q.defer();
                var domain = this.domain,
                    path = '/estimates/price';
                var body = {},
                    queryParameters = {},
                    headers = {},
                    form = {};

                headers['Accept'] = ['application/json'];

                if (parameters['startLatitude'] !== undefined) {
                    queryParameters['start_latitude'] = parameters['startLatitude'];
                }

                if (parameters['startLatitude'] === undefined) {
                    deferred.reject(new Error('Missing required  parameter: startLatitude'));
                    return deferred.promise;
                }

                if (parameters['startLongitude'] !== undefined) {
                    queryParameters['start_longitude'] = parameters['startLongitude'];
                }

                if (parameters['startLongitude'] === undefined) {
                    deferred.reject(new Error('Missing required  parameter: startLongitude'));
                    return deferred.promise;
                }

                if (parameters['endLatitude'] !== undefined) {
                    queryParameters['end_latitude'] = parameters['endLatitude'];
                }

                if (parameters['endLatitude'] === undefined) {
                    deferred.reject(new Error('Missing required  parameter: endLatitude'));
                    return deferred.promise;
                }

                if (parameters['endLongitude'] !== undefined) {
                    queryParameters['end_longitude'] = parameters['endLongitude'];
                }

                if (parameters['endLongitude'] === undefined) {
                    deferred.reject(new Error('Missing required  parameter: endLongitude'));
                    return deferred.promise;
                }

                queryParameters = mergeQueryParams(parameters, queryParameters);

                this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

                return deferred.promise;
            };
            /**
             * The Time Estimates endpoint returns ETAs for all products offered at a given location, with the responses expressed as integers in seconds. We recommend that this endpoint be called every minute to provide the most accurate, up-to-date ETAs.
             * @method
             * @name clientSwagger#getEstimatesTime
             * @param {object} parameters - method options and parameters
             * @param {number} parameters.startLatitude - Latitude component of start location.
             * @param {number} parameters.startLongitude - Longitude component of start location.
             * @param {string} parameters.customerUuid - Unique customer identifier to be used for experience customization.
             * @param {string} parameters.productId - Unique identifier representing a specific product for a given latitude & longitude.
             */
            clientSwagger.prototype.getEstimatesTime = function(parameters) {
                if (parameters === undefined) {
                    parameters = {};
                }
                var deferred = $q.defer();
                var domain = this.domain,
                    path = '/estimates/time';
                var body = {},
                    queryParameters = {},
                    headers = {},
                    form = {};

                headers['Accept'] = ['application/json'];

                if (parameters['startLatitude'] !== undefined) {
                    queryParameters['start_latitude'] = parameters['startLatitude'];
                }

                if (parameters['startLatitude'] === undefined) {
                    deferred.reject(new Error('Missing required  parameter: startLatitude'));
                    return deferred.promise;
                }

                if (parameters['startLongitude'] !== undefined) {
                    queryParameters['start_longitude'] = parameters['startLongitude'];
                }

                if (parameters['startLongitude'] === undefined) {
                    deferred.reject(new Error('Missing required  parameter: startLongitude'));
                    return deferred.promise;
                }

                if (parameters['customerUuid'] !== undefined) {
                    queryParameters['customer_uuid'] = parameters['customerUuid'];
                }

                if (parameters['productId'] !== undefined) {
                    queryParameters['product_id'] = parameters['productId'];
                }

                queryParameters = mergeQueryParams(parameters, queryParameters);

                this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

                return deferred.promise;
            };
            /**
             * The User Profile endpoint returns information about the Uber user that has authorized with the application.
             * @method
             * @name clientSwagger#getMe
             * @param {object} parameters - method options and parameters
             */
            clientSwagger.prototype.getMe = function(parameters) {
                if (parameters === undefined) {
                    parameters = {};
                }
                var deferred = $q.defer();
                var domain = this.domain,
                    path = '/me';
                var body = {},
                    queryParameters = {},
                    headers = {},
                    form = {};

                headers['Accept'] = ['application/json'];

                queryParameters = mergeQueryParams(parameters, queryParameters);

                this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

                return deferred.promise;
            };
            /**
             * The User Activity endpoint returns data about a user's lifetime activity with Uber. The response will include pickup locations and times, dropoff locations and times, the distance of past requests, and information about which products were requested.<br><br>The history array in the response will have a maximum length based on the limit parameter. The response value count may exceed limit, therefore subsequent API requests may be necessary.
             * @method
             * @name clientSwagger#getHistory
             * @param {object} parameters - method options and parameters
             * @param {integer} parameters.offset - Offset the list of returned results by this amount. Default is zero.
             * @param {integer} parameters.limit - Number of items to retrieve. Default is 5, maximum is 100.
             */
            clientSwagger.prototype.getHistory = function(parameters) {
                if (parameters === undefined) {
                    parameters = {};
                }
                var deferred = $q.defer();
                var domain = this.domain,
                    path = '/history';
                var body = {},
                    queryParameters = {},
                    headers = {},
                    form = {};

                headers['Accept'] = ['application/json'];

                if (parameters['offset'] !== undefined) {
                    queryParameters['offset'] = parameters['offset'];
                }

                if (parameters['limit'] !== undefined) {
                    queryParameters['limit'] = parameters['limit'];
                }

                queryParameters = mergeQueryParams(parameters, queryParameters);

                this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

                return deferred.promise;
            };

            return clientSwagger;
        })();

        return clientSwagger;
    }]);