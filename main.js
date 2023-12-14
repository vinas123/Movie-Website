var vOneLS = localStorage.getItem("vOneLocalStorage");

var facialMood = vOneLS;

var facialGenre;

const searchbtn = document.getElementById('search-btn');
const movieList = document.getElementById('movie');
const recommendedMovieList = document.getElementById('recommended-movie');
const movieDetailsContent = document.querySelector('.movie-details-content');
const movieCloseBtn = document.getElementById('movie-close-btn');


window.onload = function () {



    if (facialMood === "neutral") {
        alert("Looks like you have a normal day today as you have normal facial expression. Let's search for some action movie to brighten up your day🎉✨.");
        facialGenre = 'action';
    }

    else if (facialMood === "happy") {
        alert("Looks like you have a wonderful day today as you look happy and cheerful. Let's search for some adventure movie to explore different adventures😁.");
        facialGenre = 'adventure';
    }

    else if (facialMood === "angry") {
        alert("Why so serious?. Let's search for some romantic movie to make feel lovely again ❤.");
        facialGenre = 'romantic';
    }

    else if (facialMood === "suprised") {
        alert("Feeling surprised!. Let's search for some thought provoking movie to make you feel calm😊.");
        facialGenre = 'thriller';
    }

    else {
        alert("Looks like you are having a bad day buddy. Let's search for some motivational movie to make you feel motivated😎.");
        facialGenre = 'comedy';
    }



    fetch(`https://imdb8.p.rapidapi.com/title/get-popular-movies-by-genre?genre=%2Fchart%2Fpopular%2Fgenre%2F${facialGenre}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "enter your key",
            "x-rapidapi-host": "imdb8.p.rapidapi.com"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // var mySubString = data[0].substring(
            //     data[0].lastIndexOf("/") + 1, 
            //     data[0].lastIndexOf("/")
            // );

            // var movieArr;
            // for (i = 0; i < 10; i++) {
            var n = data[Math.floor((Math.random() * 90) + 1)].length;
            var str = data[Math.floor((Math.random() * 90) + 1)].substring(7, n - 1);
            displayFromFace(str);
            // if (str) {
            //     // movieArr.push(str);
            // }


            // console.log(str);

        })
        .catch(err => {
            console.error(err);
        });

}

// This function is gonna execute when the camera will detect our face and send the expression data and we know what movie id
// we need to display.
function displayFromFace(id) {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=d37d36d1&plot=full`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // var counter = 0;
            let html = "";

            if (data) {
                if (data.Title && data.Poster) {
                    html += `
                <div class = "movie-item" data-id = "${data.Title}">
                    <div class = "movie-img">
                    <img src = "${data.Poster}" alt = "movie">
                    </div>
                    <div class = "movie-name">
                        <h3>${data.Title}</h3>
                        <a href = "#" class = "details-btn">More Details</a>
                    </div>
                </div>
            `;

                    // getMovieId(data.Title);
                    // console.log("Back here!");
                    // if (id) {
                    //     console.log(id);
                    // getRecommededMovieList(id);
                    // }


                }
                movieList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any movie!";
                movieList.classList.add('notFound');
            }

            movieList.innerHTML = html;



        })
        .catch(err => {
            console.error(err);
        });

}


// console.log(vOneLS);


// **************************************










// Now we will add eventlistenrs to our main.JS so we will use search button, close button and more details button.

searchbtn.addEventListener('click', getMovieList);
movieList.addEventListener('click', getMovieDetails);
movieCloseBtn.addEventListener('click', () => {
    movieDetailsContent.parentElement.classList.remove('showMovie');
});





// get movie list that matches with the written title
function getMovieList() {
    let searchInputTxt = document.getElementById('search-input').value;
    var request = new Request("https://imdb8.p.rapidapi.com/title/find?q=" + searchInputTxt, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "enter your key",
            "x-rapidapi-host": "imdb8.p.rapidapi.com"
        }
    });
    fetch(request)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var counter = 0;
            var movArr = [];
            let html = "";
            if (data.results) {
                data.results.forEach(movie => {
                    if (movie.title && movie.image) {
                        html += `
                    <div class = "movie-item" data-id = "${movie.title}">
                        <div class = "movie-img">
                        <img src = "${movie.image.url}" alt = "movie">
                        </div>
                        <div class = "movie-name">
                            <h3>${movie.title}</h3>
                            <a href = "#" class = "details-btn">More Details</a>
                        </div>
                    </div>
                `;

                        // getMovieId(movie.title);
                        // console.log("Back here!");
                        // if (id) {
                        //     console.log(id);
                        // getRecommededMovieList(id);
                        // }
                        if (counter < 2) {

                            movArr[counter] = movie.id.split("/");
                            counter++;
                        }
                    }
                });
                movieList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any movie!";
                movieList.classList.add('notFound');
            }

            movieList.innerHTML = html;
            // console.log(movArr[0][2]);
            getRecommededMovieList(movArr[0][2]);
        });
}


// get details of the movie
function getMovieDetails(e) {
    e.preventDefault();
    if (e.target.classList.contains('details-btn')) {
        let movieItem = e.target.parentElement.parentElement;

        fetch(`https://www.omdbapi.com/?t=${movieItem.dataset.id}&apikey=d37d36d1&plot=full`)
            .then(response => response.json())
            .then(data => movieDetailsModal(data));
    }
}

// create a modal
function movieDetailsModal(movie) {
    // console.log(movie);

    if (movie.Title && movie.Poster) {
        let html = `
        <h2 class = "movie-title">${movie.Title}</h2>
        <p class = "movie-category">${movie.Genre}</p>
        <div class = "movie-plot">
            <h3>Plot:</h3>
            <p>${movie.Plot}</p>
        </div>
        <div class = "movie-poster-img">
            <img src = "${movie.Poster}" alt = "Movie Poster">
        </div>
    `;
        movieDetailsContent.innerHTML = html;
        movieDetailsContent.parentElement.classList.add('showMovie');
    }
}


function getMovieId(title) {
    console.log(title);
    fetch(`https://www.omdbapi.com/?t=${title}&apikey=d37d36d1&plot=full`)
        .then(response => response.json())
        .then(data => {
            // id = data.imdbID;
            // console.log(data[0]);
            // getRecommededMovieList(id);
        });
}

function getMovieTitle(id) {
    console.log(title);
    fetch(`https://www.omdbapi.com/?t=${title}&apikey=d37d36d1&plot=full`)
        .then(response => response.json())
        .then(data => {
            // id = data.imdbID;
            // console.log(data[0]);
            // getRecommededMovieList(id);
        });
}

function getRecommededMovieList(id) {
    // let searchInputTxt = document.getElementById('search-input').value;
    // id = stringify(id);
    console.log(id);
    // var request = new Request("https://imdb8.p.rapidapi.com/title/get-more-like-this?tconst=" + id + "&currentCountry=US&purchaseCountry=US", {
    //     "method": "GET",
    //     "headers": {
    //         "x-rapidapi-key": "36e1cf3a80msh8c018e8fc9223d7p1bff67jsn368908da535a",
    //         "x-rapidapi-host": "imdb8.p.rapidapi.com"
    //     }
    // })

    fetch(`https://imdb8.p.rapidapi.com/title/get-more-like-this?tconst=${id}&currentCountry=US&purchaseCountry=US`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "9f57c530c6msh01f7547f483b552p1f352bjsn98ab0a172403",
            "x-rapidapi-host": "imdb8.p.rapidapi.com"
        }
    })
        .then(response => {
            // console.log(response);
            return response.json()
        })
        .then(data => {
            var movList = [];
            var idList = [];
            console.log(data);
            for (let i = 0; i < 5; i++) {
                movList[i] = data[i].split("/");
                idList[i] = movList[i][2];
            }
            // for (let i = 0; i < 5; i++) {
            //     // console.log(idList[i]);

            // }
            getRecommendedMovieDetails(idList);

        });
}


function getRecommendedMovieDetails(idList) {


    var movieDetailsList = [];
    for (let i = 0; i < idList.length; i++) {


        // console.log(element);
        fetch(`https://www.omdbapi.com/?i=${idList[i]}&apikey=d37d36d1&plot=full`)
            .then(response => response.json())
            .then(data => {
                movieDetailsList[i] = data;
                displayRecommendedMovieList(movieDetailsList);
            });
    }

}


function displayRecommendedMovieList(movieDetailsList) {

    let html = "";
    movieDetailsList.forEach(element => {
        console.log(element);
       
        if (element.Title && element.Poster) {
            html += `
        <div class = "movie-item" data-id = "${element.Title}">
            <div class = "movie-img">
            <img src = "${element.Poster}" alt = "movie">
            </div>
            <div class = "movie-name">
                <h3>${element.Title}</h3>
                <a href = "#" class = "details-btn">More Details</a>
            </div>
        </div>
    `;



            recommendedMovieList.classList.remove('notFound');
        } else {
            html = "Sorry, we didn't find any movie!";
            recommendedMovieList.classList.add('notFound');
        }

        recommendedMovieList.innerHTML = html;





    });
}



