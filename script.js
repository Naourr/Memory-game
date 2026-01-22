const main = document.querySelector("main")
const win = document.querySelector(".win")
const left_score = document.querySelector(".left")
const right_score = document.querySelector(".right")
const restart_btn = document.querySelector(".restart-btn")
const symbols = ["A","B","C","D","E","F"]
let cards_array
let cards
let first_flipped_index
let first_player = true
let locked = false
let won = false
let score1 = 0
let score2 = 0

function shuffle() {
    for (let i = 0; i < cards_array.length; i++) {
        let rand_index = Math.floor(Math.random() * cards_array.length);
        [cards_array[i], cards_array[rand_index]] = [cards_array[rand_index], cards_array[i]]
    }
}

function start_game() {
    first_player = true
    won = false
    locked = false
    score1 = 0
    score2 = 0

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
    })
    
    cards = document.querySelectorAll(".card")
    render()
}
start_game()

restart_btn.addEventListener("click", () => {
    start_game()
})

function handle_click(index) {
    if (cards_array[index].flipped || cards_array[index].matched || locked || won) return

    cards_array[index].flipped = true
    const flipped_unmatched_cards = cards_array.filter(card => card.flipped && !card.matched)

    if (flipped_unmatched_cards.length == 1) {
        first_flipped_index = index

    } else if (flipped_unmatched_cards.length == 2) {
        locked = true

        if (cards_array[first_flipped_index].symbol == cards_array[index].symbol) {
            cards_array[first_flipped_index].matched = true
            cards_array[index].matched = true
            
            first_player ? score1 += 1 : score2 += 1
        } else {
            first_player ? first_player = false : first_player = true
        }

        setTimeout(() => {
            cards_array.forEach(card => {
                if (!card.matched) card.flipped = false
            })
            locked = false
            
            won = cards_array.every(card => card.matched)

            render()
        }, 300)
    }
    render()
}

function render() {
    locked ? (main.style.pointerEvents = "none") : (main.style.pointerEvents = "all")
    cards_array.forEach((card, index) => {
        (card.flipped || card.matched) ? cards[index].classList.add("flipped") : cards[index].classList.remove("flipped")
    })
    left_score.innerHTML = score1
    right_score.innerHTML = score2
    first_player ? main.classList.add("player1") : main.classList.remove("player1")
    won ? win.classList.add("active") : win.classList.remove("active")
}