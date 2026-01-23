// SECTION 1 ETAT DU JEU
let player = {
    altitude: 0,
    clickpower: 1,
    passif_global: 1,
    gold : 0,
    gold_power : 1
}
let auto = false
let intervalId = null
let everestAtteint = false


//SECTION 2 SELECTION DU DOM

const button = document.getElementById("altbtn")
const alt_montrer = document.getElementById("altitude")
let titre = document.querySelector("h1")
const auto_click = document.getElementById("auto_click")
const gold_montrer = document.getElementById("gold")
const gold_passif = document.getElementById("gold_passif")
const gold_div = document.getElementById("gold_div")
const travail1 = document.getElementById("travail1")
const travail2 = document.getElementById("travail2")
const travail3 = document.getElementById("travail3")
const travail4 = document.getElementById("travail4")
const travail5 = document.getElementById("travail5")
const travail6 = document.getElementById("travail6")
//SECTION 3 FONSTIONS/METIER 

function monter(player) {
    player.altitude += player.clickpower
}

function incrementation_gold(player){
    player.gold +=  player.gold_power
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

function ajouter_travail1(player,nom,n) {
    player.gold_power += n
    travail1.textContent = nom + " : " + n
}

function ajouter_travail2(player,nom,n) {
    player.gold_power += n
    travail2.textContent = nom + " : " + n
}

function ajouter_travail3(player,nom,n) {
    player.gold_power += n
    travail3.textContent = nom + " : " + n
}

function ajouter_travail4(player,nom,n) {
    player.gold_power += n
    travail4.textContent = nom + " : " + n
}

function ajouter_travail5(player,nom,n) {
    player.gold_power += n
    travail5.textContent = nom + " : " + n
}

function ajouter_travail6(player,nom,n) {
    player.gold_power += n
    travail6.textContent = nom + " : " + n
}


//SECTION 4 AFFICHAGE

function update_interface(player) {
    if (auto === false) {
        auto_click.textContent = "Passif : OFF"
    } else {
        auto_click.textContent = "Passif : ON"
    }
    alt_montrer.textContent = "Altitude : " + player.altitude + "m"

    if (player.altitude >= 8849 && !everestAtteint) {
        alert("Vous avez atteint le sommet de l'everest  passif + 10")
        player.passif_global += 10
        everestAtteint = true
    }

    if (player.altitude % 5 === 0){
        incrementation_gold(player)
        update_gold(player)
    }
}

function update_gold(player){
    gold_montrer.textContent = player.gold + "$"
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
    if (auto && intervalId === null) {
        altitude_plus_ultra(player)
    }else {
        clearInterval(intervalId)
    intervalId = null
}}) 