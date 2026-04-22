const bar=document.getElementById('bar');
const close=document.getElementById('close');
const nav=document.getElementById('navbar');
const news=document.getElementById('sign-button');



if(bar){
    bar.addEventListener('click', () =>{
        nav.classList.add('active');
    })
}
if(close){
    close.addEventListener('click', () =>{
        nav.classList.remove('active');
    })
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLinks = document.querySelectorAll('#lg-bag a, #mobile a[href="cart.html"]');
    cartLinks.forEach(link => {
        let badge = link.querySelector('.cart-badge');
        if (!badge && count > 0) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.style.cssText = 'position:absolute; top:-8px; right:-8px; background:#088178; color:white; border-radius:50%; padding:2px 6px; font-size:12px;';
            link.style.position = 'relative';
            link.appendChild(badge);
        }
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    });
}

function addToCart(id, name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart(cart);
    alert(`${name} added to cart!`);
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}

function updateQuantity(id, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        saveCart(cart);
        renderCart();
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderCart() {
    const tbody = document.querySelector('#cart-items');
    if (!tbody) return;
    
    const cart = getCart();
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px;">Your cart is empty!</td></tr>';
        document.getElementById('subtotal').style.display = 'none';
        return;
    }
    
    document.getElementById('subtotal').style.display = 'block';
    
    tbody.innerHTML = cart.map(item => `
        <tr>
            <td><a href="#" onclick="removeFromCart('${item.id}'); return false;"><i class="far fa-times-circle" style="color:#e74c3c; font-size:20px; text-decoration:none;"></i></a></td>
            <td><img src="${item.image}" alt="${item.name}" style="width:70px;"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input style="width:75px; height:30px" type="number" value="${item.quantity}" onchange="updateQuantity('${item.id}', this.value)"></td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');
    
    const subtotal = getCartTotal();
    const total = subtotal;
    
    const totalsTable = document.querySelector('#subtotal table');
    if (totalsTable) {
        totalsTable.innerHTML = `
            <tr>
                <td>Cart Subtotal</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Shipping</td>
                <td>Free</td>
            </tr>
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>$${total.toFixed(2)}</strong></td>
            </tr>
        `;
    }
}

function initCartButtons() {
    document.querySelectorAll('.cart').forEach(btn => {
        const link = btn.closest('a');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pro = this.closest('.pro');
                if (pro) {
                    const img = pro.querySelector('img').src;
                    const imgName = img.split('/').pop();
                    const nameEl = pro.querySelector('h5') || pro.querySelector('h4').previousElementSibling;
                    const name = nameEl ? (nameEl.textContent || 'Product') : 'Product';
                    const priceText = pro.querySelector('h4').textContent.replace('$', '');
                    const price = parseFloat(priceText) || 0;
                    const id = 'prod_' + imgName.substring(0, 10) + Math.floor(price);
                    let imgPath = imgName;
                    if (!imgName.startsWith('images/') && !imgName.startsWith('shopimages/')) {
                        imgPath = 'images/' + imgName;
                    }
                    addToCart(id, name, price, imgPath);
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initCartButtons();
    if (document.querySelector('#cart-items')) {
        renderCart();
    }
});
