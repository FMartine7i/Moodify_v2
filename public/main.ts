const allSearchBtns = document.querySelectorAll('.search__btn')
const idSearchBtn = document.querySelector('.id-song__btn')
const hideBtn = document.querySelector('.hidden')
const showBtn = document.querySelector('.show')
const songDetails = document.querySelector('.song__details')

idSearchBtn?.addEventListener('click', () => {
  songDetails?.classList.remove('hidden')
  songDetails?.classList.add('show')
})