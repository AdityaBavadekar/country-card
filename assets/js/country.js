let countryName;

const url = window.location.href
const searchParams = new URLSearchParams(url.split('?')[1]);
const country = searchParams.get('country')
console.log("***************************");
console.log("Country Page : " + country);
console.log("***************************");

const reuqestEndpoint = `https://restcountries.com/v3.1/name/${country}?fullText=true`
const dialCodesContainer = document.getElementById('dial-codes-list');
const bordersContainer = document.getElementById('borders-list');

function appendDialCode(code){

    dialCodesContainer.innerHTML += `
    <div class="dial-code">
        <p class="dial-code-text" id="code-text">${code}</p>
    </div>`;
};

function appendBorderCountry(name, flagSrc){
    bordersContainer.innerHTML += `
    <a href="/country.html?country=${name}">
        <div class="border-country">
            <img src="${flagSrc}" alt="border country flag" class="border-country-img" id="border-country-img">
            <p class="border-country-text" id="border-country-text">${name}</p>
        </div>
    </a>`;
};

fetch(reuqestEndpoint)
    .then(response => response.json())
    .then(json => onCountryJsonFetched(json[0]));

function onCountryJsonFetched(data){
    var nativeName = "";
    const allNativeNames = data.name.nativeName;
    let index = 0;
    for (key in allNativeNames) {
        const element = allNativeNames[key];
        if (index > 0) {
            nativeName = element;
            break;
        }
        index += 1;
    }
    document.getElementById("country-name").innerHTML = `${data.name.common}`;
    if (nativeName && nativeName.common != data.name.common) {
        document.getElementById("country-name").innerHTML += `<br>${nativeName.common}`;
    }

    const countryCode = data.flags.png.split('/').at(-1).replace('.png','').toUpperCase();
    document.getElementById("country-code").innerHTML = `${countryCode}`;
    document.getElementById("country-official-name").innerHTML = `${data.name.official}`;
    if (nativeName) {
        document.getElementById("country-official-name").innerHTML += `<br>${nativeName.official}`;
    }

    var continents = "";
    for (let index = 0; index < data.continents.length; index++) {
        var pref = "";
        if (index > 0) pref = ", ";
        continents += pref + data.continents[index];
    }
    document.getElementById("continent").innerHTML = `${continents}`;
    document.getElementById("lat").innerHTML = `${data.latlng[0]}`;
    document.getElementById("long").innerHTML = `${data.latlng[1]}`;
    document.getElementById("map-url").href = `${data.maps.googleMaps}`;
    document.getElementById("timezone").innerHTML = `${data.timezones[0]} (${data.timezones.length})`;
    document.getElementById("flag-description").innerHTML = `${data.flags.alt}`;
    const imgElements = document.getElementsByClassName("country-flag")

    for (let index = 0; index < imgElements.length; index++) {
        imgElements[index].src = `${data.flags.png}`;
    }

    var currencyName = "";
    var currencySymbol = "";
        for (code in data.currencies) {
        const element = data.currencies[code];
        currencyName = element.name;
        currencySymbol = element.symbol;
    }

    document.getElementById("currency-name").innerHTML = `${currencyName}`;
    document.getElementById("currency-symbol").innerHTML = `${currencySymbol}`;
    document.getElementById("capital").innerHTML = `${data.capital[0]}`;
    const fomattedPopulationCount = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
        data.population,
    );
    document.getElementById("population-count").innerHTML = `${fomattedPopulationCount}`;

    const urlSuffixes = data.tld;
    const dialCodeRootPrefix = data.idd.root;
    for (let index = 0; index < data.idd.suffixes.length; index++) {
        const element = data.idd.suffixes[index];
        appendDialCode(dialCodeRootPrefix + element);
    }

    const personNameF = data.demonyms.eng.f
    const personNameM = data.demonyms.eng.m
    if (personNameF == personNameM) {
        document.getElementById("native-person-name").innerHTML = `${personNameF}`;
    }else{        
        document.getElementById("native-person-name").innerHTML = `${personNameM} (male), ${personNameF} (female)`;
    };

    if (data.hasOwnProperty('borders')){
        for (let index = 0; index < data.borders.length; index++) {
            const element = data.borders[index];
            fetch(`https://restcountries.com/v3.1/alpha/${element}?fields=name,flags`)
            .then(response => response.json())
            .then(borderCountry => appendBorderCountry(borderCountry.name.common, borderCountry.flags.png));
        }
    }
    console.log("Closing Loader...");
    document.querySelector('dialog').close();
}

fetch("/assets/data/final_dump.json")
    .then(response => response.json())
    .then(json => onSummaryJsonFetched(json));

function onSummaryJsonFetched(data){
    for (const key in data) {
        if (key.toLowerCase() == country.toLowerCase() && Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            document.getElementById('country-description').innerText = element
            console.log("Summary Presented");
        }
    }
}