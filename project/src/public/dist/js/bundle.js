/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!******************************!*\
  !*** ./src/public/client.js ***!
  \******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
eval("let store = {\n    user: { name: \"Student\" },\n    apod: '',\n    rovers: ['Curiosity', 'Opportunity', 'Spirit'],\n}\n\n// add our markup to the page\nconst root = document.getElementById('root')\n\nconst updateStore = (store, newState) => {\n    store = Object.assign(store, newState)\n    render(root, store)\n}\n\nconst render = async (root, state) => {\n    root.innerHTML = App(state)\n}\n\n\n// create content\nconst App = (state) => {\n    let { rovers, apod } = state\n\n    return `\n        <header></header>\n        <main>\n            ${Greeting(store.user.name)}\n            <section>\n                <h3>Put things on the page!</h3>\n                <p>Here is an example section.</p>\n                <p>\n                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of\n                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.\n                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other\n                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image\n                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;\n                    but generally help with discoverability of relevant imagery.\n                </p>\n                ${ImageOfTheDay(apod)}\n            </section>\n        </main>\n        <footer></footer>\n    `\n}\n\n// listening for load event because page should load before any JS is called\nwindow.addEventListener('load', () => {\n    render(root, store)\n})\n\n// ------------------------------------------------------  COMPONENTS\n\n// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.\nconst Greeting = (name) => {\n    if (name) {\n        return `\n            <h1>Welcome, ${name}!</h1>\n        `\n    }\n\n    return `\n        <h1>Hello!</h1>\n    `\n}\n\n// Example of a pure function that renders infomation requested from the backend\nconst ImageOfTheDay = (apod) => {\n\n    // If image does not already exist, or it is not from today -- request it again\n    const today = new Date()\n    const photodate = new Date(apod.date)\n\n    if (!apod || apod.date === today.getDate() ) {\n        getImageOfTheDay(store)\n    }\n\n    // check if the photo of the day is actually type video!\n    if (apod.media_type === \"video\") {\n        return (`\n            <p>See today's featured video <a href=\"${apod.url}\">here</a></p>\n            <p>${apod.title}</p>\n            <p>${apod.explanation}</p>\n        `)\n    } else {\n        return (`\n            <img src=\"${apod.image.url}\" height=\"350px\" width=\"100%\" />\n            <p>${apod.image.explanation}</p>\n        `)\n    }\n}\n\n// ------------------------------------------------------  API CALLS\n\n// Example API call\nconst getImageOfTheDay = (state) => {\n    let { apod } = state\n\n    fetch(`http://localhost:3000/apod`)\n        .then(res => res.json())\n        .then(apod => updateStore(store, { apod }))\n\n    return data\n}\n\n\n//# sourceURL=webpack://jsnd3_mars_dashboard/./src/public/client.js?");
/******/ })()
;