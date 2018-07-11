'use strict';

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
	// Getting the currency values and storing them in variables
	var from = document.querySelector('#from').value;
	var to = document.querySelector('#to').value;
	var amount = document.querySelector('#amount-input').value;

	var dbFrom = from + '_' + to;

	// defining the DB
	var db = new Dexie("rates_database");
	db.version(1).stores({
		from: 'id, rate'
	});

	// Sending an API call to fetch the conversion rates using the variables
	fetch('https://free.currencyconverterapi.com/api/v5/convert?q=' + from + '_' + to + ',' + to + '_' + from, {
		method: 'get',
		headers: { 'Content-Type': 'application/json' }
	}).then(function (resp) {
		return resp.json();
	}).then(function (result) {

		var fromC = [result.results[from + '_' + to].id, result.results[from + '_' + to].val];

		// populating the DB
		db.from.put({ id: fromC[0], rate: fromC[1] })

		// reading the DB data
		.then(function (data) {
			return db.from.get(fromC[0]);
		}).then(function () {
			return db.close();
		});

		// Storing the rate in a variable after multiplying it by the number given by the user in the amount input 
		var conversion = result.results[from + '_' + to].val * amount;

		// Showing the result on the result input after limiting it to three decimal numbers

		document.querySelector('#result-input').value = conversion.toFixed(3);
	}).catch(function () {
		db.open().then(function (data) {
			return db.from.get(dbFrom);
		}).then(function (value) {
			var dbConv = value.rate * amount;
			document.querySelector('#result-input').value = dbConv.toFixed(3);
		});
	});
};