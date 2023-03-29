const dialogOverlayElement = document.querySelector('.dialog-overlay')
const dialogCloseBtn = document.querySelector('.close-dialog')
const dialogMessage = document.querySelector('.dialog-message')

const dialogConfirm = document.querySelector('.dialog-button-confirm')
const dialogAlert = document.querySelector('.dialog-button-alert')

export const openDialog = () => {
    dialogOverlayElement.style.display = 'block';
    dialogCloseBtn.onclick = () => {
        dialogOverlayElement.style.display = 'none';
    }
}

// Alert dialog
export const openNormalAlert = (message) => {
    openDialog()
    dialogMessage.innerText = message
}

export const openErrorAlert = (message) => {
    openDialog()
    dialogMessage.innerText = message
}


// Confirm dialog
export const openConfirmDialog = (message) => {
    openDialog()
    dialogAlert.style.display = 'none'
    dialogConfirm.style.display = 'block'
    dialogMessage.innerHTML = message
}

export const closeConfirmDialog = () => {
    dialogOverlayElement.style.display = 'none';
    dialogAlert.style.display = 'block' 
    dialogConfirm.style.display = 'none'
}
