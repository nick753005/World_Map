/*******************************************************************

    Sheffield Mallam    MSc Computer Science

    Web Technologies    Final Assessment

    Nicholas Daniel     April 2025
    
    API:  https://restcountries.com/v3.1/name/{name}

    from:  https://free-apis.github.io

**********************************************************************/

//let latlng = [54.07210,-2.01003];   // 52 Badger Gate
let reply = [];
let c_index = [];         // array of indices into reply[]
let index;


async function findCountry(event) {

    event.preventDefault();     // Prevent the form from submitting

    document.getElementById("api_line1").innerHTML ="";
    document.getElementById("api_line2").innerHTML ="";
    document.getElementById("capital-button").style.display = 'none'; 

    country = document.getElementById("country").value;

    country = country.toLowerCase();

    if(country == "usa")                // this causes an error, but why?
      country = "united states";
  
    try {
      img = document.getElementById("flag"); 
      img.style.display = 'none';
      img = document.getElementById("coatOfArms"); 
      img.style.display = 'none';
      document.getElementById('spinner').style.display = 'block';

      const response = await fetch("https://restcountries.com/v3.1/name/" + country);
  
      reply = await response.json();

      document.getElementById('spinner').style.display = 'none';
  
      num_countries = reply.length;
      const c_names = [];         // array of common names
      c_index = [];

      //country = country.toLowerCase();
  
      
      for(let c = 0; c < num_countries; c++) {
          common_name = (reply[c].name.common).toLowerCase();
          if( common_name.search(country) != -1 ) {
            c_names.push(reply[c].name.common);
            c_index.push(c);
          }
      }

      fill_selection(c_names);
   
      //console.log(c_names);
      //console.log(c_index);
      //for(let c = 0; c < num_countries; c++)
      //  console.log(reply[c].name.common);

      displayCountry( c_index[0] );  // display the first country found
    
    } catch (error) {
        console.error('An error occurred:', error);
        document.getElementById("api_line1").innerHTML = "<strong>Sorry - Failed to fetch data - Please try again</strong>";
        document.getElementById('spinner').style.display = 'none';
        //document.getElementById("api_line2").innerHTML ="";
        //document.getElementById("api_line3").innerHTML ="";
        //document.getElementById("capital-button").style.display = 'none'; 
        //const img = document.getElementById("flag");      
      }

  }


//--------------------------------------------------------------------------------------
// populate the selection form with countries returned from API

function fill_selection(c_names) {

  let selectElement = document.getElementById("sel_con");

  // Clear existing options
  selectElement.innerHTML = "";

  // Add new options dynamically
  // c_names.forEach(function(optionText, index) {
  for(c = 0; c < c_names.length; c++) {
    let newOption = document.createElement('option');
    newOption.value = c_index[c];                  // this is the index into reply[]
    newOption.textContent = c_names[c];       
    selectElement.appendChild(newOption);
  }

}

 
  