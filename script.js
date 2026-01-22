// SECTION 1 ETAT DU JEU
let player = {
    altitude: 0,
    clickpower: 1,
    passif_global: 1
}
let auto = false
let intervalId = null
let everestAtteint = false


//SECTION 2 SELECTION DU DOM

const button = document.getElementById("altbtn")
const alt_montrer = document.getElementById("altitude")
let titre = document.querySelector("h1")
const auto_click = document.getElementById("auto_click")

//SECTION 3 FONSTIONS/METIER 

function monter(player) {
    player.altitude += player.clickpower
}

function changer_passif_auto(auto) {
    return !auto
}

function altitude_plus_ultra(player) {
    intervalId = setInterval(() => {
        player.altitude += player.passif_global
        update_interface(player)
    }, 1000)
    return intervalId
}

//SECTION 4 AFFICHAGE

function update_interface(player) {
    if (auto === false) {
        auto_click.textContent = "Passif : OFF"
    } else {
        auto_click.textContent = "Passif : ON"
    }
    alt_montrer.textContent = "Altitude : " + player.altitude + "m"

    if (player.altitude >= 8849 && !everestAtteint){
    alert("Vous avez atteint le sommet de l'everest  passif + 10")
    player.passif_global += 10
    everestAtteint = true
    }
}

//SECTION 5 EVENEMENTS

button.addEventListener("click", () => {
    monter(player)
    update_interface(player)
})

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        monter(player)
        update_interface(player)
    }
})


auto_click.addEventListener("click", () => {
    auto = changer_passif_auto(auto)
    update_interface(player)
    if (auto && intervalId = null) {
        altitude_plus_ultra(player)
    } else {
        clearInterval(intervalId)
        intervalId = null
    }
})

