const { fromJS, List } = require('immutable')


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
    console.log('store after updating', store)
    if (!store.marsPhotos.getIn([0,'photos'])) {
      //just check the first rover to see if api threw an error
      return;
    }
    render(root, store)
}

const render = async (root, state) => {
    console.log('render store', state)
    let sliderHtml = document.querySelector('.roverSlider')
    if (sliderHtml) {
      initSlider()
    }
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
                  ${BuildPhotoGallery(marsPhotos, currentRover, rovers)}

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
  // then create an immmutable map or list and use it for the user interaction
  // need to use async otherwise map finishes before api calls returns
  // https://flaviocopes.com/javascript-async-await-array-map/
  const rovers = store.rovers

  const getARover = item => {
    return Promise.resolve(fetch(`http://localhost:3000/marsphotos?rover=${item}`)
            .then(res => res.json())
            .then((marsPhotos) => {
                return marsPhotos.photos
            }))
  }
  const makeAnApiCall = async item => {
    return getARover(item)
  }
  const getTheData = async () => {
    return Promise.all(rovers.map((item,index) => makeAnApiCall(item)))
  }
  getTheData().then(data => {
    let marsPhotos = fromJS(data);
    updateStore(store, { marsPhotos })
  })
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


const BuildPhotoGallery = (marsPhotos, currentRover, rovers) => {
  clearContent()
  // use of ImmutableJS
  // get index of currentRover
  let roverIndex = rovers.indexOf(currentRover);
  let galleryContent = marsPhotos.getIn([roverIndex,'photos'])
  console.log('gallerycontent',galleryContent)
  if (galleryContent) {
    let gallery = ''
    //higher order function
    gallery = galleryContent.reduce((allSlides, content) => {
      console.log('thisslide',gallerySlide(content.get('img_src'), content.get('camera'), content.get('rover')))
      console.log('allslides so far',allSlides)
      return allSlides + gallerySlide(content.get('img_src'), content.get('camera'), content.get('rover'))
    })
    //console.log('gallery after reduce',gallery)
    return gallery
  }
}

const gallerySlide = (imgUrl, camera, rover) => {
  return (`
    <div class="latte-item">
      <div class="roverImg"><img src=${imgUrl} /></div>
      <div class="roverCamera"><strong>Camera:</strong> ${camera.get('full_name')} (${camera.get('name')})</div>
      <div class="roverName"><strong>Rover:</strong> ${rover.get('name')}</div>
      <div class="roverInfo"><strong>Launched:</strong> ${rover.get('launch_date')}</div>
      <div class="roverInfo"><strong>Landed:</strong> ${rover.get('landing_date')}</div>
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
            //updateStore(store, { marsPhotos })
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
        //updateStore(store, { currentRover, marsPhotos })
      }
  }, false);
};
