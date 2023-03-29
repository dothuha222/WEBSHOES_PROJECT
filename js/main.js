
import {keyLocalStorageListSP, keyLocalStorageItemCart} from './parameter.js';
import { getDataFromLocalStorage,saveDataToLocalStorage } from './parameter.js';
import { listData } from './parameter.js';
import { openNormalAlert,openErrorAlert } from './handleDialog.js';
// saveDataToLocalStorage(keyLocalStorageListSP,listData);
// Get and set list product
const getAndSetListProduct = () => {
    let listProduct = getDataFromLocalStorage(keyLocalStorageListSP)
    if(listProduct){
        listProduct = listProduct
    }
    else{
        listProduct = listData
    }
    saveDataToLocalStorage(keyLocalStorageListSP,listProduct)
    return listProduct;
}

let listProduct = getAndSetListProduct()

// Render product list
const productList = document.querySelector('#products')
const renderProductList = () => {
    let htmls = listProduct.map((product,index) => 
    `
        <div class="item_wrapper">
            <div class="item" data-id=${product.id}>
                <div class="item_image">
                    <img src=${product.imageUrl}>
                    <div class="cart_icon">
                        <span><i class="fa-solid fa-cart-shopping"></i></span>
                    </div>
                </div>
                <div class="item_info"> 
                    <h4>${product.name}</h4>
                    <div class="item_p_q">
                        <div class="item_p">$${product.price}</div>
                        <div class="item_q">Quantity: ${product.quantity}</div>
                    </div>
                </div>
            </div>
        </div>
    `
    ) 
    productList.innerHTML = htmls.join('');
    }
renderProductList()


// Add product to cart
// Biến cartList chính là biến arr theo như đề bài 
let cartList = []
let cartItemBtnList = document.querySelectorAll('.cart_icon');

cartItemBtnList.forEach((btn,index) => {
    btn.addEventListener('click',() => {
        let idCartItem = listProduct[index].id
        let quantity = listProduct[index].quantity
        // console.log(listData[index].id)

         // Get data from local storage
         let currentData = getDataFromLocalStorage(keyLocalStorageItemCart)
         // Check the data if its not null
        cartList = currentData ? currentData : [] 

        // Thực hiện add sản phẩm
        addSP(idCartItem,quantity)

        // Save cartList to localStorage
       saveDataToLocalStorage(keyLocalStorageItemCart,cartList)

        
    })

})

// Hàm thêm sản phẩm
function addSP(idCartItem,quantity){
    if(quantity > 0){
        let idFindIndex = cartList.findIndex((e) => {
            return e.idSP === idCartItem
        })
        console.log(idFindIndex);
        if(idFindIndex == -1){
            console.log("Chua co")
            cartList.push({idSP: idCartItem, soLuong: 1})
            // Thông báo
            openNormalAlert("Thêm vào giỏ hàng thành công")
        }
        else{
            console.log("Da co")
            if(cartList[idFindIndex]){
                // Nếu sản phẩm đã thêm ko vượt quá số lượng cho phép => Thực hiện logic
                if(cartList[idFindIndex].soLuong < quantity){
                    cartList[idFindIndex].soLuong += 1;
                // Thông báo
                openNormalAlert("Thêm vào giỏ hàng thành công")
                }
                // Ngược lại không thực hiện logic
                else{
                    openErrorAlert('Sản phẩm không được thêm vào do vượt quá số lượng cho phép')
                }
            }
        }
    }
    else{
        openErrorAlert('Sản phẩm hiện đã hết')
    }
    console.log(cartList)
}

