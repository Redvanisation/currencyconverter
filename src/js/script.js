// Getting the swipe currencies button and the UI divs for the currencies and the inputs
const swipe = document.querySelector('#euro');
const box1 = document.querySelector('#box1'); 
const box2 = document.querySelector('#box2');

// Getting the inputs and storing them into variables
const amoutInput = document.querySelector('#amount-input');
const resultInput = document.querySelector('#result-input');


// Creating a state variable to use it for swiping the currencies
let state = 0;


// swiping the currencies in the UI using flex box order properties

const swipeThem = () => {
	if (state) {
		box1.setAttribute('style', 'order: 1');
		box2.setAttribute('style', 'order: 0');
	} else {
		box1.setAttribute('style', 'order: 0');
		box2.setAttribute('style', 'order: 1');
	}
}

// putting an event listener on the swipe button to change the state and call the swipe function
swipe.addEventListener('click', () => {
	!state ? state = 1 : state = 0 ;

	swipeThem();
});





// Calling the API to get the currencies list, their symbols & codes
fetch('https://free.currencyconverterapi.com/api/v5/currencies', {
	method: 'get',
    headers: {'Content-Type': 'application/json'}
})
.then(res => res.json())
.then(res =>  {
	const currencies = res.results;
	for (let currency in currencies	) {
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
})
.catch((err) => console.log('There has been an error!'));


// Creating the conversion function and features:

const convertCurrency = () => {
	// Getting the input values and storing them in variables
	const from = document.querySelector('#from').value;
	const to = document.querySelector('#to').value;
	const amount = amoutInput.value;
	const theResult = resultInput.value;

	// storing the exchange rate formats into variables for later use
	const dbFrom = `${from}_${to}`;
	const dbTo = `${to}_${from}`;

	// defining the DB
	const db = new Dexie("rates_database");
          db.version(1).stores({
			  from: 'id, rate',
			//   to: 'id, rate'
          });

    // Sending an API call to fetch the conversion rates using the variables
	fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to},${to}_${from}`, {
		method: 'get',
		headers: {'Content-Type': 'application/json'}
	})
	.then(resp => resp.json())
	.then(result => {

		// storing the currencies into variables to store them into the database
		const fromC = [result.results[`${from}_${to}`].id, result.results[`${from}_${to}`].val];
		
		const toC = [result.results[`${to}_${from}`].id, result.results[`${to}_${from}`].val];
		

          // populating and closing the DB
		  db.from.put({ id: fromC[0], rate: fromC[1] })
		  db.from.put({ id: toC[0], rate: toC[1] })
		
		  .then(() => db.close())

		// Storing the rate in a variable after multiplying it by the number given by the user in the amount and the result inputs
		const conversion = fromC[1] * amount;

		const conversionO = toC[1] * theResult;

		// Showing the result on the result or the amout input after limiting it to two decimal numbers
		  
		if (!state) {
			resultInput.value = conversion.toFixed(2);
			// amoutInput.value.toFixed();
		} else if (state) {
			amoutInput.value = conversionO.toFixed(2);
			// resultInput.value.toFixed();
		}

	}).catch(() => {
		// opening the database
		db.open().
		then(data => 
			{ 
				// making a promise.all call to get both the exchange rate values from the two promises at the same time from the database
				Promise.all([db.from.get(dbFrom), db.from.get(dbTo)])
				.then((value) => {

					// storing the values rates into variables
					const rateFrom = value[0].rate;
					const rateTo = value[1].rate;

					// checking if the state is = 0 then using the amount input as input and the result input as result and if state = 1 then do the opposite (checking if value, amount and theResult are not empty too)
					if (!state && value && amount && theResult) {
					
						resultInput.value = (rateFrom * amount).toFixed(2);
					
					} else if (state && value && amount && theResult) {
					
						amoutInput.value = (rateTo * theResult).toFixed(2);
					
					}
				})
			})
	})          		
}