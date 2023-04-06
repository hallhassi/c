// window.addEventListener('load', function(){document.querySelector('iframe').remove()})

let added = document.getElementsByClassName('added'),
    ds = document.querySelectorAll('.d'),
    cart = document.querySelector('#cart'),
    menu = document.querySelector('#menu'),
    total = cart.querySelector('#total'),
    buys = Array.from(document.querySelectorAll('.buy')),
    qtys = Array.from(document.querySelectorAll('.qty')),
    summaries = Array.from(document.querySelectorAll('summary'))

// summary closes other summaries
window.addEventListener('mousedown', (e) => {
    if (e.target.parentNode.id !== 'menu' && e.target.tagName == "SUMMARY" || e.target.tagName == "BODY") {
        Array.from(document.querySelectorAll('summary')).forEach(s => { 
            if (s !== e.target && s !== ds[0].querySelector('summary')) s.parentNode.open = false})
    }
})

// pushState
window.addEventListener('mousedown', (e) => {
    let h = "h"
    if (history.state) h = history.state.handle
    if (e.target.parentNode.open == false && e.target.parentNode.classList.contains('d') && h !== e.target.parentNode.dataset.handle) {
        let handle = e.target.parentNode.dataset.handle
        history.pushState({'handle': handle}, '', `/products/${handle}`)
        try {document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ')}
        catch (Exception){}
        document.title = handle;
        console.log(handle)
    }
})

// menu
let checkboxes = Array.from(document.querySelectorAll("#menu input"))
checkboxes.forEach(c => c.addEventListener('change', function() {
  if (this.checked) {
    document.querySelector(`link[rel='stylesheet'][media='all']`).href = this.dataset.url
    if (this.id == 'list') window.removeEventListener('scroll', scroll)
    else if (this.id == 'scroll') window.addEventListener('scroll', scroll)
  }
}))

// hide menu on scroll
window.addEventListener('scroll', () => menu.open = false)

// big ticket
ds[0].open = true
document.querySelector('video>img').remove()

// scroll 

scroll()
window.addEventListener('scroll', scroll)

function scroll() {
    let nowPrecise = ds.length * document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight),
        now = Math.floor(nowPrecise), then,
        imgs = Array.from(ds[now].querySelectorAll('img'))
        
    // product

    if (then !== now) {
        then = now
        ds.forEach(d => d.classList.remove('vis'))
        ds[now].classList.add('vis')
        Array.from(document.querySelectorAll('.d')).slice(1).forEach(d => d.open = false) // slice for big ticket
    }

    // image

    requestAnimationFrame(() => {
        let m = imgs[Math.floor(imgs.length * (nowPrecise - now))],
            canvas = document.querySelector('canvas#canvas'),
            context = canvas.getContext("2d")
        if (imgs.length>0) {
            canvas.width = m.naturalWidth
            canvas.height = m.naturalHeight
            context.drawImage(m, 0, 0, m.naturalWidth, m.naturalHeight)
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height)
        }
    })
}

// update Cart and Total

function updateCart() {
    added.length > 0 ? show(cart) : hide(cart)
    let addedtocart = cart.querySelectorAll('.added')
    total.innerText = "$" + Array.from(addedtocart).reduce((p, c) => p + parseInt(c.dataset.price) * c.parentNode.querySelector('.qty').value, 0) / 100
}

// toggle Item

function toggleItem(id) {
    let ids = Array.from(document.querySelectorAll(`[data-id='${id}']`))
    ids.forEach(id => {
        let inCart = id.parentNode.querySelector('.qty')
        id.classList.toggle('added')
        if (id.classList.contains('added')){
            id.innerText = "remove"
            if (inCart) show(id.parentNode)
        } else {
            id.innerText = "buy"
            if (inCart) {
                hide(id.parentNode)
                id.parentNode.querySelector('.qty').value = 1
            }
        }
    })
}

// buy/remove

buys.forEach(a => {a.addEventListener('click', function (e) {
    let id = e.target.dataset.id, route, body
    if (e.target.classList.contains('added')) {
        route = 'change'
        body = `{"id": "${id}", "quantity": 0}`
    } else {
        route = 'add'
        body = `{"items": [{"id": ${id},"quantity": 1}]}`
    }
    toggleItem(id)
    updateCart()
    fetch(window.Shopify.routes.root + `cart/${route}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    }).catch((error) => {console.error('Error:', error)})
})})

// qtys

qtys.forEach(a => {
    a.addEventListener("keydown", function(e) {if (e.key == 'Enter') a.blur()})
    a.addEventListener('blur', function (e) {
        let id = e.target.parentNode.querySelector('.buy').dataset.id, qty
        qty = e.target.value == '' ? 0 : parseInt(e.target.value)
        if (qty == 0) {
            toggleItem(id) 
            e.target.value = 1
        }
        updateCart()
        fetch(window.Shopify.routes.root + 'cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: `{"id": "${id}", "quantity": ${qty}}`
        }).catch((error) => {console.error('Error:', error)})
    })
})

// change Qty

function changeQty(id, qty) {
    let q = cart.querySelector(`[data-id='${id}']`)
    q.parentNode.querySelector('.qty').value = qty
}

// fetch

fetch('/cart.js', {method: 'GET',headers: { 'Content-Type': 'application/json' }})
.then((response) => response.json())
.then((data) => {
    data.items.forEach(function(item) {
        toggleItem(item.id)
        changeQty(item.id, item.quantity)
    })
    updateCart()
}).catch((error) => {console.error('Error:', error);});

// show hide

function show(a) {
    a.classList.remove('hidden')
    a.hidden = false
}

function hide(a) {
    a.classList.add('hidden')
    a.hidden = true
}

function toggle(a) {
    a.hidden ? show(a) : hide(a)
}