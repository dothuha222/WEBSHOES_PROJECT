import { keyLocalStorageListSP, keyLocalStorageItemCart,keyLocalStorageCartRender } from "./parameter.js"
import { getDataFromLocalStorage,saveDataToLocalStorage } from "./parameter.js"


// cartLists chính là mảng của key có giá trị DANHSACHITEMCART
let cartLists = getDataFromLocalStorage(keyLocalStorageItemCart)

//--------------------------------------------------------------------------
const cartEmpty = document.querySelector('.cart_empty')
const cartNotEmpty = document.querySelector('.cart_no-empty')
const tableCart = document.querySelector('.table_cart tbody');
//--------------------------------------------------------------------------


// Tạo mảng CartRender (Mảng chứa bao gồm all dữ liệu từ listData và thuộc tính soLuong của cartLists)  
let cartRender =[]
// Mảng CartRender chứa các sản phẩm được thêm vào giỏ hàng
function createCartRender(idSP,soLuong) {
    let listSP = getDataFromLocalStorage(keyLocalStorageListSP)
    let item = listSP.find(e => {
        return e.id === idSP
    })
    let total = (soLuong * Number(item.price)).toFixed(3)
    item = {...item,soLuong,total}
    cartRender.push(item)
    saveDataToLocalStorage(keyLocalStorageCartRender,cartRender)
}

// Tổng tiền tất cả sản phẩm trong giỏ hàng
let finalAllTotal = document.querySelector('.final_total-price > span:last-child')

// Hàm render tổng sp trong giỏ hàng
export function renderAllTotal(){
    cartRender = JSON.parse(localStorage.getItem(keyLocalStorageCartRender))
    let sum = 0
    cartRender.forEach((e) => {
        sum += Number(e.total)
    })
    finalAllTotal.innerText = '$' + sum.toFixed(3);
}

// Hàm xóa sản phẩm trong giỏ hàng khi click
function removeItemCart(){
    let clearBtns = document.querySelectorAll('.clear-btn')
    clearBtns.forEach((e,index) =>{
        e.onclick = () => {
            if(confirm('Bạn muốn xóa sản phẩm này không?'))
            {
                let cartList = getDataFromLocalStorage(keyLocalStorageItemCart)
                let cartRender = getDataFromLocalStorage(keyLocalStorageCartRender)
                cartList.splice(index,1) 
                cartRender.splice(index,1)
                saveDataToLocalStorage(keyLocalStorageItemCart,cartList)
                saveDataToLocalStorage(keyLocalStorageCartRender,cartRender)
                renderCartRender(cartRender)
                renderAllTotal()
                console.log(index)
            }
        }
    })
}
// Hàm render cartRender(sản phẩm trong giỏ hàng có đầy đủ thuộc tính)
function renderCartRender(arr){
    let htmls = arr.map((e,index) => {
        return(
            `
            <tr class="cart_item" data-id=${e.id}>
            <td class="product">
                <div class="cart_info">
                    <div class="cart_img">
                        <img src="${e.imageUrl}" alt="">
                    </div>
                    <div class="cart_content">
                        <h3>${e.name}</h3>
                        <p>Quantity: <span>${e.quantity}</span></p>
                    </div>
                </div>
            </td>
            <td class="quantity">
                <div class="quantity_number">
                    <input type="button" value="&minus;" class="qty_decrease">
                    <input type="text" value=${e.soLuong} class="qty_item">
                    <input type="button" value="+" class="qty_increase">
                </div>
            </td>
            <td class="subtotal">
            <div>
                <span>$</span>
                <span>${e.price}</span>
             </div>
            </td>
            <td class="total">
                <div>
                    <span>$${e.total}</span>
                </div>
            </td>
            <td class="clear">
                <div class = "clear-btn">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </td>
            </tr>
            `
        )
    })
    htmls = `<tr>
    <th class="product">Product Name</th>
    <th class="quantity">Quantity</th>
    <th class="subtotal">Subtotal</th>
    <th class="total">Total</th>
    <th class="clear">Clear Cart</th>
    </tr>` + htmls.join('')
    tableCart.innerHTML = htmls

//Xóa sản phẩm trong giỏ hàng khi click
    removeItemCart()
}



//---------------------------------------------------------------------
if(Object.keys(cartLists).length != 0)
// Nếu có sản phẩm trong giỏ hàng
{
    cartNotEmpty.style.display = 'block'
    cartLists.forEach((e) => {
        console.log(e)
        createCartRender(e.idSP,e.soLuong)
        console.log(cartRender)
    })
    let cartRenderLocal = getDataFromLocalStorage(keyLocalStorageCartRender)
    console.log(cartRenderLocal)
    renderCartRender(cartRenderLocal)
    renderAllTotal()
}
// Nếu ko có sản phẩm trong giỏ hàng
else{
    cartEmpty.style.display = 'block'
}
//-----------------------------------------------------------------------


// Tăng giảm quantity
const qtyDecrease = document.querySelectorAll('.qty_decrease')
const qtyIncrease = document.querySelectorAll('.qty_increase')
let qtyNumber = document.querySelectorAll('.qty_item');

// Thay đổi total khi change quantity
const totalItemList = document.querySelectorAll('.total > div > span')

// Xử lý giao diện và dữ liệu khi click vào '-'(giảm số lượng)
qtyDecrease.forEach((e,index) => {
    e.onclick = () => {
        qtyNumber[index].value = onDecrease(qtyNumber[index].value)
        console.log('decrease')
        let value = Number(qtyNumber[index].value)
        // console.log(index,value)
        updateQuantity(index, value)   
        updateEachTotalPrice(index, value)
        renderAllTotal()
    }
})

// Xử lý giao diện và dữ liệu khi click vào '+'(tăng số lượng)
qtyIncrease.forEach((e,index) => {
    e.onclick = () => {
        qtyNumber[index].value = onIncrease(qtyNumber[index].value,cartRender[index].quantity)
        console.log('increase')
        let value = Number(qtyNumber[index].value)
        // console.log(index,value)
        updateQuantity(index, value)  
        updateEachTotalPrice(index, value)
        renderAllTotal()
    }
})

// Hàm xử lý khi Giảm số lượng
function onDecrease(element){
    element = Number(element)
    if(element <= 0){
        element = 0
    }
    else element--;
    return element
}

// Hàm xử lý khi Tăng số lượng
function onIncrease(element,max){
    element = Number(element)
    if(element >= max){
        element = max
    }
    else element++;
    return element
}


// Khi thay đổi số lượng thì dữ liệu trong localStorage vs key là keyLocalStorageItemCart 
// và keyLocalStorageCartRender cũng thay đổi theo
// Ở đây là thuộc tính soLuong của cartLists và soLuong của cartRender thay đổi
function updateQuantity(index,value){

    cartLists[index].soLuong = value
    cartRender[index].soLuong = value

    saveDataToLocalStorage(keyLocalStorageItemCart,cartLists)
    saveDataToLocalStorage(keyLocalStorageCartRender,cartRender)
}


// Khi thay đổi số lượng thì dữ liệu trong localStorage vs key là keyLocalStorageCartRender cũng thay đổi theo
// Ở đây là thuộc tính total của cartRender thay đổi
function updateEachTotalPrice(index,value){
    let cartRender = JSON.parse(localStorage.getItem(keyLocalStorageCartRender))
    if(cartRender){
        cartRender[index].total = (value * Number(cartRender[index].price)).toFixed(3)
        saveDataToLocalStorage(keyLocalStorageCartRender,cartRender)
        totalItemList[index].innerText = '$' + cartRender[index].total
    }

}

// Khi click vào 'Buy' hiện form thông tin người mua
const buyBtn = document.querySelector('.buy_btn')
const formWrap = document.querySelector('.form_wrap')

const formCloseIcon = document.querySelector('.form_close')
const formCancel = document.querySelector('.form_cancel')

buyBtn.onclick = () => {
    formWrap.style.display = 'flex'
}

formCloseIcon.onclick = () => {
    formWrap.style.display = 'none'
}

formCancel.onclick = () => {
    formWrap.style.display = 'none'
}