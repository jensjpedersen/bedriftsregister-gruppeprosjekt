import { kommunenummer } from './data/kommunenummer.mjs'


const baseUrl = "https://data.brreg.no/enhetsregisteret/api/enheter?"


function formatUrl(baseUrl, kommunenummer, year, page=0) {
    const url = `${baseUrl}kommunenummer=${kommunenummer}&size=100&page=${page}&
fraStiftelsesdato=${year}-01-01&tilStiftelsesdato=${year}-12-31`
    return url
}


async function fetchData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

/**
  * Get selected value from dropdown 
  * TODO - implement userinput
  */ 
function getSelected() {
    return {
        kommune: 'Skien', 
        year: 2020};
}



function getKommunenummer(kommune) {
    const nummer = kommunenummer[kommune]

    if (nummer === undefined) {
        throw new Error(`${kommune} finnes ikke`)
    }

    return nummer
    
}

/**
  * parameters:
  * obj - object with value that should be returned 
  * args - keys. Where arg0 corresponds to outer nesting
  *         arg1, arg2, ..., argn - Corresponds to n-th nested level in obj. 
  */
function getNestedValue(obj, keysArr) {
    const value = keysArr.reduce((obj, level) => obj && obj[level], obj) 
    if (value) { return value }
    throw new Error('Keyerror: not valid key')
}




function displayTableHeader(domContainer) {
    domContainer.innerHTML = `
        <div class="firmanavn">Firmanavn</div>
        <div class="stiftelsesar">Stiftelsesår</div>
        <div class="orgnr">Orgnr</div>
    `;

}


function display(domContainer, content, elementType, className) {
    const element = document.createElement(elementType); 
    element.className = className;
    element.textContent = content;
    domContainer.appendChild(element);
}


function displayBedData(domContainer, data, ...args) {

    if (arguments.length <= 1) {
        throw new Error('Requires at least two argument')
    }

    if ( typeof data !== 'object') {
        throw new Error('First argument must be an object')
    }

    const keyArray = args.map(arg => arg.split('.')); // Array with keys in bedriftsdata


    data.forEach((bedrift) => { 
        keyArray.forEach(key => {
            display(domContainer, getNestedValue(bedrift, key), 'div', 'item')
        })
    })

}



function submitPressed() {
    // callback function for submit button
    // get data from input fields
    // call main function with data
}

function createPageination(totalPages, currentPage) {
    // TODO: remembe page on refresh
    console.log(totalPages, currentPage);

    // const pageinationContainer = document.getElementById('pageination-container');
    const pageinationContainer = document.getElementsByClassName('pageination-container')[0];
    console.log(pageinationContainer);

    pageinationContainer.innerHTML = '<button>&laquo</button>'

    for (let i = 0; i < totalPages; i++) {
        const page = document.createElement('button');
        page.textContent = i+1;
        page.addEventListener('click', () => {
            main(i);

            console.log(`Page ${i} clicked`);
            // document.getElementById('table-container').scrollIntoView();
            // window.scrollTo(0, 0);
        });

        pageinationContainer.appendChild(page);




    }

    // XXX: Overwrites callback from above
    // pageinationContainer.innerHTML +='<button>&raquo</button>'

    const next = document.createElement('button');
    next.innerHTML = '&raquo';
    next.addEventListener('click', () => {
        console.log('next');
    });
    pageinationContainer.appendChild(next);



}


async function main(page=0) {


    // Get data
    const { kommune, year } = getSelected();
    const kommunenummer = getKommunenummer(kommune)
    const url = formatUrl(baseUrl, kommunenummer, year, page)
    const data = await fetchData(url)


    // Ok 
    //
    // Handle page numbering

    const totalPages = data.page.totalPages;
    const pageNumber = data.page.number;
    console.log(`Total pages: ${totalPages}`);
    console.log(`Page number: ${pageNumber}`);
    console.dir(data);
    createPageination(totalPages, pageNumber);


    

    // Display results 
    const bedData = data._embedded.enheter; 
    let container = document.getElementById("table-container"); 
    displayTableHeader(container)
    displayBedData(container, bedData, 'navn', 'stiftelsesdato', 'organisasjonsnummer')
}



main(0)







