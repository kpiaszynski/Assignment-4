const api = 'http://127.0.0.1:8000/movies';

//Save New Button Start
document.getElementById('save-new-movie').addEventListener('click', (e) => {
    const movieTitle = document.getElementById('new-title').value; //Get input title
    if (!movieTitle.trim()) {                                      //If title (with no spaces, etc.) is empty
        alert('Forget the title? Add it now.');                    //Give alert
        e.preventDefault();
        return;
    }
    postMovies();
    const closeBtn = document.getElementById('add-close');         //Grab button id
    closeBtn.click();                                              //Close on button click
});

const postMovies = () => {
    const titleInput = document.getElementById('new-title');
    const title = titleInput.value;                                //Save input title
    const descInput = document.getElementById('new-desc');
    const desc = descInput.value;                                  //Save input description

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 201) {
            getMovies();
        }
    };

    xhr.open('POST', api, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ title, desc }));
};

const modalElement = document.getElementById('addModal');         //Grab the 'save new movie' modal
const modal = new bootstrap.Modal(modalElement);                  //Initialize the modal    

modalElement.addEventListener('hidden.bs.modal', function () {
    document.getElementById('new-title').value = '';              // Clear name input
    document.getElementById('new-desc').value = '';               // Clear email input
});
//Save New Movie End

//Save Updated Movie Start
document.getElementById('update-movie').addEventListener('click', (e) => {
    const titleInput = document.getElementById('update-title');
    const title = titleInput.value;                                   //Save previous title
    const descInput = document.getElementById('update-desc');
    const desc = descInput.value;                                     //Save previous title
    const id = document.getElementById('updateModal').getAttribute('data-movie-id'); //Grab specific id for movie

    updateMovie(id, title, desc);
    const closeBtn = document.getElementById('close');
    closeBtn.click();
});

const showUpdateModal = (id) => {
    const movie = data.find(m => m.id == id);                          //Grab data for movie to be updated
    document.getElementById('update-title').value = movie.title;       //Set the previous title
    document.getElementById('update-desc').value = movie.desc;         //Set the previous description
    document.getElementById('updateModal').setAttribute('data-movie-id', id); //Get ID for movie to be updated

    const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    updateModal.show();                                                //Show the modal
};

const updateMovie = (id, title, desc) => {
    const movie = data.find(m => m.id == id);                           //Grab data for movie to be updated
    const rating = movie ? movie.rating : null;                         //Save rating if given, otherwise leave None

    console.log(`updating movie ID=${id}`);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                getMovies();
                console.log(`updated movie ID=${id}`);

                const modalElement = document.getElementById('updateModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();                              //Close modal once done
                }
            }
        }
    };

    xhr.open('PUT', `${api}/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ title, desc }));
};
//Save Updated Movie End

//Remove Deleted Movie Start
const deleteMovie = (id) => {
    console.log(`deleting Movie ID=${id}`);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            getMovies();
            console.log(`deleted Movie ID=${id}`);
        }
    };

    xhr.open('DELETE', `${api}/${id}`, true);
    xhr.send();
};
//Remove Deleted Movie End

//Show Movie List Start
const displayMovies = (movies) => {
    const tbody = document.getElementById('movie-rows');      //Find area in html doc to input our data
    tbody.innerHTML = '';
    const rows = movies.map((x) => {
        return `<tr>
        <td>${x.title}</td>                                   
        <td>${x.desc}</td>
        <td>
          <div class="rating" data-movie-id="${x.id}">
            <button type="button" class="btn-icon"> <i class="fa-solid fa-star ${x.rating >= 1 ? 'selected' : ''}" data-value="1"></i> </button>
            <button type="button" class="btn-icon"> <i class="fa-solid fa-star ${x.rating >= 2 ? 'selected' : ''}" data-value="2"></i> </button>
            <button type="button" class="btn-icon"> <i class="fa-solid fa-star ${x.rating >= 3 ? 'selected' : ''}" data-value="3"></i> </button>
            <button type="button" class="btn-icon"> <i class="fa-solid fa-star ${x.rating >= 4 ? 'selected' : ''}" data-value="4"></i> </button>
            <button type="button" class="btn-icon"> <i class="fa-solid fa-star ${x.rating >= 5 ? 'selected' : ''}" data-value="5"></i> </button>
          </div>
        </td>
        <td>
        <button onClick="showUpdateModal(${x.id})" type="button" class="btn btn-success">Update</button>
        <button onClick="deleteMovie(${x.id})" type="button" class="btn btn-danger">Delete</button>
        </td>
    </tr>`;
    });
    tbody.innerHTML = rows.join(' ');
    starsEventListeners();
};

const getMovies = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = JSON.parse(xhr.responseText);
            console.log(data);
            displayMovies(data);                            //Collect data that has been sent and send it to display
        }
    };

    xhr.open('GET', api, true);
    xhr.send();
};
//Show Movie List End

//Saving Stars as Rating Start
const starsEventListeners = () => {
    const ratingE = document.querySelectorAll('.rating');   //Get all stars of class rating (so all of them)

    ratingE.forEach(ratingEs => {
        const stars = ratingEs.querySelectorAll('i');       //Grab data for each unique star
        const movieId = ratingEs.getAttribute('data-movie-id');//Grab IDs for each unique star

        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const value = parseInt(star.getAttribute('data-value')); //Grab value for hover effect

                stars.forEach(s => {
                    const starValue = parseInt(s.getAttribute('data-value'));
                    s.classList.toggle('hover', starValue <= value);     //Highlight all stars up to hovered star
                });
            });

            star.addEventListener('mouseout', () => {
                stars.forEach(s => s.classList.remove('hover'));         //Remove hover effect after mouse leaves
            });

            star.addEventListener('click', () => {
                const value = parseInt(star.getAttribute('data-value')); //Grab value for 'selected' effect 
                stars.forEach(s => {
                    const starValue = parseInt(s.getAttribute('data-value'));
                    s.classList.toggle('selected', starValue <= value); // Mark all stars up to the clicked star
                });
                saveRating(movieId, value);                             //Save rating to Movie list
            });
        });
    })
};

const saveRating = (movieId, rating) => {
    const movie = data.find(m => m.id == movieId);                      //Grab movie data
    if (!movie) return;                                                 //If no rating, leave as is (None)

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(`Rating for movie ID=${movieId} saved.`);
            getMovies();
        }
    };

    xhr.open('PUT', `${api}/${movieId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ title: movie.title, desc: movie.desc, rating: rating }));
};
//Saving Stars as Rating End

(() => {
    getMovies();                                            //IIFE for displaying movies on web app load
})();