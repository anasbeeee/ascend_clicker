const Player = {
    altitude: 0,
    clickpower: 1,
    passif_global : 1 
}

console.log(Player)

function click(Player){
    Player.altitude += Player.clickpower
}

// for (let i = 0; i < 6; i++) {
    // click(Player)
    // console.log(Player)
// }

const button = document.getElementById("altbtn")
const alt_montrer = document.getElementById("altitude")

button.addEventListener("click", () => {
    click(Player)
    alt_montrer.textContent = "Altitude : " + Player.altitude
})

button.addEventListener("Space", () => {
    click(Player)
    alt_montrer.textContent = "Altitude :" + Player.altitude
} )


