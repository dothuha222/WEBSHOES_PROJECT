let billAPI = "http://localhost:3000/order"

let bills = document.querySelector('.bills')
import { keyLocalStorageListSP } from "./parameter.js"
import {getDataFromLocalStorage, saveDataToLocalStorage } from "./parameter.js"
import { openConfirmDialog,closeConfirmDialog } from "./handleDialog.js"

// Get bills
const getBills = (callback) => {
    fetch(billAPI)
        .then(res => res.json())
        .then(callback)
}

// Render bills
const renderBills = (data => {
    //----------------------------------------------------------------
    // Bills Element
    let billElements = data.map((bill,index) => {
        let ds = bill.dsDonHang
        let sumAllTotal = ds.reduce((acc,curent) => acc+Number(curent.total),0)
        sumAllTotal = sumAllTotal.toFixed(3)
        console.log(sumAllTotal)
       return(
        `
        <div class="bills_wrap bills_wrap-${bill.id}">
            <div class="bills_title">
                <h2><i class="fa-solid fa-greater-than"></i> CHI TIẾT ĐƠN HÀNG <span class="maDonHang"style="color:red">${bill.idDonHang}</span></h2>
            </div>
            <div class="bills_container">
                <!-- Bill left -->
                <div class="bills_left">
                    <!-- Bill left list -->
                    <div class="bills_left-list">
                    </div>
                    <!-- Bill left button -->
                    <div class="bills_left-btn bills_left-btn-${bill.id}">
                        Hủy đơn hàng
                    </div>
                </div>
                <!-- Bill right -->
                <div class="bills_right">
                    <!-- Bill right list -->
                    <div class="bills_right-list">
                        <div class="bills_right-item">
                            <h3>Tóm tắt đơn hàng</h3>
                            <div class="item-child">
                                <p>Ngày tạo đơn</p>
                                <p class="bills_purchase-day">${bill.ngayMua}</p>
                            </div>
                            <div class="item-child">
                                <p>Tạm tính</p>
                                <p class="bills_price">$${sumAllTotal}</p>
                            </div>
                            <div class="item-child">
                                <p>Phí vận chuyển</p>
                                <p>0</p>
                            </div>
                            <div class="item-child">
                                <p>Tổng tiền</p>
                                <p class=" bills_price" style="font-weight: 600;font-size: 21px;">$${sumAllTotal}</p>
                            </div>
                        </div>
                        <div class="bills_right-item">
                            <h3>Địa chỉ</h3>
                            <div class="item-child">
                                <p class="userName">${bill.userName}</p>
                            </div>
                            <div class="item-child">
                                <p class="address">${bill.address}</p>
                            </div>
                            <div class="item-child">
                                <p class="phoneNumber">${bill.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        `
       )
    })
    // Kiểm tra xem object có bị rỗng hay ko, nếu ko thì mới thực hiện
    if(Object.keys(billElements).length != 0 ){
        bills.innerHTML = billElements.join('')
    }
    //----------------------------------------------------------------
    // Bills Left List
    let billsLeftLists = document.querySelectorAll('.bills_left-list')
    data.forEach((bill,index) => {
        let ds = bill.dsDonHang
        let billLeftItem = ds.map((e,index) => {
            return(
                `
                <div class="bills_left-item">
                    <div class="bills-img">
                        <img src="${e.imageUrl}">
                    </div>
                    <div class="bills-info">
                        <div>
                            <p>${e.name}</p>
                            <p>Đơn giá: <span class="donGia">$${e.price}</span></p>
                            <p>Số lượng mua: <span class="soLuongMua">${e.soLuong}</span></p>
                        </div>
                        <div>
                            <span class="TongGia">$${e.total}</span>
                        </div>
                    </div>
                </div>
                `
            )
        })
        billsLeftLists[index].innerHTML = billLeftItem.join('')
    });

    // Bill left Button
    let billsLeftBtn = document.querySelectorAll('.bills_left-btn')
    billsLeftBtn.forEach((e,index) => {
        e.onclick = () => {
            openConfirmDialog('Bạn có chắc muốn hủy đơn hàng này không ?')
            const xacNhanDialogBtn = document.querySelector('.dialog-ok')
            const huyDialogBtn = document.querySelector('.dialog-cancel')
            xacNhanDialogBtn.onclick = () => {
                 // Xóa đơn hàng
                 getBills(data =>{
                    let arr = data
                    deleteBills(arr[index].id)
                })

                // Cập nhật lại quantity trong kho hàng
                getBills(data => {
                    let arr = data
                    changeQuantityAfterHuyDonHang(arr, index)
                })

                // Close Dialog
                closeConfirmDialog()
            }
            // Không muốn xác nhận
            huyDialogBtn.onclick = () => {
                // Close Dialog
                closeConfirmDialog()
            }
        }
    })
})

// Get and render Bills
const getAndRenderBills = () => {
    getBills(data => renderBills(data))
}

getAndRenderBills()

// Create Bills
export const createBills = (data) => {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(billAPI,options)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))
}

// Delete Bills
const deleteBills = (id) => {
    let options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
    },
    }
    fetch(`${billAPI}/${id}`,options)
        .then(response => response.json())
        .then(() => {
            let billWrapItem = document.querySelector('.bills_wrap-'+ id);
            if(billWrapItem){
                billWrapItem.remove()
            }
        })
        .catch(err => console.error(err))
}

// Cập nhật số lượng sản phẩm trong kho khi nhấn nút Hủy đơn hàng
const changeQuantityAfterHuyDonHang = (data,index) => {
    let listSP = getDataFromLocalStorage(keyLocalStorageListSP)
    let ds = data[index].dsDonHang
    ds.forEach((item) =>{
        listSP.forEach((list) => {
            if(item.id == list.id){
                list.quantity = list.quantity + item.soLuong
            }
        })
    })
    saveDataToLocalStorage(keyLocalStorageListSP,listSP)
}