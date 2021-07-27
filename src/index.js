
const dogBar = document.querySelector('#dog-bar')
const info = document.querySelector('#dog-info')
const filterContainer = document.querySelector('#filter-div')

function fetchDogs(filter = false) {
    fetch('http://localhost:3000/pups')
    .then(r => r.json())
    .then(dogsArr => {
        dogBar.innerHTML = ""

        if (filter) {
            let goodDogs = dogsArr.filter( dog => dog.isGoodDog === true)
            goodDogs.forEach(dog => createOneDog(dog))
        }
        else {
            dogsArr.forEach( dog => {
                createOneDog(dog)   
            })
        }

    })
}   

function fetchSingleDog(id) {
    return fetch(`http://localhost:3000/pups/${id}`)
        .then(r => r.json())
}




function createOneDog(dogObj) {
    const span = document.createElement("span")
    span.dataset.dogId = dogObj.id
    span.textContent = dogObj.name
    
    dogBar.append(span)
}



dogBar.addEventListener('click', evnt => {
    console.log("clicked!")

    if (evnt.target.matches('span')) {
        const id = evnt.target.dataset.dogId
        fetch(`http://localhost:3000/pups/${id}`)
        .then(r => r.json())
        .then(dogObj => { 
            addDogInfo(dogObj)

        
        })
    }

})

function toggleFilter(btn) {

}

filterContainer.addEventListener('click', evnt =>{
    if (evnt.target.matches('button')) {
        // console.log(allDogs)
        // dogBar.innerHTML = ""
        if (evnt.target.textContent === "Filter good dogs: OFF"){
            fetchDogs(true)
            evnt.target.textContent = "Filter good dogs: ON"
        }
        else {
            fetchDogs()
            evnt.target.textContent = "Filter good dogs: OFF"
        }

    }
})

function addDogInfo(dog) {
    // clear previous entries
    info.innerHTML = ""

    const outerDiv = document.createElement('div')
    outerDiv.dataset.dogId = dog.id

    const dogGoodness = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"

    console.log(dog)

    outerDiv.innerHTML = `
    <img src=${dog.image} />
    <h2>${dog.name}</h2>
    <button id="is-good-dog">
        ${dogGoodness} 
    </button>
    `
    info.append(outerDiv)
}

info.addEventListener("click", evnt => {

    if (evnt.target.matches("button")) {
        const div = evnt.target.closest('div')
        const currDog = fetchSingleDog(div.dataset.dogId)

        currDog.then(dog => {
            const currGoodness = dog.isGoodDog
            const newGoodness = !currGoodness

            currGoodness ? evnt.target.textContent = "Bad Dog!" : evnt.target.textContent = "Good Dog!"
    
            fetch(`http://localhost:3000/pups/${div.dataset.dogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isGoodDog: newGoodness })
            })
                .then(r => r.json())
                .then(data => {
                    console.log(data)
                    const filterBtn = filterContainer.querySelector('button#good-dog-filter')

                    filterBtn.textContent === "Filter good dogs: ON" ? fetchDogs(true) : fetchDogs()
                })
        })


            
        
    }
})
 
// init the js
fetchDogs()