const prices = {
    'Apple':450,
    'Banana':500,
    'Orange':600,
    'Grapes':800,
    'Mango':500,
    'Pineapple':543,
    'Carrot': 640,
    'Beans':440,
    'beet-root':540,
    'Potato': 210,
    'Tomato':350,
    'Onion':400,
    'milk-powder':1200,
    'Cheese': 2000,
    'Yogurt':60,
    'Butter':2300,
    'Cream': 2500,
    'Eggs': 55,
    'Chicken':1500,
    'Salmon':1200,
    'Beef':3200,
    'Shrimp':1000,
    'Pork':2000,
    'Lamb':1100,
    'Flour':1200,
    'Sugar':700,
    'Baking Powder':900,
    'salt':320,
    'vanilla':522,
    'chocolate-powder':400,
};

function addItem(name, category) {
    const quantityInput = document.getElementById(`${name.toLowerCase().replace(' ', '-')}-quantity`);
    const quantity = parseFloat(quantityInput.value);
    if (quantity > 0) {
        const price = prices[name] * quantity;
        const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];
        const rows = tableBody.getElementsByTagName('tr');
        let itemExists = false;
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[0].textContent === name) {
                const existingQuantity = parseFloat(row.cells[2].textContent);
                row.cells[2].textContent = (existingQuantity + quantity).toFixed(1);
                row.cells[3].textContent = (parseFloat(row.cells[3].textContent) + price).toFixed(2);
                itemExists = true;
                break;
            }
        }

        if (!itemExists) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = name;
            row.insertCell(1).textContent = category;
            row.insertCell(2).textContent = quantity.toFixed(1);
            row.insertCell(3).textContent = price.toFixed(2);
            row.insertCell(4).innerHTML = '<button onclick="removeItem(this)">Remove</button>';
        }
        updateTotalPrice();
        alert(`Added ${quantity.toFixed(1)} kg of ${name} to your order.`);
    } else {
        alert(`Please enter a quantity greater than 0 for ${name}.`);
    }
}

function removeItem(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateTotalPrice();
}

// Function to update total price
function updateTotalPrice() {
    let totalPrice = 0;
    const rows = document.querySelectorAll('#order-table tbody tr');
    rows.forEach(row => {
        const price = parseFloat(row.children[3].textContent);
        totalPrice += price;
    });
    document.getElementById('total-price').textContent = `Rs.${totalPrice.toFixed(2)}`;
}

function addToFavourites() {
    const rows = document.querySelectorAll('#order-table tbody tr');
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    rows.forEach(row => {
        const itemName = row.children[0].textContent;
        const category = row.children[1].textContent;
        const quantity = row.children[2].textContent;
        const price = row.children[3].textContent;
        
        if (!favourites.some(fav => fav.itemName === itemName)) {
            favourites.push({ itemName, category, quantity, price });
        }
    });

    localStorage.setItem('favourites', JSON.stringify(favourites));
    alert('Items added to favourites.');
}

function applyFavourites() {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];

    favourites.forEach(fav => {
        const rows = tableBody.getElementsByTagName('tr');
        let itemExists = false;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[0].textContent === fav.itemName) {
                const existingQuantity = parseFloat(row.cells[2].textContent);
                const quantityToAdd = parseFloat(fav.quantity);
                row.cells[2].textContent = (existingQuantity + quantityToAdd).toFixed(1);
                row.cells[3].textContent = (parseFloat(row.cells[3].textContent) + (prices[fav.itemName] * quantityToAdd)).toFixed(2);
                itemExists = true;
                break;
            }
        }

        if (!itemExists) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = fav.itemName;
            row.insertCell(1).textContent = fav.category;
            row.insertCell(2).textContent = fav.quantity;
            row.insertCell(3).textContent = fav.price;
            row.insertCell(4).innerHTML = '<button onclick="removeItem(this)">Remove</button>';
        }
    });

    updateTotalPrice();
    alert('Favourites applied.');
}

function clearLocalStorage() {
    localStorage.removeItem('favourites');
    alert('Favourites cleared.');
}

function navigateToCheckout() {
    const rows = document.querySelectorAll('#order-table tbody tr');
    const orderDetails = [];
    rows.forEach(row => {
        const itemName = row.children[0].textContent;
        const category = row.children[1].textContent;
        const quantity = row.children[2].textContent;
        const price = row.children[3].textContent;
        orderDetails.push({ itemName, category, quantity, price });
    });
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    window.location.href = 'pay.html'; // Replace with your checkout page URL
}
