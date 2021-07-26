
document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/pups')
    .then(r => r.json())
    .then(json=> {
        json.forEach(dog => {
            const dogBar = document.querySelector('#dog-bar')
        })
    })
})