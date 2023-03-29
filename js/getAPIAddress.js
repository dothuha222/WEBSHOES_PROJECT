
const provincesSelect = document.querySelector('#provinces')
const districtsSelect = document.querySelector('#districts')
const wardsSelect = document.querySelector('#wards')

// Render provinces data
const provincesAPI = 'https://provinces.open-api.vn/api/p/'
const districtsAPI = 'https://provinces.open-api.vn/api/d/'
const wardsAPI = 'https://provinces.open-api.vn/api/w/'

const render = (arr,strings) => {
    let htmls = arr.map(e => {
        return(
            `
            <option value="${e.code}">${e.name}</option>
            `
        )
    })
    let value = strings + htmls.join('')
    return value
}


// Get provinces
const getProvinces = async () => {
    try{
        let res = await fetch(provincesAPI)
        let data = await res.json()
        return data
    }
    catch(e){
        alert('Error',e.message)
        return []
    }
}

getProvinces()
    .then(data => {
        provincesSelect.innerHTML = render(data,'<option value="">--Chọn Tỉnh/Thành phố--</option>')
})


// Get districts when select provinces
const getDistrictsByProvinceID = (data) => {
    provincesSelect.onchange = (e) => {
        wardsSelect.innerHTML = render([],'<option value="">--Chọn Phường/Xã--</option>')
        let arr = []
        let id = e.target.value
        console.log(id)
        arr = data.filter(district => {
            return district.province_code === Number(id)
        })
        districtsSelect.innerHTML = render(arr,'<option value="">--Chọn Huyện/Quận--</option>')
    }
}

const getDataDistricts = async () => {
    try{
        let res = await fetch(districtsAPI)
        let data = await res.json()
        return data
    }
    catch(e){
        alert('Error',e.message)
        return []
    }
}

getDataDistricts()
    .then(data => {
        getDistrictsByProvinceID(data)
    })


// Get wards when select districts
const getWardsByDistrictID = (data) => {
    districtsSelect.onchange = (e) => {
        let arr = []
        let id = e.target.value
        console.log(id)
        arr = data.filter(ward => {
            return ward.district_code === Number(id)
        })
        console.log(arr)
        wardsSelect.innerHTML = render(arr,'<option value="">--Chọn Phường/Xã--</option>')
    }
}
    
const getDataWards = async () => {
    try{
        let res = await fetch(wardsAPI)
        let data = await res.json()
        return data
    }
    catch(e){
        alert('Error',e.message)
        return []
    }
}

getDataWards()
    .then(data => {
        getWardsByDistrictID(data)
    })


