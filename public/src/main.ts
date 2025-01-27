import './main.scss'

document.addEventListener('DOMContentLoaded', () => {
  const allSearchBtns = document.querySelectorAll('.search__btn')
  const idSearchBtn = document.querySelector('.id-song__btn')
  const hideBtn = document.querySelector('.hidden')
  const showBtn = document.querySelector('.show')
  const songDetails = document.querySelector('.song__details') as HTMLElement
  const detailsCard = document.querySelector('.details__card')
  const card2 = document.querySelector('.card__2')

  // ======================== show and hide details  ========================
  idSearchBtn?.addEventListener('click', () => {
    if (detailsCard?.classList.contains('hidden')) {
      detailsCard?.classList.add('show')
      detailsCard?.classList.remove('hidden')
      card2?.classList.remove('card')
      card2?.classList.add('card__2-rec')

      const songId = document.getElementById('idSongInput') as HTMLInputElement
      const songIdValue = songId?.value
      try {
        if (songIdValue) fetchSongById(songIdValue)
        else alert('Please enter a valid song ID')
      } catch (err) {
        window.alert(`No se encontró ninguna canción con id: ${songIdValue}`)
      }
    } else {
      detailsCard?.classList.add('hidden')
      detailsCard?.classList.remove('show')
      card2?.classList.add('card')
      card2?.classList.remove('card__2-rec')
    }
  })

  // ==================== scroll progress bar ====================
  const progress = document.getElementById('progressBar') as HTMLProgressElement
  let totalHeight = document.body.scrollHeight - window.innerHeight
  window.addEventListener('scroll', () => {
    let progressHeight = (window.scrollY / totalHeight) * 100
    if (progress) progress.style.height = progressHeight + '%'
  })

  // ==================== display all songs ====================
  const searchSongsBtn = document.querySelector('.display_all') as HTMLButtonElement
  searchSongsBtn?.addEventListener('click', fetchAllSongs)

  function displayAllSongs(songs: any) {
    const songContainer = document.querySelector('.song__container') as HTMLElement
    if (songContainer) {
      songContainer.innerHTML = ''
      songs.forEach((song: any) => {
      songContainer.innerHTML += `
        <div class="song__card">
          <img width="180px" src="${song.image || './imgs/default_image.jpg'}" alt="Album Image">
          <div class="song__info">
          <div class="song-info-container">
            <h2>${song.name}</h2>
            <p>Artist: ${song.artist}</p>
            <p>Album: ${song.album}</p>
          </div>
          <div style="display: flex; justify-content: center;">
            <img src="./imgs/soundwave.png" height="75px">
          </div>
          <div style="display: flex; justify-content: space-between; margin-right: 18px;">
            <span>ID: ${song.id}</span>
            <span>${song.duration}</span>
          </div>
        </div>
      </div>
      `
      })
    }
  }

  async function fetchAllSongs() {
    try {
      const response = await fetch('api/v2/songs')
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('songs', JSON.stringify(data))
        window.location.href = './songs.html'
      } else window.alert('No se encontraron canciones')
    } catch (err) {
      window.alert('Error al obtener las canciones')
    }
  }

  const songs = JSON.parse(localStorage.getItem('songs') || '[]')
  if (songs.length > 0) {
    console.log('Canciones obtenidas:', songs);
    displayAllSongs(songs)
  } else {
    window.alert('No se encontraron canciones')
  }

  // ==================== display song by id ====================
  function displaySong(song: any) {
    songDetails.innerHTML = `
      <h1>${song.name}</h1>
      <p>Artist: ${song.artist}</p>
      <p>Album: ${song.album}</p>
      <p>${song.duration}</p>
      <img src="${song.image}" alt="${song.name}">
      ${song.preview_url ?
        `
        <div class="audio-player">
          <button id="play-pause">
            <div><i class='bx bx-right-arrow'></i></div>
          </button>
          <input type="range" id="progress-bar" value="0" min="0" step="0.1">
          <span id="current-time">00:00</span> / <span id="duration">00:00</span>
          <audio id="audio">
            <source src="${song.preview_url}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </div>` 
        : '<p>No preview available</p>'
      }`
  }

  async function fetchSongById (id: string) {
    try {
      const response = await fetch(`api/v2/songs/${id}`)
      if (response.ok) {
        const result = await response.json()
        displaySong(result)
      } else {
        window.alert('No se encontró ninguna canción con esa ID')
      }
    } catch (err) {
      console.error('Error fetching song by ID:', err)
    }
  }

  // ==================== search song by mood ====================
  // async function displaySongByMood(mood: string) {
  //   const response = await fetch(`api/v2/songs?mood=${mood}`)
  //   const data = await response.json()
  //   if (response.ok) {
  //     localStorage.setItem('songs', JSON.stringify(data))
  //     window.location.href = './songs.html'
  //   } else {
  //     window.alert('No se encontraron canciones')
  //   }
  // }

  // const searchMoodBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>('.search_by_mood')!
  // searchMoodBtn.addEventListener('click', () => {
  //   const mood = document.getElementById('selectMood') as HTMLInputElement
  //   const moodValue = mood.value
  //   try {
  //     displaySongByMood(moodValue)
  //   } catch(err) {
  //     window.alert('Error al encontrar canciones por mood.')
  //   }
  // })

  // ================== interactive buble ==================
  let curX: number = 0
  let curY: number = 0
  let tgX: number = 0
  let tgY: number = 0

  function move() {
    curX += (tgX - curX) * 0.2
    curY += (tgY - curY) * 0.2
    interBubble.style.transform = `translate(${Math.round(curX)}px , ${Math.round(curY)}px)`
    requestAnimationFrame(() => {
      move()
    })
  }
  const interBubble: HTMLDivElement = document.querySelector<HTMLDivElement>('.interactive')!
  window.addEventListener('mousemove', (e) => {
    tgX = e.clientX
    tgY = e.clientY
    
  })
  move()
})