// live
let added = document.getElementsByClassName('added')

// static
let body = document.body
let cartWrap = document.querySelector('.cart-wrap')
let total = document.querySelector('.total')
let checkout = document.querySelector('.checkout')

// storage
let scroll, curQty, x, y

products.forEach(p => {

    for (let v of p.variants) {

        let shopLine = document.createElement('div')

        shopLine.dataset.id = v.id
        shopLine.dataset.price = v.price
        shopLine.dataset.qty = '0'

        let title = document.createElement('span')
        title.classList.add('title')
        title.append(p.title)

        let price = document.createElement('span')
        price.classList.add('price')
        price.append(Math.round(v.price / 100) + " ")

        let qty = document.createElement('input')
        qty.classList.add('qty')
        qty.type = 'number'
        qty.value = '0'

        let plus = document.createElement('button')
        plus.classList.add('toggle', 'plus')
        plus.append('+')

        let minus = document.createElement('button')
        minus.classList.add('toggle', 'minus')
        minus.append('+')

        let right = document.createElement('div')
        right.classList.add('right')
        right.append(qty, minus)

        shopLine.append(price, title)
        let cartLine = shopLine.cloneNode(true)
        cartLine.append(right)
        shopLine.append(plus)

        shopLine.classList.add('shop', 'line')
        cartLine.classList.add('cart', 'line')

        body.append(shopLine)
        
        total.before(cartLine)

    }

})


let cartLines = document.querySelectorAll('.cart.line')
Array.from(cartLines).forEach(a => show(a))


let lines = Array.from(document.querySelectorAll('.line'))
let titles = Array.from(document.querySelectorAll('.title'))
let shopLines = Array.from(document.querySelectorAll('.shop-line'))
let qtys = Array.from(document.querySelectorAll('.qty'))
let buttons = Array.from(document.querySelectorAll('.toggle'))
titles.forEach(a => {a.addEventListener('click', e => e.target.parentNode.classList.toggle('expanded'))})
qtys.forEach(a => {a.addEventListener('click', qty)})
buttons.forEach(a => {a.addEventListener('click', button)})
total.addEventListener('click', totalClick)



let marginTop = `translate(0, var(--li) * -${1 + (added.length / 2)}))`

function updateCart() {
    if (added.length > 0) {
        total.innerText = "$" + Math.round(Array.from(added).reduce((p, c) => p + parseInt(c.dataset.price) * parseInt(c.dataset.qty), 0) / 200)
    }
    else total.innerText = ""
    cartWrap.style.transform = marginTop
}

function totalClick() {
    cartWrap.style.transform = added.length > 0 ? cartWrap.style.transform = marginTop : 'translate(0, -var(--li))'
}




function qty() {

    let id = parseInt(this.parentNode.dataset.id)
    let qty = parseInt(this.innerText)

    if (qty == 0) {
        this.parentNode.classList.remove('added')
    }
    this.parentNode.dataset.qty = qty

    updateCart()


}

function button(e) {

    let qty = e.target.parentNode.classList.contains('added') ? 0 : 1
    let id = e.target.parentNode.dataset.id
    let route = qty == 1 ? 'add' : 'change'

    e.target.parentNode.classList.toggle('added')
    e.target.parentNode.dataset.qty = qty

    updateCart()

    let add = `{"items": [{"id": ${id},"quantity": ${qty}}]}`
    let change = `{"id": "${id}", "quantity": 0}`
    let body = qty == 1 ? add : change

}


function show(a) {
    a.classList.remove('hidden')
    a.hidden = false
}

function hide(a) {
    a.classList.add('hidden')
    a.hidden = true
}

function toggleHidden(a) {
    a.classList.toggle('hidden')
    a.hidden = a.classList.contains('hidden') ? true : false
}

document.addEventListener("click", function(e) {console.log(e.target)})