"use strict";

const $showsList = $("#shows-list");
const $searchForm = $("#search-form");
const $episodesArea = $("#episodes-area");
const $episodeUl = $("#episodes-list")


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const res = await axios.get('https://api.tvmaze.com/search/shows', {params: {q: term}})
  console.log(res);
  return res.data;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let img; 
    if(show.show.image === null){
      img = 'https://tinyurl.com/tv-missing';
    } else {
      img = show.show.image.medium;
    }
    const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${img}" 
              alt="${show.show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-dark btn-sm Show-getEpisodes text-muted" id="episodes-btn">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


// Button with add event listner for episodes 
$showsList.on('click', '#episodes-btn' , async function (e) {
  // reset everything before next click 
  $episodeUl.empty(); 

  // set new episodes
  const id = $(this).closest('.Show').data('showId');
  const episode = await getEpisodesOfShow(id);
  populateEpisodes(episode); 
  $episodesArea.show();
})

/** Given a show ID, get from API and return (promise) array of episodes:
 * 
 * @param {number} id - id number of a show to get episodes
 * 
 * @return {array} res - returns an array of data 
 * 
 * 
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  return res.data; 
}

/** populateEpisode function creates an li with episodes information and appends to the DOM!
 * 
 * @param {Array}episodes - an array of episodes returned from function getEpisodesOfShow();
 * 
 * no return 
 * 
*/

function populateEpisodes(episodes) { 
  for(let episode of episodes){
    const li = document.createElement('li');
    li.innerText = `${episode.name} (Season ${episode.season} - Episode ${episode.number})`; 
    $episodeUl.append(li); 
  }
}
