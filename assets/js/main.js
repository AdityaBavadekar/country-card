
const COUNTRIES_URL = "https://restcountries.com/v3.1/all?fields=name,flags";
var countriesCount = 0;
var countries = [];
const countriesHolder = document.getElementById('country-results');

runFetch();

function renderCountry(name, code, src){
    const countryElement = `
        <a href="/country.html?country=${name}" class="search-result-link">
            <div class="search-result country-result">
                <div class="scrim">
                    <img src="${src}" alt="flag" class="country-flag" data-img>
                </div>
                <div class="country-text">
                    <p class="country-name">${name}</p>
                    <p class="country-code op6">${code.toUpperCase()}</p>
                </div>
            </div>
        </a>
        `
    countriesHolder.innerHTML += countryElement;

}

function runFetch(){
    fetch(COUNTRIES_URL)
    .then(response => response.json())
    .then(data => onFetchSuccess(data));
}

function onFetchSuccess(data){
        countriesCount = data.length;
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const countryName = element.name.common.replace('\n','');
            const flagSrc = element.flags.png;
            const countryCode = flagSrc.split('/').at(-1).replace('.png',''); 
            
            const item = {
                name:countryName,
                code:countryCode,
                flagDescription:element.flags.alt,
                flagSrc:flagSrc,
            }
            countries.push(item)
            renderCountry(item.name, item.code, item.flagSrc);
        }
        startCouting();
};

function startCouting(){
    const increment_ratio = 200;
    const counters = document.querySelectorAll('[data-final-count]');
    counters.forEach (counter => {
        const dataName = counter.getAttribute('data-name')
        var final_count = 0;
        if (dataName == 'countries'){
            final_count = countriesCount;
        }else{
            final_count = parseInt(counter.getAttribute('data-final-count'), 10);
        }
        const increment = final_count / increment_ratio;

        let current_count = 0;
        const interval = setInterval(() => {
            current_count += increment;

            if (current_count >= final_count){
                current_count = final_count;
                clearInterval(interval);
            }
            counter.textContent = Math.ceil(current_count);

        }, 10)
    });
}

const searchInput = document.getElementById('search-input');
const searchBoxButton = document.querySelector('.search-box > button');
const searchBoxIcon = document.querySelector('.search-box > button > i');
searchInput.addEventListener('input', (q) => onInputChanged(q.target.value));

function onInputChanged(q){
    console.log(q);
    const query = q.toLowerCase();
    countriesHolder.innerHTML = "";
    
    var countries_copy = [];
    var clearIcon = true;
    if (query == ""){
        countries_copy = countries;
        clearIcon = false;
    }else{
        countries_copy = countries.filter((country) => {return country.name.toLowerCase().includes(query) || country.code == query || query == ""}).sort((a,b) => {
            if (a.name.toLowerCase() == query || a.code.toLowerCase() == query) {
                return -1;
            }
            else if (b.name.toLowerCase() == query || b.code.toLowerCase() == query) {
                return 1;
            }else{
                const lena = a.name.toLowerCase().length - query.length;
                const lenb = b.name.toLowerCase().length - query.length;
                return Math.max(lena, lenb) - Math.min(lena, lenb)
            }
        });
    }
    
    countries_copy.forEach((country) => renderCountry(country.name, country.code, country.flagSrc));
    if (clearIcon) {
        searchBoxIcon.classList = ['ri-close-large-line'];
    }else{
        searchBoxIcon.classList = ['ri-search-line'];
    }
};

searchBoxButton.addEventListener('click', () => {
    if (searchBoxIcon.classList.contains('ri-close-large-line')) {
        searchInput.value = "";
        onInputChanged(searchInput.value)
    }
});