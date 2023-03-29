
// Handle validate 
import {createId} from './parameter.js'
import { keyLocalStorageListSP, keyLocalStorageItemCart,keyLocalStorageCartRender } from './parameter.js'
import { getDataFromLocalStorage, saveDataToLocalStorage } from './parameter.js'
import { createBills } from './handleBills.js'
import { openConfirmDialog,closeConfirmDialog } from './handleDialog.js'

export let orderInfo = {
    userName:'',
    phoneNumber:'',
    email:'',
    address:'',
    idDonHang: '',
    ngayMua: '',
    dsDonHang:[]
}
let data = {
    ho:'',
    ten:'',
    email:'',
    phoneNumber:'',
    province:'',
    district:'',
    ward:'',
    soNha:''
}


const inputElements = document.querySelectorAll('.form_input input')
const selectedElements = document.querySelectorAll('.form_select select')
const errorInputElements = document.querySelectorAll('.form_input span')
const errorSelectElements = document.querySelectorAll('.form_select-span span')

// console.log(inputElements)
// console.log(errorInputElements)
// console.log(selectedElements)
// console.log(errorSelectElements)

// Handle check required
const checkRequired = (value,errorMessage) => {
    let result = value ? undefined : errorMessage
    return result
}

const handleRequiredInput = (err,index) => {
    if(err){
        errorInputElements[index].innerText = err
        inputElements[index].classList.add('invalid')
    }
    else{
        errorInputElements[index].innerText = ''
        inputElements[index].classList.remove('invalid')
    }
}

const handleRequiredSelect = (err,index) => {
    if(err){
        errorSelectElements[index].innerText = err
        selectedElements[index].classList.add('invalid')
    }
    else{
        errorSelectElements[index].innerText = ''
        selectedElements[index].classList.remove('invalid')
    }
}
// Handle check email
const checkEmail = (value) => {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(value) ? undefined : 'Email của bạn không hợp lệ'
}

const handleEmail = (value,index) => {
    if(checkEmail(value)){
        errorInputElements[index].innerText = checkEmail(value)
        inputElements[index].classList.add('invalid')
        data.email = ''
    }
    else{
        errorInputElements[index].innerText = ''
        inputElements[index].classList.remove('invalid')
        data.email = value
    }
}

// Handle check number phone
const checkNumberPhone = (value) => {
    for(let i = 0; i < value.length; i++){
        if (/^\d$/.test(value[i])){ 
            continue
        }
        else return false
    }
    return true
    //hợp lệ thì trả về true, sai trả về false
}

const handleNumberPhone = (value,index) => {
    if(checkNumberPhone(value)){
        errorInputElements[index].innerText = ''
        inputElements[index].classList.remove('invalid')
        data.phoneNumber = value
    }
    else{
        errorInputElements[index].innerText = 'Số điện thoại không hợp lệ'
        inputElements[index].classList.add('invalid')
        data.phoneNumber = ''
    }
}

// Handle validate
const handleValidate = () => {
    inputElements.forEach((input,index) => {  
        let value = input.value.trim()    
        let errorMessage
        switch (index) {
            case 0:
                errorMessage = checkRequired(value,'Vui lòng nhập họ')
                handleRequiredInput(errorMessage,index)
                if(!errorMessage){
                    data.ho = value
                }
                else{
                    data.ho = ''
                }
                break;
            case 1:
                errorMessage = checkRequired(value,'Vui lòng nhập tên')
                handleRequiredInput(errorMessage,index)
                if(!errorMessage){
                    data.ten = value
                }
                else{
                    data.ten = ''
                }
                break;
            case 2:
                errorMessage = checkRequired(value,'Vui lòng nhập email')
                if(errorMessage){
                    handleRequiredInput(errorMessage,index)
                }
                else{
                    handleEmail(value,index)
                }
                break;
            case 3:
                errorMessage = checkRequired(value,'Vui lòng nhập số điện thoại')
                if(errorMessage){
                    handleRequiredInput(errorMessage,index)
                }
                else{
                    handleNumberPhone(value,index)
                }
                break;
            case 4:
                errorMessage = checkRequired(value,'Vui lòng nhập địa chỉ nhà cụ thể')
                handleRequiredInput(errorMessage,index)
                if(!errorMessage){
                    data.soNha = value
                }
                else{
                    data.soNha = ''
                }
                break;
        }
        input.oninput = () => {
            errorInputElements[index].innerText = ''
            inputElements[index].classList.remove('invalid')
        }
        input.onchange = () => {
            value = input.value
        }

    })
    selectedElements.forEach((select,index) => {
        let errorMessage
        switch(index) {
            case 0:
                errorMessage = checkRequired(select.value,'Vui lòng chọn tỉnh thành')
                handleRequiredSelect(errorMessage,index)
                if(!errorMessage){
                    let province = select.options[select.selectedIndex].text;
                    data.province = province
                }
                else{
                    data.province = ''
                }
                break;
            case 1:
                errorMessage = checkRequired(select.value,'Vui lòng chọn quận huyện')
                handleRequiredSelect(errorMessage,index)
                if(!errorMessage){
                    let district = select.options[select.selectedIndex].text;
                    data.district = district
                }
                else{
                    data.district = ''
                }
                break;
            case 2:
                errorMessage = checkRequired(select.value,'Vui lòng chọn phường xã')
                handleRequiredSelect(errorMessage,index)
                if(!errorMessage){
                    let ward = select.options[select.selectedIndex].text;
                    data.ward = ward
                }
                else{
                    data.ward = ''
                }
                break;
        }
    })
}

// Xử lý form
const handleGetOrderInfo = (data) => {
    let check = true
    for(let key in data) {
        if(data[key] == ''){
            check = false
        } 
    }
    // Nếu form nhập đúng, đủ thì hàm trả về true
    if(check){
        orderInfo.userName = `${data.ho} ${data.ten}`
        orderInfo.phoneNumber = data.phoneNumber
        orderInfo.email = data.email
        orderInfo.address = `${data.soNha} ${data.ward} ${data.district} ${data.province}.`
        orderInfo.idDonHang = createId().getID()
        orderInfo.ngayMua = createId().getPuschaseDay()
        let cartRender = getDataFromLocalStorage(keyLocalStorageCartRender)
        orderInfo.dsDonHang = cartRender
        return true
    }
    // Ngược lại hàm trả về false
    else{
        return false
    }
}


const confirmBtn = document.querySelector('.form_confirm')
confirmBtn.onclick = () => {
    handleValidate()
    // Nếu form đc điền oke 
    if(handleGetOrderInfo(data)){
        // Muốn xác nhận nộp form
        openConfirmDialog("Bạn muốn xác nhận không?")
        const xacNhanDialogBtn = document.querySelector('.dialog-ok')
        const huyDialogBtn = document.querySelector('.dialog-cancel')
        xacNhanDialogBtn.onclick = () => {
            console.log(orderInfo)
            console.log("I'm confirm")
            let cartWrap = document.querySelector('.cart_wrap')
            let formWrap = document.querySelector('.form_wrap')
            let thankyouElement = document.querySelector('.thank_you')
            
            let thankUsername = document.querySelector('.thank_username')
            let thankMadonhang = document.querySelector('.thank_madonhang')

            cartWrap.style.display = 'none'
            formWrap.style.display = 'none'
            thankyouElement.style.display = 'block'
            thankUsername.innerText = orderInfo.userName
            thankMadonhang.innerText = orderInfo.idDonHang

            // Cập nhật số lượng tổng sản phẩm và số lượng của từng sản phẩm sau khi nhấn nút Xác nhận
            changeSoLuongAfterConfirm()

            // Create Bill
            createBills(orderInfo)

            // Close Dialog
            closeConfirmDialog()
        }
        // Không muốn xác nhận nộp form
        huyDialogBtn.onclick = () => {
            console.log('Not confirm')  

             // Close Dialog
            closeConfirmDialog()
        }
    }  
    // Nếu form không đc điền oke (Không đc điền đầy đủ hoặc điền sai)
    else{
        console.log('Not get order infor')
    }
}

// Cập nhật số lượng tổng sản phẩm và số lượng của từng sản phẩm sau khi nhấn nút Xác nhận
const changeSoLuongAfterConfirm = () => {
    let cartRender = getDataFromLocalStorage(keyLocalStorageCartRender)
    let listSP = getDataFromLocalStorage(keyLocalStorageListSP)
    cartRender.forEach((e) => {
        e.quantity = e.quantity - e.soLuong
    })
    cartRender.forEach((cartrender,index) => {
        listSP.forEach((item,index) => {
            if(cartrender.id === item.id) {
                item.quantity = cartrender.quantity
            }
        }) 
    })
    saveDataToLocalStorage(keyLocalStorageListSP,listSP)
    saveDataToLocalStorage(keyLocalStorageItemCart,[])
    saveDataToLocalStorage(keyLocalStorageCartRender,[])
}



