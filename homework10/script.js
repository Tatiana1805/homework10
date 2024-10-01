const API_URL = "https://fakestoreapi.com";

//получение товара
async function getProduct(id=6) {
    try {
        let res = await fetch(`${API_URL}/products?limit=${id}`); //выгружается только 6 товаров
        const data = await res.json();
        pushProduct(data);
    } catch(error) {
        errorMessage('Возникла ошибка при загрузке товара: ' + error.message, 'error');
    }
}

//Добавление товара при клике
const moreProduct = document.querySelector('.pushProducts');
let id = 6;
moreProduct.addEventListener('click', (e) => {
    e.preventDefault(); 
    id = id + 6;
    getProduct(id);
})



//выгрузка товара
function pushProduct(product) {
    const products = document.querySelector('.products');
    products.innerHTML = '';
    product.forEach(el => {
        const productEl = document.createElement('div');
        productEl.className = 'product';
        productEl.innerHTML = ` 
        <img class="imgProduct" src="${el.image}" alt="${el.tittle}">
        <a href="#" onclick="delProduct(${el.id})">
            <img class="imgDel" src="img/delete.svg">
        </a>
        <h3>${el.title}</h3>
        <p class="price">${el.price}$</p>
        `;
    products.appendChild(productEl)
    });
}


//добавление товара
async function addProduct(e) {
    e.preventDefault(); //стр не обновляется
    const newProduct = {
        title: document.querySelector('.title').value,
        price: parseFloat(document.querySelector('.priceProduct').value),
        description: document.querySelector('.description').value,
        image: document.querySelector('.image').value,
        category: document.querySelector('.category').value
    };

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        if (!response.ok) throw new Error('Ошибка ответа, попробуйте позже');
        const addedProduct = await response.json();
        console.log(addedProduct)
        errorMessage('Товар успешно добавлен');
        getProduct();
        return
    } catch (error) {
        errorMessage('Продукт не добавлен: ' + error.message, 'error');
    }
}

//Удалить продукт
async function delProduct(id) { //удаление продукта по id
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        })
        if(!res.ok) throw new Error('Ошибка ответа, попробуйте позже');
        errorMessage('Продукт удален!');
        getProduct()
    }catch (error) {
        errorMessage('Ошибка удаления продукта: ' + error.message, 'error');
    }
}

//Ошибка
function errorMessage(message, type = 'succes') {
    const messageEl = document.getElementById('error');
    messageEl.textContent = message;
    messageEl.className = type;
    messageEl.style.display = 'block';
    setTimeout(() => messageEl.style.display = 'none', 3000)
}

document.querySelector('.addProduct').addEventListener('submit', addProduct)

getProduct()