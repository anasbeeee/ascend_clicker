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

const travaux = [
    { id: 1, nom: "Livreur", gain: 1, cout: 10, achete: false },
    { id: 2, nom: "Ouvrier", gain: 3, cout: 50, achete: false },
    { id: 3, nom: "Ingénieur", gain: 10, cout: 200, achete: false },
    { id: 4, nom: "Entrepreneur", gain: 25, cout: 1000, achete: false },
    {id:5, nom: "homme du fond", gain: 100000000000, cout: 1000000000,achete: false}
]

const personnages = [
    { id: 1, nom: "kylian", bonus: 1, unite_du_bonus: "m", altitude_de_deblocage: 20, dialogue: "js vrm un tdc", achete: false, sprite: "" },
    { id: 2, nom: "gianni ashkenaz", bonus: 10, unite_du_bonus: "$", altitude_de_deblocage: 50, dialogue: "GNEGNEGNAGN    AGNA", achete: false, sprite: "" },
    { id: 3, nom: "paffza", bonus: 12.5, unite_du_bonus: "m", altitude_de_deblocage: 1000, dialogue: "je suis vraiment l'homme du fond  ", achete: false, sprite: "" }
]

// SECTION 2 SELECTION DU DOM
const button = document.getElementById("altbtn")
const alt_montrer = document.getElementById("altitude")
const auto_click = document.getElementById("auto_click")
const gold_montrer = document.getElementById("gold")
const gold_passif = document.getElementById("gold_passif")
const pnj = document.getElementById("personnages")
const multiplicateurm = document.getElementById("multiplicateurm")
const multiplicateur_gold = document.getElementById("multiplicateur_gold")
const journalContent = document.getElementById("journal-content");

// SECTION 3 FONCTIONS / METIER
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

function verifier_personnages(player) {
    personnages.forEach(personnage => {
        if (!personnage.achete && player.altitude >= personnage.altitude_de_deblocage) {
            personnage.achete = true
            ajouter_bonus_personnages(personnage)
            addJournalEntry(
                "character",
                personnage.nom + " : " + personnage.dialogue
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


function addJournalEntry(type, text) {
    const entry = document.createElement("div");
    entry.classList.add("journal-entry", type);

    entry.textContent = text;

    journalContent.appendChild(entry);

    // auto-scroll vers le bas
    journalContent.scrollTop = journalContent.scrollHeight;
}

// SECTION 4 AFFICHAGE
function update_interface(player) {
    auto_click.textContent = auto ? "Passif : ON" : "Passif : OFF"
    alt_montrer.textContent = "Altitude : " + player.altitude + " m"

    if (player.altitude >= 8849 && !everestAtteint) {
        alert("tu as atteint l'everest")
        addJournalEntry(
            "event",
            "tu as atteint l'everest!!!!!"
        )
        player.passif_global += 10
        everestAtteint = true
    }

    if (Math.floor(player.altitude / 10) > lastAltitudeGoldCheck) {
        incrementation_gold(player)
        lastAltitudeGoldCheck = Math.floor(player.altitude / 10)
        update_gold(player)
    }

    verifier_personnages(player)
}

function update_gold(player) {
    gold_montrer.textContent = player.gold + "$"
}

function update_multiplicateurs(player) {
    multiplicateur_gold.textContent = "Multiplicateur $ : +" + player.personnage_gold_multiplicateur
    multiplicateurm.textContent = "Multiplicateur m : +" + player.personnage_m_multiplicateur
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
        if (personnage.achete){
        const li = document.createElement("li")
        li.textContent = personnage.achete
            ? `${personnage.nom} (bonus +${personnage.bonus} ${personnage.unite_du_bonus})`
            : `${personnage.nom} — débloqué à ${personnage.altitude_de_deblocage} m`
        pnj.appendChild(li)
        }
    })
}

// SECTION 5 EVENEMENTS
button.addEventListener("click", () => {
    monter(player)
    update_interface(player)
})

document.addEventListener("keyup", event => {
    if (event.code === "Space") {
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

update_travaux()
update_personnages()
update_multiplicateurs(player)
update_gold(player)
addJournalEntry(
    "acte",
    "Acte I — Le sol est déjà trop bas. L’air est froid. Monter semble être la seule option."
);

addJournalEntry(
    "event",
    "oe kylian le pti tdc"
)


addJournalEntry(
    "event",
    "JULIEN BONJOUR"
)