// live
let added = document.getElementsByClassName('added')

// static
let body = document.body
let cartWrap = document.querySelector('.cart-wrap')
let total = document.querySelector('.total')
let checkout = document.querySelector('.checkout')
let header = document.querySelector('header')
let books = document.querySelector('.books')
let cloth = document.querySelector('.cloth')
let big = document.querySelector('.new')

total.addEventListener('click', function() {
    cartWrap.classList.toggle('active')
})

let n = 0

products.forEach(p => {

    for (let v of p.variants) {

        let shopLine = document.createElement('div')

        let title = document.createElement('span')
        title.classList.add('title')
        title.append(p.title)
        if (v.title) title.append(' ' + v.title)

        let desc = document.createElement('div')
        desc.classList.add('desc')
        
        desc.innerHTML = p.desc.replace(/(style|height|width)=".+?"/g, '')

        if (v.available !== true & p.type !== "big") {
            shopLine.classList.add('shop', 'line', 'no-price')
            let top = document.createElement('div')
            top.classList.add('top')
            top.append(title)
            shopLine.append(top, desc)
            return books.append(shopLine)
        }

        shopLine.dataset.id = v.id
        shopLine.dataset.handle = p.handle
        shopLine.dataset.price = v.price
        shopLine.dataset.qty = '0'

        let cartLine = shopLine.cloneNode(true)

        let price 
        if (v.initPrice) {
            let initPrice = document.createElement('div')
            let salePrice = document.createElement('div')
            initPrice.classList.add('init', 'price')
            initPrice.append(Math.round(v.initPrice / 100) + " ")
            salePrice.classList.add('sale', 'price')
            salePrice.append(Math.round(v.price / 100) + " ")
            price = document.createElement('div')
            price.classList.add('price-wrapper')
            price.append(initPrice, salePrice)
        } else {
            price = document.createElement('span')
            price.classList.add('price')
            price.append(Math.round(v.price / 100) + " ")
        }

        let plus = document.createElement('button')
        plus.classList.add('toggle', 'plus')
        plus.append('+')

        let shopTitle = title.cloneNode(true)
        let shopPrice = price.cloneNode(true)
        let top = document.createElement('div')
        top.classList.add('top')
        top.append(shopPrice, shopTitle, plus)

        let qty = document.createElement('input')
        qty.classList.add('qty')
        qty.type = 'tel'
        qty.value = '0'

        let minus = document.createElement('button')
        minus.classList.add('toggle', 'minus')
        minus.append('-')

        let right = document.createElement('span')
        right.classList.add('right')
        right.append(qty, minus)

        cartLine.append(price, title, right)

        shopLine.classList.add('shop', 'line')
        cartLine.classList.add('cart', 'line', 'hidden')
        cartLine.hidden = true

        checkout.before(cartLine)

        
        shopLine.append(top)

        if (p.media) {
            let media = document.createElement('div')
            media.classList.add('media')
            p.media.forEach(a => {
                if (a.src) {
                    let images = document.createElement('div')
                    images.classList.add('images')
                    let img = document.createElement('img')
                    img.src = a.src
                    media.append(img)
                } else if (a.html) {
                    media.innerHTML += a.html
                }
            })
            shopLine.append(media)
        }

        shopLine.append(desc)

        if (p.type == 'cloth') cloth.append(shopLine)
        else if (p.type == 'big') big.append(shopLine)
        else books.append(shopLine)


    }

})

let lineHeight = document.querySelector('.shop.line:not(.expanded)').getBoundingClientRect().height
window.addEventListener('resize', () => lineHeight = document.querySelector('.shop.line:not(.expanded)').getBoundingClientRect().height);
let sections = Array.from(document.querySelectorAll('section'))
let tops = Array.from(document.querySelectorAll('.shop.line>.top'))
let descs = Array.from(document.querySelectorAll('desc'))
let cartLines = Array.from(document.querySelectorAll('.cart.line'))
let shopLines = Array.from(document.querySelectorAll('.shop.line'))
let titles = Array.from(document.querySelectorAll('.title')).concat()
let toggles = Array.from(document.querySelectorAll('.toggle'))
let qtys = Array.from(document.querySelectorAll('.qty'))

Array.from(document.querySelectorAll('a')).forEach(a => a.setAttribute("tabindex","-1"))
total.setAttribute("tabindex", "0")
cartWrap.addEventListener('click', e => e.target.classList.toggle('active'))
cartLines.forEach(a => show(a))

tops.forEach(a => {a.addEventListener('click', expandLines)})
Array.from(document.querySelectorAll('h1')).forEach(a => {a.addEventListener('click', expandSections)})
function expandSections(e) {
    e.target.parentNode.parentNode.classList.toggle('expanded')
}
function expandLines(e) {
    if (e.target.classList.contains('toggle') !== true) {
        let parent = e.target.parentNode.parentNode
        let height = 0
        let expanded = document.querySelector('.shop.line.expanded')
        if (expanded) {
            if (expanded.getBoundingClientRect().bottom < window.innerHeight) {
                height = expanded.getBoundingClientRect().height - lineHeight
            }
            if (expanded !== parent) {
                window.scrollTo(0, window.scrollY - height)
                expanded.classList.remove('expanded')
            }
            else {
                window.scrollTo(0, window.scrollY + parent.getBoundingClientRect().top - e.target.parentNode.getBoundingClientRect().top)
            }
        }
        parent.classList.toggle('expanded')
        let handle = parent.dataset.handle
        history.pushState({ 'handle': handle}, '', `/products/${handle}`)
    }
}
toggles.forEach(a => {a.addEventListener('click', toggle)})
qtys.forEach(a => {
    a.addEventListener('blur', function(e) {
        qty(e)
    })
    a.addEventListener("keydown", (event) => {
        if (event.key == 'Enter') {
            console.log('h')
            a.blur()
        }
    });
})
descs.forEach(a => {
    Array.from(a.querySelectorAll('img')).forEach(b => a.insertBefore(b, a.querySelector('h3')))
})

  



function updateCart() {
    if (added.length > 0) {
        show(total)
        document.documentElement.style.setProperty('--c', '1em')
        total.innerText = "$" + Math.round(Array.from(added).reduce((p, c) => p + parseInt(c.dataset.price) * parseInt(c.dataset.qty), 0) / 200)
    }
    else {
        hide(total)
        document.documentElement.style.setProperty('--c', '0')
        cartWrap.classList.remove('active')
        total.innerText = ""
    }
}


function toggle(e) {

    let parent = e.target.parentNode.parentNode
    let qty = parent.classList.contains('added') ? 0 : 1
    let id = parent.dataset.id
    let route = qty == 1 ? 'add' : 'change'
    let ids = Array.from(document.querySelectorAll(`[data-id='${id}']`))

    ids.forEach(id => {
        id.classList.toggle('added')
        id.dataset.qty = qty
        if (id.classList.contains('cart')) id.querySelector('.qty').value = qty        
    })

    updateCart()

    let add = `{"items": [{"id": ${id},"quantity": ${qty}}]}`
    let change = `{"id": "${id}", "quantity": 0}`
    let body = qty == 1 ? add : change

    fetch(window.Shopify.routes.root + `cart/${route}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}



function qty(e) {

    let id = e.target.parentNode.parentNode.dataset.id
    let qty = parseInt(e.target.value)
    if (e.target.value == '') qty = 0

    let ids = Array.from(document.querySelectorAll(`[data-id='${id}']`))
    ids.forEach(id => {
        if (qty == 0) id.classList.remove('added')
        id.dataset.qty = qty
    })

    updateCart()

    fetch(window.Shopify.routes.root + 'cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"id": "${id}", "quantity": ${qty}}`
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}





fetch('/cart.js', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
})
.then((response) => response.json())
.then((data) => {
    data.items.forEach(function (item) {
        Array.from(document.querySelectorAll(`[data-id='${item.id}']`)).forEach(line => {
            line.classList.add('added')
            line.dataset.qty = item.quantity
            if (line.classList.contains('cart')) line.querySelector('.qty').value = item.quantity
        })
    })
    updateCart()
    show(cartWrap)
})
.catch((error) => {
    console.error('Error:', error);
});


function show(a) {
    a.classList.remove('hidden')
    a.hidden = a.classList.contains('hidden') ? true : false
}
function hide(a) {
    a.classList.add('hidden')
    a.hidden = a.classList.contains('hidden') ? true : false
}

function toggleHidden(a) {
    a.classList.toggle('hidden')
    a.hidden = a.classList.contains('hidden') ? true : false
}


document.addEventListener("click", function(e) {console.log(e.target)})