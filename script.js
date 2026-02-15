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
let lastAltitudeGoldCheck = 0

let personnagesDebloques = new Set()
let eventsDeclenches = new Set()

const altitudeEvents = {
    70: "L’air est étrangement immobile.",
    3000: "Tu entends le vent murmurer ton nom.",
    300: "Le chemin derrière toi n’existe plus.",
    600: "Des traces apparaissent à côté des tiennes.",
    1000: "Tu réalises que tu n’as jamais regardé en bas.",
    1800: "Quelqu’un te regarde depuis les nuages.",
    3000: "Tes pensées deviennent floues.",
    4000: "La montagne semble respirer.",
    6000: "Tu comprends qu’elle te laisse monter.",
    9000: "Tu as déjà vécu ce moment.",
    11000: "Le sommet n’est pas un endroit.",
    1700: "Tu montes encore. Mais ce n’est plus toi."
}


const travaux = [
    { id: 1, nom: "Porteur local", gain: 1, cout: 10, achete: false },
    { id: 2, nom: "Cartographe perdu", gain: 3, cout: 80, achete: false },
    { id: 3, nom: "Chercheur d’altitude", gain: 8, cout: 300, achete: false },
    { id: 4, nom: "Expédition financée", gain: 20, cout: 1500, achete: false },
    { id: 5, nom: "Marcheurs du Ciel", gain: 60, cout: 8000, achete: false },
    { id: 6, nom: "Machine d’ascension", gain: 200, cout: 40000, achete: false },
    { id: 7, nom: "L’Appel du Vide", gain: 1200, cout: 200000, achete: false }
]


const personnages = [
    {
        id: 1,
        nom: "Le Guide Silencieux",
        bonus: 1,
        unite_du_bonus: "m",
        altitude_de_deblocage: 50,
        dialogue: "Je connais le chemin. Pas la destination.",
        achete: false
    },
    {
        id: 2,
        nom: "La Touriste Égarée",
        bonus: 2,
        unite_du_bonus: "$",
        altitude_de_deblocage: 300,
        dialogue: "Je voulais juste une photo…",
        achete: false
    },
    {
        id: 3,
        nom: "Le Géologue",
        bonus: 1.5,
        unite_du_bonus: "m",
        altitude_de_deblocage: 1000,
        dialogue: "Cette montagne n’est sur aucune carte.",
        achete: false
    },
    {
        id: 4,
        nom: "Le Moine du Vent",
        bonus: 4,
        unite_du_bonus: "$",
        altitude_de_deblocage: 4000,
        dialogue: "Le sommet est une idée, pas un lieu.",
        achete: false
    },
    {
        id: 5,
        nom: "L’Enfant Pressé",
        bonus: 3,
        unite_du_bonus: "m",
        altitude_de_deblocage: 5000,
        dialogue: "Pourquoi tu montes si lentement ?",
        achete: false
    },
    {
        id: 6,
        nom: "La Voix Derrière Toi",
        bonus: 8,
        unite_du_bonus: "$",
        altitude_de_deblocage: 7000,
        dialogue: "Continue. Tu es presque arrivé.",
        achete: false
    },
    {
        id: 7,
        nom: "L’Alpiniste Sans Visage",
        bonus: 5,
        unite_du_bonus: "m",
        altitude_de_deblocage: 8000,
        dialogue: "Je suis arrivé avant toi.",
        achete: false
    },
    {
        id: 8,
        nom: "L’Architecte du Sommet",
        bonus: 15,
        unite_du_bonus: "$",
        altitude_de_deblocage: 19000,
        dialogue: "Tu n’as jamais choisi de monter.",
        achete: false
    }
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

function verifierActes() {

    if (player.altitude >= 0 && !eventsDeclenches.has("acte1")) {
        eventsDeclenches.add("acte1")
        logActe("Acte I — La montagne est réelle.")
    }

    if (player.altitude >= 4000 && !eventsDeclenches.has("acte2")) {
        eventsDeclenches.add("acte2")
        logActe("Acte II — La montagne observe.")
    }

    if (player.altitude >= 7000 && !eventsDeclenches.has("acte3")) {
        eventsDeclenches.add("acte3")
        logActe("Acte III — Tu n’es plus seul dans ta tête.")
    }

    if (player.altitude >= 15500 && !eventsDeclenches.has("acte4")) {
        eventsDeclenches.add("acte4")
        logActe("Acte IV — Le sommet n’existe pas.")
    }
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

    // Gold fiable même si gros saut altitude
    while (Math.floor(player.altitude / 10) > lastAltitudeGoldCheck) {
        incrementation_gold(player)
        lastAltitudeGoldCheck++
    }

    update_gold(player)

    verifier_personnages(player)
    verifierEventsAltitude()
    verifierActes()

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

//  INITIALISATION 
update_travaux()
update_personnages()
update_multiplicateurs(player)
update_gold(player)

