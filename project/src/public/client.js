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
    let photoState = store.marsPhotos.photos
    let apiError = photoState && photoState.error
    let photos = photoState && photoState.photos
    render(root, store)
    let sliderHtml = document.querySelector('.roverSlider')
    if (sliderHtml && !apiError && photos && Object.keys(photos).length > 0) {
      initSlider()
    }
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { currentRover, rovers, marsPhotos } = state
    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <div class="wrapper">
              <div class="tabs">
                ${getTabs(currentRover, rovers)}
              </div>
              <div class="content">
                <div class="roverSlider" id="carousel">
                  ${BuildPhotoGallery(state)}
                  ${addTabClickEvents(state)}
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


const BuildPhotoGallery = (state) => {
  clearContent()
  let { marsPhotos, currentRover } = state
  const photosMap = Map(marsPhotos)
  let galleryContent = photosMap.get('photos')
  if (galleryContent && galleryContent.photos && galleryContent.photos.length > 0) {
    let gallery = ''
    galleryContent.photos.map((content, index) => {
      gallery += gallerySlide(content.img_src, content.camera, content.rover)
    })
    return gallery
  } else {
    getRoverPhotos(state)
    return '<div>No Photos available</div>'
  }
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

const getTabs = (currentRover, rovers) => {
  let tabs = ''
  rovers.map((rover, index) => {
    tabs += `<div class="tab ${currentRover===rover ? 'active' : ''}" data-rover="${rover.toLowerCase()}">${rover}</div>`
  })
  return tabs
}

const getRoverPhotos = (state) => {
    let { currentRover, marsPhotos } = state
    fetch(`http://localhost:3000/marsphotos?rover=${currentRover.toLowerCase()}`)
        .then(res => res.json())
        .then((marsPhotos) => {
          if (Object.keys(marsPhotos.photos.photos).length > 0) {
            //only update store if api returns photos
            updateStore(store, { marsPhotos })
          }
        })
    return marsPhotos
}

function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

function clearContent() {
  const sliderDiv = document.querySelector('.roverSlider')
  if (sliderDiv) {
    sliderDiv.innerHTML = ''
  }
}
function addTabClickEvents(state) {
  let { currentRover } = state
  document.addEventListener('click', function (e) {
      if (hasClass(e.target, 'tab')) {
        dataRover = e.target.dataset.rover
        currentRover = dataRover.charAt(0).toUpperCase() + dataRover.slice(1)
        //clear marsphotos
        let marsPhotos = {}
        updateStore(store, { currentRover, marsPhotos })
        getRoverPhotos(state)
      }
  }, false);
};
