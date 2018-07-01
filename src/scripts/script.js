// Calling the API to get the currencies list, their symbols & codes
fetch('https://free.currencyconverterapi.com/api/v5/currencies', {
	method: 'get',
    headers: {'Content-Type': 'application/json'}
})
.then(res => res.json())
.then(res =>  {
	const currencies = res.results;
	for (let currency in currencies	) {
		// making the the default currency as EURO
		if (currencies[currency].id == "EUR") {
			let addOption = `<option class="option" value="${currencies[currency].id}" selected>${currencies[currency].id} ${currencies[currency].currencySymbol} | ${currencies[currency].currencyName}</option>`;
			const from = document.querySelector('#from').innerHTML += addOption;
		} else if (currencies[currency].id == "USD"){
			// Making the default currency to convert to is US Dollar
				let addOption = `<option class="option" value="${currencies[currency].id}" selected>${currencies[currency].id} ${currencies[currency].currencySymbol} | ${currencies[currency].currencyName}</option>`;
				const to = document.querySelector('#to').innerHTML += addOption;
		} else {
			// Checking if the currency has a symbol in the API or not and if so show it on the list:
				if (currencies[currency].currencySymbol) {
					let addOption = `<option class="option" value="${currencies[currency].id}">${currencies[currency].id} ${currencies[currency].currencySymbol}| ${currencies[currency].currencyName}</option>`;
					const from = document.querySelector('#from').innerHTML += addOption;
					const to = document.querySelector('#to').innerHTML += addOption;
				} else {
					let addOption = `<option class="option" value="${currencies[currency].id}">${currencies[currency].id} | ${currencies[currency].currencyName}</option>`;
					const from = document.querySelector('#from').innerHTML += addOption;
					const to = document.querySelector('#to').innerHTML += addOption;
				}
			}
	}
})
.catch((err) => console.log('There has been an error!'));

// Creating the conversion function and features:

const convertCurrency = () => {
	// Getting the currency values and storing them in variables
	const from = document.querySelector('#from').value;
	const to = document.querySelector('#to').value;
	const amount = document.querySelector('#amount-input').value;

	// Sending an API call to fetch the conversion rates using the variables
	fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra`)
	.then(resp => resp.json())
	.then(result => {

		// Storing the rate in a variable after multiplying it by the number given by the user in the amount input 
		const conversion = result[`${from}_${to}`] * amount;

		// Showing the result on the result input after limiting it to three decimal numbers
		document.querySelector('#result-input').value = conversion.toFixed(3);
	})
	.catch(err => console.log('Failed to convert!'))
}



