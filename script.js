const main = document.querySelector("main")
const win = document.querySelector(".win")
const restart_btn = document.querySelector(".restart-btn")
let cards
let cards_array
const symbols = ["A","B","C","D","E","F"]
let first_flipped_index

function shuffle() {
    for (let i = 0; i < cards_array.length; i++) {
        let rand_index = Math.floor(Math.random() * cards_array.length)
        let temp = cards_array[i]
        cards_array[i] = cards_array[rand_index]
        cards_array[rand_index] = temp
    }
}

function start_game() {
    win.classList.remove("active")
    main.style.pointerEvents = "all"
    main.innerHTML = ""
    cards_array = [...symbols, ...symbols].map((s, i) => (
        {
            id: i,
            symbol: s,
            flipped: false,
            matched: false
        }
    ))
    shuffle()
    cards_array.forEach((card, index) => {
        let div = document.createElement("div")
        div.classList.add("card")
        div.textContent = card.symbol
        div.onclick = () => handle_click(index)
        main.appendChild(div)
    });
    cards = document.querySelectorAll(".card")
}
start_game()

restart_btn.addEventListener("click", () => {
    start_game()
})

function handle_click(index) {
    if (!cards_array[index].flipped) {
        cards_array[index].flipped = true
        cards[index].classList.add("flipped")
    }

    let flipped_unmatched_cards = cards_array.filter(card => card.flipped && !card.matched)

    if (flipped_unmatched_cards.length == 1) {
        first_flipped_index = index
    } else if (flipped_unmatched_cards.length == 2) {
        if (cards_array[first_flipped_index].symbol === cards_array[index].symbol) {
            cards_array[first_flipped_index].matched = true
            cards_array[index].matched = true
        }
        main.style.pointerEvents = "none"

        setTimeout(() => {
            cards.forEach((card, i) => {
                if (!cards_array[i].matched) {
                    cards_array[i].flipped = false
                    card.classList.remove("flipped")
                }
            })
            main.style.pointerEvents = "all"

            const matched_count = cards_array.filter(card => card.matched).length
            if (matched_count === cards_array.length) {
                win.classList.add("active")
            }
        }, 301)
    }
}

