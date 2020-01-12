const axios = require('axios')
var base64 = require('base-64')
const qs = require('querystring')

exports.searchItem = function () {

  const url = 'https://api.ebay.com/buy/browse/v1/item_summary/search'

  const requestHeaders = {
    headers: {
      'Authorization': 'Bearer ' + 'v^1.1#i^1#p^1#I^3#r^0#f^0#t^H4sIAAAAAAAAAOVYW2wUVRjutrvF5aIxXAOGrFMIic3MzszObmeH7pql3dINpRe2rVCDeGbmDD12dmaYmaW7JSZLTUAj4cEo0SCRqkQTH4AHLwHvQPCBPgjxhmi8QKyRYDTYqjGpM7NL2VbSIt1gE/dlM//5z3++7/v//5wzQ+Yqvfftatw1Ms81q/xgjsyVu1zUHNJb6am+s6J8qaeMLHJwHcytyLn7K4ZqDZCSNW4DNDRVMaAvk5IVg3OMESytK5wKDGRwCkhBgzMFLhlb38TRBMlpumqqgipjvkR9BAsyQoAJBgEfBqIgkqJlVa7FbFcjGC8JAkvRYQhgTUii7XHDSMOEYphAMSMYTdIkTlI4RbdTYS4Q4BiGCJKBLszXCXUDqYrlQpBY1IHLOXP1IqyTQwWGAXXTCoJFE7GGZEssUR9vbq/1F8WKFnRImsBMG+Of6lQR+jqBnIaTL2M43lwyLQjQMDB/NL/C+KBc7BqYW4DvSC0wIUDxLEsykIY1TLAkUjaoegqYk+OwLUjEJceVg4qJzOxUilpq8I9AwSw8NVshEvU++68tDWQkIahHsPia2KZYaysWrVPzJHBNRwI0dYC3bqjHJZbm+RADAU5DVhRZyBQWykcryDxhJSuUiGzRDF+zaq6BFmo4URu6SBvLqUVp0WOSaSMq8qOpgoZM2PLzX8ti2uxW7LzClCWEz3mcOgNjs01TR3zahGMRJg44EkUwoGlIxCYOOrVYKJ+MEcG6TVPj/P7e3l6iN0Co+lY/TZKUf+P6pqTQDVMAs3ztXs/7o6kn4MihIkBrpoE4M6tZWDJWrVoAlK1YlCFDZDhY0H08rOhE6z8MRZz94zuiVB3Cs4APMiLgQwFaEBmpFB0SLRSp38YBeZDFU0DvgaYmAwHiglVn6RTUkcgFghIdYCWIi6GwhDNhScL5oBjCKQlCEkKeF8Ls/6lRbrbUk1DQoVmSWi9ZnTfU+/k1fes29WWz27Z1aNVafANV3SE0wBYQWxuG3WwykamW050h1Bu52W64MXlB1WCrKiMhWwIF7F4voQoBXWwFuplNQlm2DNMiathEZ1aS7fmGFQBoiLAbmxDUlF8F1o5um7Y4iKfFOaZpiVQqbQJehonS7Ob/0U5+Q3rIuuvMKE5W/vKJRGL+kkI42SSM7QKhQ0NN69b9jGixz+x2tQcq1g5o6qosQ72Tmnaib3d+7V6fQo9/eVjcGvfS3VRmUm0LMrJKaMtMY3ZbMorADDuNqWANywZrQvT0eNU5OW3PzrRzqFE1TChORs299hav1f7xL/nRMudH9bteJ/tdR8tdLtJPrqSqyHsrKzrcFXOXGsiEBAISYaCtivXuqkOiB2Y1gPTyShd66uzuT4o+KxzcTC4Z+7DgraDmFH1lIO+5PuKh7lo8z5aEoqlwIMAwXWTV9VE3tci9YPbIoZ3n9laFPE/+PPjeSZlBX65YSM4bc3K5PGXuflcZ+dKDT3Q1LJzlnX/xoe0HBnfe7VVH3cLw6cqmupb4A/GPhi5vDpZXnJl/9u1cdl9u//JFy47jQ9k9F74LD5ziL594+MLedwbO1WaefebSMepw29fbO8/X/nila0Ae+f2v80T/6dQ3hxt7O44P7X5KOXnxxbVqJjr70qF421vLHn010jZw6LFj/OoD6ik89ty6x8/k+pZsfE09P/z51WVHfv3UuzpOJ+5oZgV1uEra1/rLyLnRN8Mvfzx6IeF6evX9i9HwV40fjGaeX/7K0Z9C7zat+oP3eHuMwKpv9eU/XFlCdXHyfg+sHlTmXv1+wZ6lL7zx4ft1O/78jD0ytHiHGunbHRiM/zbwxcrUiXz6/gYztgLN8BEAAA=='
    }
  }

  const queryParameters = {
    params: {
      q: 'iphone,11,a2223',
      sort: 'price',
    }
  }

  axios.get(url, queryParameters)
  .then((res) => {
    //console.log('statusCode: ' + res.statusCode)
    console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })
};
