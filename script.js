// SECTION 1 ETAT DU JEU
let player = {
    altitude: 0,
    clickpower: 1,
    passif_global: 1,
    gold: 0,
    gold_power: 1,
    personnage_m_multiplicateur: 1,
    personnage_gold_multiplicateur: 1,
}

let auto = false
let intervalId = null
let everestAtteint = false
let lastAltitudeGoldCheck = 0

let personnagesDebloques = new Set()
let eventsDeclenches = new Set()

const altitudeEvents = {
    100: "Le vent commence à hurler.",
    500: "La vallée disparaît derrière les nuages.",
    2000: "Respirer devient difficile."
}

const travaux = [
    { id: 1, nom: "Livreur", gain: 1, cout: 10, achete: false },
    { id: 2, nom: "Ouvrier", gain: 3, cout: 50, achete: false },
    { id: 3, nom: "Ingénieur", gain: 10, cout: 200, achete: false },
    { id: 4, nom: "Entrepreneur", gain: 25, cout: 1000, achete: false },
    { id: 5, nom: "homme du fond", gain: 100000000000, cout: 1000000000, achete: false }
]

const personnages = [
    { id: 1, nom: "kylian", bonus: 1, unite_du_bonus: "m", altitude_de_deblocage: 20, dialogue: "js vrm un tdc", achete: false },
    { id: 2, nom: "gianni ashkenaz", bonus: 10, unite_du_bonus: "$", altitude_de_deblocage: 50, dialogue: "GNEGNEGNAGN AGNA", achete: false },
    { id: 3, nom: "paffza", bonus: 1.25, unite_du_bonus: "m", altitude_de_deblocage: 1000, dialogue: "je suis vraiment l'homme du fond", achete: false },
    { id: 4, nom: "samiiiii", bonus: 5, unite_du_bonus: "m", altitude_de_deblocage: 2000, dialogue: "venez en stream a 18h sur kick : kick.com/roigodelin", achete: false }
]

// SECTION 2 DOM
const button = document.getElementById("altbtn")
const alt_montrer = document.getElementById("altitude")
const auto_click = document.getElementById("auto_click")
const gold_montrer = document.getElementById("gold")
const gold_passif = document.getElementById("gold_passif")
const pnj = document.getElementById("personnages")
const multiplicateurm = document.getElementById("multiplicateurm")
const multiplicateur_gold = document.getElementById("multiplicateur_gold")
const journalContent = document.getElementById("journal-content")

// SECTION 3 LOGIQUE

function monter(player) {
    player.altitude += player.clickpower * player.personnage_m_multiplicateur
}

function incrementation_gold(player) {
    player.gold += player.gold_power * player.personnage_gold_multiplicateur
}

function changer_passif_auto(auto) {
    return !auto
}

function altitude_plus_ultra(player) {
    if (intervalId !== null) return

    intervalId = setInterval(() => {
        monter(player)
        update_interface(player)
    }, 1000)
}

function ajouter_travail(travail) {
    if (travail.achete) return
    if (player.gold < travail.cout) return

    player.gold -= travail.cout
    player.gold_power += travail.gain
    travail.achete = true

    update_travaux()
    update_gold(player)
}

// ---------- PERSONNAGES ----------
function verifier_personnages(player) {
    personnages.forEach(personnage => {

        if (
            player.altitude >= personnage.altitude_de_deblocage &&
            !personnagesDebloques.has(personnage.id)
        ) {

            personnagesDebloques.add(personnage.id)
            personnage.achete = true

            ajouter_bonus_personnages(personnage)

            logCharacter(
                personnage.nom + " : " + personnage.dialogue.trim()
            )
        }
    })

    update_personnages()
}

function ajouter_bonus_personnages(personnage) {

    if (personnage.unite_du_bonus === "m") {
        player.personnage_m_multiplicateur += personnage.bonus
    }

    if (personnage.unite_du_bonus === "$") {
        player.personnage_gold_multiplicateur += personnage.bonus
    }

    update_multiplicateurs(player)
}

// ---------- EVENTS ALTITUDE ----------
function verifierEventsAltitude() {

    for (let altitudeEvent in altitudeEvents) {

        if (
            player.altitude >= altitudeEvent &&
            !eventsDeclenches.has(altitudeEvent)
        ) {
            eventsDeclenches.add(altitudeEvent)
            logEvent(altitudeEvents[altitudeEvent])
        }
    }
}

// ---------- JOURNAL ----------
function addJournalEntry(type, text) {

    if (!journalContent) return

    const entry = document.createElement("div")
    entry.classList.add("journal-entry", type)
    entry.textContent = text

    journalContent.appendChild(entry)
    journalContent.scrollTop = journalContent.scrollHeight
}

function logActe(text) { addJournalEntry("acte", text) }
function logEvent(text) { addJournalEntry("event", text) }
function logCharacter(text) { addJournalEntry("character", text) }

// SECTION 4 AFFICHAGE
function update_interface(player) {

    auto_click.textContent = auto ? "Passif : ON" : "Passif : OFF"
    alt_montrer.textContent = "Altitude : " + player.altitude + " m"

    // Everest
    if (player.altitude >= 8849 && !everestAtteint) {
        logEvent("Tu as atteint le sommet interdit.")
        player.passif_global += 10
        everestAtteint = true
    }

    // Gold fiable même si gros saut altitude
    while (Math.floor(player.altitude / 10) > lastAltitudeGoldCheck) {
        incrementation_gold(player)
        lastAltitudeGoldCheck++
    }

    update_gold(player)

    verifier_personnages(player)
    verifierEventsAltitude()
}

function update_gold(player) {
    gold_montrer.textContent = player.gold + "$"
}

function update_multiplicateurs(player) {
    multiplicateur_gold.textContent =
        "Multiplicateur $ : x" + player.personnage_gold_multiplicateur

    multiplicateurm.textContent =
        "Multiplicateur m : x" + player.personnage_m_multiplicateur
}

function update_travaux() {
    gold_passif.innerHTML = ""

    travaux.forEach(travail => {

        const li = document.createElement("li")

        if (travail.achete) {
            li.textContent = `${travail.nom} (+${travail.gain} gold / palier)`
        } else {
            li.textContent = `${travail.nom} — ${travail.cout}$`
            li.style.cursor = "pointer"
            li.addEventListener("click", () => ajouter_travail(travail))
        }

        gold_passif.appendChild(li)
    })
}

function update_personnages() {

    pnj.innerHTML = ""

    personnages.forEach(personnage => {

        if (!personnage.achete) return

        const li = document.createElement("li")

        li.textContent =
            `${personnage.nom} (bonus +${personnage.bonus} ${personnage.unite_du_bonus})`

        pnj.appendChild(li)
    })
}

// SECTION 5 EVENEMENTS

button.addEventListener("click", () => {
    monter(player)
    update_interface(player)
})

document.addEventListener("keydown", event => {

    if (event.code === "Space") {
        event.preventDefault()
        monter(player)
        update_interface(player)
    }
})

auto_click.addEventListener("click", () => {

    auto = changer_passif_auto(auto)

    if (auto) {
        altitude_plus_ultra(player)
    } else {
        clearInterval(intervalId)
        intervalId = null
    }

    update_interface(player)
})

// ---------- INITIALISATION ----------
update_travaux()
update_personnages()
update_multiplicateurs(player)
update_gold(player)

logActe(
    "Acte I — Le sol est déjà trop bas. L’air est froid. Monter semble être la seule option."
)
