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
    setTimeout(addTabClickEvents(state.currentRover), 10000)
}

// create content
const App = (state) => {
    let { currentRover, rovers, marsPhotos } = state
    return `
        <header></header>
        <main>
            ${Greeting(state.user.name)}
            <div class="wrapper">
              <div class="tabs">
                ${getTabs(currentRover, rovers)}
              </div>
              <div class="content">
                <div class="roverSlider" id="carousel">
                  ${BuildPhotoGallery(marsPhotos, currentRover)}

                </div>
              </div>
            </div>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  // idea is to get all the data here for all roverSlider
  // then create an immmutable map an use it for the user interaction
  // need to use async otherwise map finishes before api calls returns
  // https://flaviocopes.com/javascript-async-await-array-map/
  const list = [1, 2, 3, 4, 5] //...an array filled with values

  const functionWithPromise = item => { //a function that returns a promise
    console.log('functionWithPromise')
    return Promise.resolve(item)
  }

  const anAsyncFunction = async item => {
    console.log('anAsyncFunction')
    return functionWithPromise(item)
  }

  const getData = async () => {
    console.log('getData')
    return Promise.all(list.map(item => anAsyncFunction(item)))
  }

  getData().then(data => {
    console.log('getData then')
    console.log(data)
  })
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


const BuildPhotoGallery = (marsPhotos, currentRover) => {
  clearContent()
  // use of ImmutableJS
  const photosMap = Map(marsPhotos)
  let galleryContent = photosMap.get('photos')
  if (galleryContent && galleryContent.photos && galleryContent.photos.length > 0) {
    let gallery = ''
    //higher order function
    gallery = galleryContent.photos.reduce((allSlides, content) => {
      return allSlides + gallerySlide(content.img_src, content.camera, content.rover)
    })
    return gallery
  } else {
    getRoverPhotos(marsPhotos, currentRover)
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

const initSlider = () => {
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
  };
  var carousel = new latte.Carousel(".roverSlider", options);
}

const getTabs = (currentRover, rovers) => {
  let tabs = ''
  // use of map
  rovers.map((rover, index) => {
    tabs += `<div class="tab ${currentRover===rover ? 'active' : ''}" data-rover="${rover.toLowerCase()}">${rover}</div>`
  })
  return tabs
}

const getRoverPhotos = (marsPhotos, currentRover) => {
    if (Object.keys(marsPhotos).length === 0) {
    fetch(`http://localhost:3000/marsphotos?rover=${currentRover}`)
        .then(res => res.json())
        .then((marsPhotos) => {
          if (Object.keys(marsPhotos.photos.photos).length > 0) {
            //only update store if api returns photos
            updateStore(store, { marsPhotos })
          }
        })
      }
    //return marsPhotos
}

const hasClass = (elem, className) => {
    return elem.className.split(' ').indexOf(className) > -1;
}

const clearContent = () => {
  const sliderDiv = document.querySelector('.roverSlider')
  if (sliderDiv) {
    sliderDiv.innerHTML = ''
  }
}

const addTabClickEvents = (currentRover) => {
  window.addEventListener('click', function (e) {
      if (hasClass(e.target, 'tab')) {
        dataRover = e.target.dataset.rover
        currentRover = dataRover.charAt(0).toUpperCase() + dataRover.slice(1)
        //clear marsphotos
        let marsPhotos = {}
        updateStore(store, { currentRover, marsPhotos })
      }
  }, false);
};
