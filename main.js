import './style.css'
import { supabase } from './supabase-client.js'

// ===== Data =====
const themes = [
  { id: 'bavarian', name: 'Bavarian', icon: 'bi-flag-fill' },
  { id: 'forest', name: 'Forest', icon: 'bi-tree-fill' },
  { id: 'berlin', name: 'Berlin', icon: 'bi-building-fill' },
  { id: 'rhine', name: 'Rhine', icon: 'bi-water' },
  { id: 'autumn', name: 'Autumn', icon: 'bi-leaf-fill' },
]

const categories = ['All', 'Castle', 'Landmark', 'Cathedral', 'Nature', 'Historic']

let allSpots = []
let allUpdates = []
let activeFilter = 'All'

// ===== DOM Render =====
function renderApp() {
  document.querySelector('#app').innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-custom fixed-top" id="navbar">
      <div class="container">
        <a class="navbar-brand" href="#hero">
          <i class="bi bi-compass-fill me-2"></i>Discover Germany
        </a>
        <button class="navbar-toggler text-light" type="button" data-bs-toggle="collapse" data-bs-target="#navItems">
          <i class="bi bi-list text-light" style="font-size:1.5rem"></i>
        </button>
        <div class="collapse navbar-collapse" id="navItems">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item"><a class="nav-link active" href="#hero">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#spots">Destinations</a></li>
            <li class="nav-item"><a class="nav-link" href="#live">Live Updates</a></li>
            <li class="nav-item"><a class="nav-link" href="#post">Post Update</a></li>
          </ul>
          <div class="d-flex align-items-center gap-2" id="themeSwitcher"></div>
        </div>
      </div>
    </nav>

    <section class="hero" id="hero">
      <div class="hero-bg" id="heroBg"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content animate-fade-up">
        <span class="hero-badge">
          <span class="live-dot"></span> Live Tourist Guide
        </span>
        <h1 class="hero-title">Discover Germany</h1>
        <p class="hero-subtitle">
          Explore breathtaking castles, historic landmarks, and vibrant cities.
          Get real-time updates from every tourist spot across the country.
        </p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <a href="#spots" class="btn-custom btn-custom-filled">Explore Destinations</a>
          <a href="#live" class="btn-custom">View Live Updates</a>
        </div>
      </div>
      <a href="#spots" class="scroll-indicator"><i class="bi bi-chevron-double-down"></i></a>
    </section>

    <section class="section" id="spots">
      <div class="container">
        <div class="section-divider"></div>
        <h2 class="section-title">Tourist Destinations</h2>
        <p class="section-subtitle">Discover Germany's most iconic spots with live information</p>
        <div class="filter-bar" id="filterBar"></div>
        <div class="row g-4 stagger" id="spotsGrid"></div>
      </div>
    </section>

    <section class="section" id="live" style="background:var(--bg-secondary)">
      <div class="container">
        <div class="section-divider"></div>
        <h2 class="section-title">Live Updates</h2>
        <p class="section-subtitle">Real-time announcements from tourist spots across Germany</p>
        <div class="text-center mb-4">
          <span class="live-badge"><span class="live-dot"></span> Live Feed</span>
        </div>
        <div id="updatesFeed"></div>
      </div>
    </section>

    <section class="section" id="post">
      <div class="container">
        <div class="section-divider"></div>
        <h2 class="section-title">Post a Live Update</h2>
        <p class="section-subtitle">Share news, alerts, or events from a tourist spot</p>
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="spot-card p-4">
              <form id="updateForm">
                <div class="mb-3">
                  <label class="form-label">Tourist Spot</label>
                  <select class="form-select" id="updateSpot" required>
                    <option value="">Select a destination</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Update Type</label>
                  <select class="form-select" id="updateType">
                    <option value="info">Info</option>
                    <option value="alert">Alert</option>
                    <option value="event">Event</option>
                    <option value="weather">Weather</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Your Name</label>
                  <input type="text" class="form-control" id="updateAuthor" placeholder="e.g. Tour Guide Lisa" maxlength="50" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Message</label>
                  <textarea class="form-control" id="updateMessage" rows="3" placeholder="What's happening at this spot right now?" required maxlength="300"></textarea>
                </div>
                <button type="submit" class="btn-custom btn-custom-filled w-100">
                  <i class="bi bi-send-fill me-2"></i>Post Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="stats" style="background:var(--bg-secondary)">
      <div class="container">
        <div class="row" id="statsRow"></div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <h5><i class="bi bi-compass-fill me-2"></i>Discover Germany</h5>
            <p>Your live guide to Germany's most beautiful destinations. Real-time updates from castles, cathedrals, landmarks, and natural wonders.</p>
          </div>
          <div class="col-lg-2 col-6">
            <h5>Explore</h5>
            <p><a href="#spots">Destinations</a></p>
            <p><a href="#live">Live Updates</a></p>
            <p><a href="#post">Post Update</a></p>
          </div>
          <div class="col-lg-3 col-6">
            <h5>Regions</h5>
            <p>Bavaria &middot; Berlin &middot; Cologne</p>
            <p>Hamburg &middot; Heidelberg</p>
            <p>Dresden &middot; Rhine Valley</p>
          </div>
          <div class="col-lg-3">
            <h5>Connect</h5>
            <p><a href="#"><i class="bi bi-facebook me-2"></i>Facebook</a></p>
            <p><a href="#"><i class="bi bi-instagram me-2"></i>Instagram</a></p>
            <p><a href="#"><i class="bi bi-twitter-x me-2"></i>Twitter</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Discover Germany &mdash; Live Tourist Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
}

// ===== Theme Switcher =====
function renderThemeSwitcher() {
  const container = document.getElementById('themeSwitcher')
  container.innerHTML = themes.map(t => `
    <button class="theme-btn theme-btn-${t.id} ${getCurrentTheme() === t.id ? 'active' : ''}"
            data-theme="${t.id}" title="${t.name} Theme"></button>
  `).join('')

  container.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme))
  })
}

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'bavarian'
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('germany-theme', theme)
  renderThemeSwitcher()
}

function loadSavedTheme() {
  const saved = localStorage.getItem('germany-theme')
  if (saved) setTheme(saved)
}

// ===== Hero Background =====
function setHeroBackground() {
  const bg = document.getElementById('heroBg')
  const heroImage = 'https://images.pexels.com/photos/11348493/pexels-photo-11348493.jpeg?auto=compress&cs=tinysrgb&w=1920'
  bg.style.backgroundImage = `url('${heroImage}')`
}

// ===== Filter Bar =====
function renderFilterBar() {
  const bar = document.getElementById('filterBar')
  bar.innerHTML = categories.map(c => `
    <button class="filter-btn ${c === activeFilter ? 'active' : ''}" data-cat="${c}">${c}</button>
  `).join('')

  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.cat
      renderFilterBar()
      renderSpots()
    })
  })
}

// ===== Spots Grid =====
function renderSpots() {
  const grid = document.getElementById('spotsGrid')
  const filtered = activeFilter === 'All'
    ? allSpots
    : allSpots.filter(s => s.category === activeFilter)

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="text-center text-muted w-100 py-5">No destinations in this category yet.</p>`
    return
  }

  grid.innerHTML = filtered.map(spot => `
    <div class="col-lg-4 col-md-6">
      <div class="spot-card" data-spot="${spot.id}">
        <div class="spot-card-img">
          <img src="${spot.image_url || ''}" alt="${spot.name}" loading="lazy" />
          <span class="spot-card-category">${spot.category}</span>
        </div>
        <div class="spot-card-body">
          <h3 class="spot-card-title">${spot.name}</h3>
          <div class="spot-card-city"><i class="bi bi-geo-alt-fill me-1"></i>${spot.city}</div>
          <p class="spot-card-desc">${spot.description}</p>
          <div class="spot-card-footer">
            <span class="spot-card-updates-count">
              <span class="live-dot"></span>
              ${getUpdateCount(spot.id)} live updates
            </span>
            <button class="btn-custom" style="padding:0.3rem 1rem;font-size:0.75rem" onclick="window.viewSpot('${spot.id}')">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('')
}

function getUpdateCount(spotId) {
  return allUpdates.filter(u => u.spot_id === spotId).length
}

// ===== Spot Detail Modal =====
window.viewSpot = function(spotId) {
  const spot = allSpots.find(s => s.id === spotId)
  if (!spot) return

  const spotUpdates = allUpdates
    .filter(u => u.spot_id === spotId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const modalHtml = `
    <div class="modal fade modal-custom" id="spotModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${spot.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img src="${spot.image_url || ''}" alt="${spot.name}" class="w-100 rounded mb-3" style="height:280px;object-fit:cover" />
            <p class="mb-2"><span class="font-accent" style="color:var(--accent)"><i class="bi bi-geo-alt-fill me-1"></i>${spot.city}</span></p>
            <p class="mb-3" style="color:var(--text-secondary)">${spot.description}</p>
            <h6 class="mb-3" style="color:var(--accent)"><span class="live-dot me-2"></span>Live Updates from ${spot.name}</h6>
            <div id="modalUpdates">
              ${spotUpdates.length > 0 ? spotUpdates.map(u => updateItemHtml(u)).join('') : '<p style="color:var(--text-secondary)">No updates yet. Be the first to post one!</p>'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const existing = document.getElementById('spotModal')
  if (existing) existing.remove()

  document.body.insertAdjacentHTML('beforeend', modalHtml)
  const modal = new bootstrap.Modal(document.getElementById('spotModal'))
  modal.show()
}

// ===== Updates Feed =====
function updateItemHtml(update) {
  const spot = allSpots.find(s => s.id === update.spot_id)
  const spotName = spot ? spot.name : 'Unknown'
  const icons = { info: 'bi-info-circle-fill', alert: 'bi-exclamation-triangle-fill', event: 'bi-calendar-event-fill', weather: 'bi-cloud-sun-fill' }
  const icon = icons[update.update_type] || icons.info
  const timeAgo = getTimeAgo(update.created_at)

  return `
    <div class="update-item">
      <div class="update-icon ${update.update_type}">
        <i class="bi ${icon}"></i>
      </div>
      <div class="update-content">
        <p class="update-message">${update.message}</p>
        <div class="update-meta">
          <span class="update-spot-name"><i class="bi bi-geo-alt me-1"></i>${spotName}</span>
          <span><i class="bi bi-person me-1"></i>${update.author}</span>
          <span><i class="bi bi-clock me-1"></i>${timeAgo}</span>
        </div>
      </div>
    </div>
  `
}

function renderUpdates() {
  const feed = document.getElementById('updatesFeed')
  if (allUpdates.length === 0) {
    feed.innerHTML = `<p class="text-center" style="color:var(--text-secondary)">No live updates yet. Post the first one below!</p>`
    return
  }

  const sorted = [...allUpdates].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  feed.innerHTML = sorted.slice(0, 30).map(u => updateItemHtml(u)).join('')
}

function getTimeAgo(timestamp) {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ===== Stats =====
function renderStats() {
  const row = document.getElementById('statsRow')
  const totalUpdates = allUpdates.length
  const totalSpots = allSpots.length
  const cities = new Set(allSpots.map(s => s.city)).size
  const categoriesCount = new Set(allSpots.map(s => s.category)).size

  row.innerHTML = `
    <div class="col-md-3 col-6 stat-box animate-fade-up">
      <div class="stat-number">${totalSpots}</div>
      <div class="stat-label">Destinations</div>
    </div>
    <div class="col-md-3 col-6 stat-box animate-fade-up">
      <div class="stat-number">${totalUpdates}</div>
      <div class="stat-label">Live Updates</div>
    </div>
    <div class="col-md-3 col-6 stat-box animate-fade-up">
      <div class="stat-number">${cities}</div>
      <div class="stat-label">Cities</div>
    </div>
    <div class="col-md-3 col-6 stat-box animate-fade-up">
      <div class="stat-number">${categoriesCount}</div>
      <div class="stat-label">Categories</div>
    </div>
  `
}

// ===== Form =====
function setupForm() {
  const select = document.getElementById('updateSpot')
  select.innerHTML = '<option value="">Select a destination</option>' +
    allSpots.map(s => `<option value="${s.id}">${s.name} — ${s.city}</option>`).join('')

  const form = document.getElementById('updateForm')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const spotId = document.getElementById('updateSpot').value
    const updateType = document.getElementById('updateType').value
    const author = document.getElementById('updateAuthor').value.trim() || 'Anonymous'
    const message = document.getElementById('updateMessage').value.trim()

    if (!spotId || !message) return

    const btn = form.querySelector('button[type="submit"]')
    const originalText = btn.innerHTML
    btn.disabled = true
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Posting...'

    const { data, error } = await supabase
      .from('live_updates')
      .insert({ spot_id: spotId, message, update_type: updateType, author })
      .select()

    btn.disabled = false
    btn.innerHTML = originalText

    if (error) {
      showToast('Failed to post update. Please try again.', 'error')
      return
    }

    allUpdates.unshift(data[0])
    renderUpdates()
    renderSpots()
    renderStats()
    form.reset()
    showToast('Update posted successfully!', 'success')
  })
}

// ===== Toast =====
function showToast(message, type = 'success') {
  const toastHtml = `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:9999">
      <div class="toast align-items-center text-white border-0" role="alert" style="background:${type === 'success' ? 'var(--success)' : 'var(--error)'}">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>
  `
  const existing = document.querySelector('.toast-container')
  if (existing) existing.remove()
  document.body.insertAdjacentHTML('beforeend', toastHtml)
  const toastEl = document.querySelector('.toast')
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 })
  toast.show()
}

// ===== Navbar Scroll =====
function setupNavbarScroll() {
  const navbar = document.getElementById('navbar')
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled')
    else navbar.classList.remove('scrolled')
  })

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'))
      link.classList.add('active')
    })
  })
}

// ===== Intersection Observer for animations =====
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.section, .stat-box').forEach(el => observer.observe(el))
}

// ===== Load Data =====
async function loadSpots() {
  const { data, error } = await supabase
    .from('tourist_spots')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error loading spots:', error)
    return
  }
  allSpots = data || []
}

async function loadUpdates() {
  const { data, error } = await supabase
    .from('live_updates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error loading updates:', error)
    return
  }
  allUpdates = data || []
}

// ===== Realtime Subscription =====
function setupRealtime() {
  supabase
    .channel('live-updates-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_updates' }, (payload) => {
      allUpdates.unshift(payload.new)
      renderUpdates()
      renderSpots()
      renderStats()
      const spot = allSpots.find(s => s.id === payload.new.spot_id)
      if (spot) {
        showToast(`New update from ${spot.name}!`, 'success')
      }
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'live_updates' }, (payload) => {
      allUpdates = allUpdates.filter(u => u.id !== payload.old.id)
      renderUpdates()
      renderSpots()
      renderStats()
    })
    .subscribe()
}

// ===== Init =====
async function init() {
  renderApp()
  loadSavedTheme()
  renderThemeSwitcher()
  setHeroBackground()

  document.getElementById('spotsGrid').innerHTML = '<div class="spinner-custom"></div>'
  document.getElementById('updatesFeed').innerHTML = '<div class="spinner-custom"></div>'

  await loadSpots()
  await loadUpdates()

  renderFilterBar()
  renderSpots()
  renderUpdates()
  renderStats()
  setupForm()
  setupNavbarScroll()
  setupScrollAnimations()
  setupRealtime()
}

init()
