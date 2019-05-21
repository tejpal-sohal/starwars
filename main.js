/************************************************
I did not to use a frame work as it felt overkill,
written in JS with a little help from pagination.js found on github
https://pagination.js.org/ to create the pagination

This task was interesting as creating a table of pagination results was tricky. 
The Api only returns 10 results per call, however there is a method on the endpoint {next()}, I could have created a onClick
method to click and load more but the issue would be calls everytime. Therefore a promise to check if the next method is valid 
it will continue runing though the untill it is not valid anymore and resolve the promise.

Styling - Bootstrap
no framework 
*************************************************/

//Check if Core is defined
if (typeof Core === "undefined")
    var Core = {};

//Object created to hold url   
Core.sw = {

    state: {
        url: 'https://swapi.co/api/people',
    },

    //method to initialise mount methods
    init() {
        this.willMount();
    },

    //method which returns a promise from the URL 
    getStarWarsPeople(progress, url = `${this.state.url}`, people = []) {
        return new Promise((resolve, reject) => fetch(url)
            .then(response => {
                if (response.status !== 200) {
                    throw `${response.status}: ${response.statusText}`;
                }
                response.json().then(data => {
                    //Adds the list of people to the people array 
                    people = people.concat(data.results)
                    if (data.next) {
                        progress && progress(people);
                        this.getStarWarsPeople(progress, data.next, people).then(resolve).catch(reject)
                    } else {
                        resolve(people);
                    }
                }).catch(reject);
            }).catch(reject));
    },

    //call back method that contains templates for the table and loops over the peoples array which creates the rows 
    progressCallback(people) {
        function $temp(people) {
            var html = `<table class="table table-responsive-sm">
                    <thead class="thead-dark">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Birth Year</th>
                                <th scope="col">Eye Color</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Hair Color</th>
                                <th scope="col">Height</th>
                                <th scope="col">Mass</th>
                                <th scope="col">Skin Color</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${people.map((person) => {
                return `<tr>
                            <td>${person.name}</td>
                            <td>${person.birth_year}</td>
                            <td>${person.eye_color}</td>
                            <td>${person.gender}</td>
                            <td>${person.hair_color}</td>
                            <td>${person.height}</td>
                            <td>${person.mass}</td>
                            <td>${person.skin_color}</td>
                        </tr> `}
            )}
                        </tbody>
                        </table >`
            return html;
        }

         //Got a little messy here as it was diffcult to paginate items which are in the array, hence did reseach and found a package which does that.
         
        $('#pagination-container').pagination({
            dataSource: people,
            callback: function (people) {
                    var html = $temp(people);
                    $('#data-container').html(html);
                
            }
        })
    },


    //calls the getStarWarsPeople Promise takes in the ProgressCall back then then the callback renders  the template. 
    willMount() {
        this.getStarWarsPeople(this.progressCallback)
    }
}

Core.sw.init();

