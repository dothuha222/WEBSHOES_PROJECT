export const keyLocalStorageListSP = "DANHSACHSP"
export const keyLocalStorageItemCart = "DANHSACHITEMCART"
export const keyLocalStorageCartRender = "DANHSACHCARTRENDER"

// Lấy dữ liệu từ localstorage
export const getDataFromLocalStorage = (key) => {
    let arr = JSON.parse(localStorage.getItem(key))
    return arr
}

// Lưu dữ liệu vào localstorage
export const saveDataToLocalStorage = (key, value) => {
    localStorage.setItem(key,JSON.stringify(value))
}

export const listData = [
    {
        id:1,
        name:"Nike Air Force 1 Mid 07",
        price:"1.200",
        quantity:20,
        imageUrl:"./image/img1.webp"
    },
    {
        id:2,
        name:"Nike Air Force 1 07 LVB",
        price:"3.100",
        quantity:10,
        imageUrl:"./image/img2.webp"
    },
    {
        id:3,
        name:"Nike Air Force 1 React",
        price:"4.200",
        quantity:20,
        imageUrl:"./image/img3.webp"
    },
    {
        id:4,
        name:"Nike Air Force 1 Mid React",
        price:"1.100",
        quantity:20,
        imageUrl:"./image/img4.webp"
    },
    {
        id:5,
        name:"Nike Air Force 1 Mid 07 LVB",
        price:"1.200",
        quantity:10,
        imageUrl:"./image/img5.webp"
    },
    {
        id:6,
        name:"Nike Air Force 1 09",
        price:"6.200",
        quantity:20,
        imageUrl:"./image/img6.webp"
    },
    {
        id:7,
        name:"Nike Air Force 1 v10 LVB",
        price:"3.400",
        quantity:20,
        imageUrl:"./image/img7.webp"
    },
    {
        id:8,
        name:"Nike Air Force 1 08 LVB",
        price:"1.200",
        quantity:10,
        imageUrl:"./image/img8.webp",
    },
];


// Tạo ID đơn hàng ngẫu nhiên 
export const createId = () => {
    let d = new Date()
    let str1 = String(d.getFullYear()).charAt(2) + String(d.getFullYear()).charAt(3)+ ((d.getMonth() +1) > 9 ? String(d.getMonth() + 1):'0'+String(d.getMonth() + 1))+ String(d.getDate());
    let text = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for(let i = 0; i < 8; i++){
        str1 += text.charAt(Math.floor(Math.random()*text.length))
    }
    let str2 = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
    return {
        getID: function(){
            return str1
        },
        getPuschaseDay:function(){
            return str2
        }
    }        
}



