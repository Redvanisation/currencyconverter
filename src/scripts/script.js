fetch('https://free.currencyconverterapi.com/api/v5/countries')
.then(res => res.json())
.then(res =>  {
	const countries = res.results
	for (let country in countries) {
		// console.log(countries[country].currencyName);
		if (countries[country].currencyId == "USD") {
			let addOption = `<option selected>(${countries[country].currencyId}) ${countries[country].currencyName}</option>`;
			const from = document.querySelector('#from').innerHTML += addOption;
		} else {
			let addOption = `<option>(${countries[country].currencyId}) ${countries[country].currencyName}</option>`;
			const from = document.querySelector('#from').innerHTML += addOption;
			const to = document.querySelector('#to').innerHTML += addOption;
	}
	}
})
.catch((err) => alert('Failed!'))