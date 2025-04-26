# Assignment 4
## Katie Piaszynski

## Synopsis   
I created a movie watchlist app in which a movie is described with a title, genre, and optional star rating system for once you have watched the movie. The add movie button is at the top of the page, with update and delete buttons appearing after an entry gets logged. Entries are displayed in a table format

## Unique to Assignment 4        
There is a new toggle-able button for sign up or sign in. When not needed, simply hide it away. There are now more folders with database connections and authentication for proper user log in. These features do not all work together overall, but it includes database connection settings, database models, authentication handlers, password encryptions, routing, and a frontend aspect.

### Initializing (Windows)
To initialize, first create a virtual environment with:    
> **py -m venv venv**   
       
Next, activate the virtual environment with:      
> **.\venv\Scripts\activate**     
      
Finally, install the requirements for this project with:      
> **pip install -r requirements.txt**     
     
You now should have everything needed to create this web app.     
    
To access your watchlist, utilize uvicorn with:     
> **uvicorn main:app --port 8000 --reload**     
      
On app refresh any adjustments to the code will be implemented (assuming you saved it first!).    

### Backend
main.py, movie.py, and movie_routes.py contain all of the backend coding for this project. main.py initializes the fastapi app. movie.py initializes the classes/variables for the movie(s). This app takes a movie to have a unique ID, a mandatory title (outlined in the front end), a description of the genre, and an optional rating for once you have finished the movie with None being the base. movie_router.py initializes the routes for the frontend to use. It also creates the storage list so the inputted movies will be saved.
          

### Frontend
The frontend is made up of a folder entitled "frontend." This folder contains index.html, main.js, style.css, and an icon of a movie camera (favicon.ico). The icon simply stays in the browser tab, representing the movie watchlist tab. index.html contains the code for setting up the Bootstrap buttons/modals for adding and editing movies, and links to the favicon icon, main.js, style.css, the Font Awesome star icon, and Bootstrap (the source for the modals). Also contained is a table for displaying the different movie categories, this gets filled by the JavaScript code. main.js is the JavaScript code for handling adding, updating, deleting, and handling the star rating system. I added plenty of notes within this file for ease of following along, as it is a long one. For related objects, I bordered the code with:       
> **//...Start**            
> **//...End**              

An IIFE (Immediately Invoked Function Expression) is used to display the stored movies instantly upon load.          
       
### Special Notes       
There are a few 'quality of life' additions. Firstly, you cannot enter a movie without a title. If the genre is unknown, you can easily find it with an online engine search, but if you do not know the title you may have a much harder time finding you movie just off of "Romance" or "Action." If attempted to enter a movie without a title, an alert will pop up reminding you of the forgotten title. The best quality of life addition are the stars that react to mouse events. Hovering over a star rating will turn the blank [white] star to yellow. Moving to the 5th star will incrementally light up the stars as they are passed over. Selecting a star will light it up, along with all previous stars. This is updated to the list as a value 1-5, and looks very pretty.      
The final mention is the .gitignore file. When using virtual environments it is important to protect your data from others. GitHub (optionally) generates a .gitignore file for whatever specified language you need when initializing a new repository. I used this for this project, but please note that many of the specified items in that file are not used in this project. 

