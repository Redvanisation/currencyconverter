'use strict';

// Getting the swipe currencies button and the UI divs for the currencies and the inputs
var swipe = document.querySelector('#euro');
var box1 = document.querySelector('#box1');
var box2 = document.querySelector('#box2');

// Getting the inputs and storing them into variables
var amoutInput = document.querySelector('#amount-input');
var resultInput = document.querySelector('#result-input');

// Creating a state variable to use it for swiping the currencies
var state = 0;

// swiping the currencies in the UI using flex box order properties

var swipeThem = function swipeThem() {
	if (state) {
		box1.setAttribute('style', 'order: 1');
		box2.setAttribute('style', 'order: 0');
	} else {
		box1.setAttribute('style', 'order: 0');
		box2.setAttribute('style', 'order: 1');
	}
};

// putting an event listener on the swipe button to change the state and call the swipe function
swipe.addEventListener('click', function () {
	!state ? state = 1 : state = 0;

	swipeThem();
});

// Calling the API to get the currencies list, their symbols & codes
fetch('https://free.currencyconverterapi.com/api/v5/currencies', {
	method: 'get',
	headers: { 'Content-Type': 'application/json' }
}).then(function (res) {
	return res.json();
}).then(function (res) {
	var currencies = res.results;
	for (var currency in currencies) {
		// Checking if the currency has a symbol in the API or not and if so show it on the list:
		if (currencies[currency].currencySymbol) {
			var addOption = '<option class="option" value="' + currencies[currency].id + '">' + currencies[currency].id + ' ' + currencies[currency].currencySymbol + '| ' + currencies[currency].currencyName + '</option>';
			var from = document.querySelector('#from').innerHTML += addOption;
			var to = document.querySelector('#to').innerHTML += addOption;
		} else {
			var _addOption = '<option class="option" value="' + currencies[currency].id + '">' + currencies[currency].id + ' | ' + currencies[currency].currencyName + '</option>';
			var _from = document.querySelector('#from').innerHTML += _addOption;
			var _to = document.querySelector('#to').innerHTML += _addOption;
		}
	}
}).catch(function (err) {
	return console.log('There has been an error!');
});

// Creating the conversion function and features:

var convertCurrency = function convertCurrency() {
	// Getting the input values and storing them in variables
	var from = document.querySelector('#from').value;
	var to = document.querySelector('#to').value;
	var amount = amoutInput.value;
	var theResult = resultInput.value;

	// storing the exchange rate formats into variables for later use
	var dbFrom = from + '_' + to;
	var dbTo = to + '_' + from;

	// defining the DB
	var db = new Dexie("rates_database");
	db.version(1).stores({
		from: 'id, rate'
		//   to: 'id, rate'
	});

	// Sending an API call to fetch the conversion rates using the variables
	fetch('https://free.currencyconverterapi.com/api/v5/convert?q=' + from + '_' + to + ',' + to + '_' + from, {
		method: 'get',
		headers: { 'Content-Type': 'application/json' }
	}).then(function (resp) {
		return resp.json();
	}).then(function (result) {

		// storing the currencies into variables to store them into the database
		var fromC = [result.results[from + '_' + to].id, result.results[from + '_' + to].val];

		var toC = [result.results[to + '_' + from].id, result.results[to + '_' + from].val];

		// populating and closing the DB
		db.from.put({ id: fromC[0], rate: fromC[1] });
		db.from.put({ id: toC[0], rate: toC[1] }).then(function () {
			return db.close();
		});

		// Storing the rate in a variable after multiplying it by the number given by the user in the amount and the result inputs
		var conversion = fromC[1] * amount;

		var conversionO = toC[1] * theResult;

		// Showing the result on the result or the amout input after limiting it to two decimal numbers

		if (!state) {
			resultInput.value = conversion.toFixed(2);
			// amoutInput.value.toFixed();
		} else if (state) {
			amoutInput.value = conversionO.toFixed(2);
			// resultInput.value.toFixed();
		}
	}).catch(function () {
		// opening the database
		db.open().then(function (data) {
			// making a promise.all call to get both the exchange rate values from the two promises at the same time from the database
			Promise.all([db.from.get(dbFrom), db.from.get(dbTo)]).then(function (value) {

				// storing the values rates into variables
				var rateFrom = value[0].rate;
				var rateTo = value[1].rate;

				// checking if the state is = 0 then using the amount input as input and the result input as result and if state = 1 then do the opposite (checking if value, amount and theResult are not empty too)
				if (!state && value && amount && theResult) {

					resultInput.value = (rateFrom * amount).toFixed(2);
				} else if (state && value && amount && theResult) {

					amoutInput.value = (rateTo * theResult).toFixed(2);
				}
			});
		});
	});
};