"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(q) {
  const res = await axios.get('https://api.tvmaze.com/search/shows', { params: { q } });
  const shows = res.data;

  let showArray = shows.map(element => {
    let { show: { id, name, summary } } = element;
    let image;
    if (element.show.image) {
      image = element.show.image.original;
    } else {
      image = "https://tinyurl.com/tv-missing";
    }
    return { id, name, summary, image };
  });
  return showArray;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-6 col-lg-3 mb-4">
         <div class="card">
           <img
              src="${show.image}"
      
              class="card-img-top">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary Show-getEpisodes">
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
  searchForShowAndDisplay();
});



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }
async function getEpisodesOfShow(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = res.data;


  let episodeArray = episodes.map(element => {
    let  { id, name, season, number }  = element;
    return { id, name, season, number};
  });

  return episodeArray;
}
/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
async function populateEpisodes(episodes) {

  
  for (let episode of episodes) {
    const $episode = (
      `<li>${episode.name} (Season ${episode.season}, Number ${episode.number}) </li>`
    );
    
    $('#episodes-list').append($episode)
  }
}



$('#shows-list').on("click",'.Show-getEpisodes', async function (evt) {
  evt.preventDefault();
  const showID = $(evt.target).closest('.Show').data("show-id");

  const episodes = await getEpisodesOfShow(showID);

  $episodesArea.show();
  populateEpisodes(episodes);

});
