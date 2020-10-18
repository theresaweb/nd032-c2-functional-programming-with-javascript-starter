const { Map } = require('immutable')


let store = {
    user: { name: "Student" },
    marsPhotos: {},
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    currentRover: 'Curiosity'
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
    console.log('store in updatestore', store)
    let sliderHtml = document.querySelector('.roverSlider')
    if (sliderHtml && store.marsPhotos.length > 0) {
      initSlider()
    }
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { currentRover, rovers, marsPhotos } = state
    console.log('app marsPhotos', marsPhotos)
    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <div class="wrapper">
              <div class="tabs">
                ${getTabs(rovers)}
              </div>
              <div class="content">
                <div class="roverSlider" id="carousel">
                  ${BuildPhotoGallery(currentRover, marsPhotos)}
                </div>
              </div>
            </div>

        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }
    return `
        <h1>Hello!</h1>
    `
}


const BuildPhotoGallery = (currentRover, marsPhotos) => {
  // using https://www.npmjs.com/package/@fabricelements/skeleton-carousel
  console.log('marsPhotos',marsPhotos)
  if (Object.keys(marsPhotos) === undefined || Object.keys(marsPhotos).length === 0) {
    getRoverPhotos(currentRover, marsPhotos)
  }
  const galleryContent = Map(marsPhotos.photos)
  let gallery = ''
  galleryContent.map((content, index) => {
    content.map((item, index) => {
      gallery += gallerySlide(item.img_src, item.camera, item.rover)
    })
  })
  return gallery

}
const gallerySlide = (imgUrl, camera, rover) => {
  return (`
    <div class="latte-item">
      <div class="roverImg"><img src=${imgUrl} /></div>
      <div class="roverCamera"><strong>Camera:</strong> ${camera.full_name} (${camera.name})</div>
      <div class="roverName"><strong>Rover:</strong> ${rover.name}</div>
      <div class="roverInfo"><strong>Launched:</strong> ${rover.launch_date}</div>
      <div class="roverInfo"><strong>Landed:</strong> ${rover.landing_date}</div>
    </div>
    `)
}
function initSlider() {
  //https://lattecarousel.dev/ es5 implementation
  var options = {
    count: 1,
    move: 1,
    touch: true,
    mode: "align",
    buttons: true,
    dots: false,
    rewind: true,
    autoplay: 0,
    animation: 500,
    // responsive: {
    //       "0": { count: 1.5, mode: "free", buttons: false },
    //       "480": { count: 2.5, mode: "free", buttons: false },
    //       "768": { count: 3, move: 3, touch: false, dots: false },
    //       "1440": { count: 4, move: 2, touch: false, dots: false },
    //   },
  };
  var carousel = new latte.Carousel(".roverSlider", options);
}
function noPhotos() {
  return (`
    <div>No phptos available</div>
    `)
}
// const ImageOfTheDay = (apod) => {
//
//     // If image does not already exist, or it is not from today -- request it again
//     const today = new Date()
//     const photodate = new Date(apod.date)
//
//     if (!apod || apod.date === today.getDate() ) {
//         getImageOfTheDay(store)
//     }
//
//     // check if the photo of the day is actually type video!
//     if (apod && apod.media_type === "video") {
//         return (`
//             <p>See today's featured video <a href="${apod.url}">here</a></p>
//             <p>${apod.title}</p>
//             <p>${apod.explanation}</p>
//         `)
//     } else {
//         return (`
//             <img src="${apod && apod.image.url}" height="350px" width="100%" />
//             <p>${apod && apod.image.explanation}</p>
//         `)
//     }
// }

// ------------------------------------------------------  API CALLS

// Example API call
// const getImageOfTheDay = (state) => {
//     let { apod } = state
//
//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, { apod }))
//
//     return apod
// }

const getTabs = (rovers) => {
  let tabs = ''
  rovers.map((rover, index) => {
    tabs += `<div class="tab ${index===0 && 'active'}">${rover}</div>`
  })
  return tabs
}

const getRoverPhotos = (state) => {
    let { currentRover, marsPhotos } = state
    fetch(`http://localhost:3000/marsphotos?cache=123`)
        .then(res => res.json())
        .then(marsPhotos => updateStore(store, { marsPhotos }))
    console.log('getRoverPhotos marsphotos:', marsPhotos)
    return marsPhotos
}
