// fazendo a captura de elementos
const menuItems = document.querySelectorAll('.nav a[href^="#"]')
const header = document.querySelector('.header')
const textHeader = document.querySelectorAll('.header .nav ul li a')
const btnTopo = document.querySelector('.btnTopo')
const writer = document.querySelector('.phrase')
const btnMenuLateral = document.querySelector('.btnMenuLateral')


// função efeito maquina de escrever
const texts = ['Web Developer', 'Apaixonado por Programação!']

function write(texts, done) {
  const char = texts.split('').reverse()
  const typer = setInterval(() => {
    if (!char.length) {
      clearInterval(typer)
      return setTimeout(done, 1500) // espera um pouco antes de apagar
    }
    const next = char.pop()
    writer.innerHTML += next
  }, 100)
}

function clear(done) {
  const char = writer.innerHTML
  let nr = char.length
  const typer = setInterval(() => {
    if (nr-- == 0) {
      clearInterval(typer)
      return done()
    }
    writer.innerHTML = char.slice(0, nr)
  }, 50)
}

function baseboard(contents) {
  let atual = -1

  function next(cb) {
    atual < contents.length - 1 
      ? atual++
      : atual = 0

    let texts = contents[atual]
    write(texts, () => {
      clear(next)
    })
  }
  next(next)
}

baseboard(texts)


// funções de scroll
window.addEventListener('scroll', () => {

  // array onde são armazedaos os ids e localização na tela de cada section
  const sections = []

  // adiciona as informações o array acima
  menuItems.forEach(item => {
    sections.push({ 
      id: item.hash, 
      scrollLocation: document.querySelector(item.hash).offsetTop+1
    })
  })
  
  const menuItemsArray = [...menuItems]
  
  // adiciona seleção no header na section atual
  sections.forEach(item => {
    if (window.scrollY >= item.scrollLocation -100) {
      menuItemsArray.forEach(item => item.className = '')
      newMenuItemsArray = menuItemsArray.filter(i => i.hash == item.id)
      newMenuItemsArray[0].classList.add('selected')
    } 
  })

  // adicona efeitos e cores no header ao dar scroll
  if (window.scrollY != 0) {
    header.classList.add('menuColorized')
    textHeader.forEach(item => item.style.color = 'var(--colorTexts)')
  } else {
    header.classList.remove('menuColorized')
    textHeader.forEach(item => item.style.color = '')
  }

  // insere o botão retornar ao topo na página
  window.scrollY >= 400 
    ? btnTopo.classList.add('visible')
    : btnTopo.classList.remove('visible')

})


// função do botão ir para o topo da página
btnTopo.onclick = function() {
  smoothScrollTo(0, 0, 1000)
}

// função que leve o usuário até a section selecionada no header
function scrollToIdOnClick(e) {
  e.preventDefault()

  const element = e.target
  const id = element.getAttribute('href')
  const section = document.querySelectorAll(id)[0].offsetTop

  smoothScrollTo(0, section, 1000)
}

menuItems.forEach(item => {
  item.addEventListener('click', scrollToIdOnClick)
})


// função que cria a animação de scroll entre as páginas (encontrei pronta)
 function smoothScrollTo(endX, endY, duration) {
  const startX = window.scrollX || window.pageXOffset
  const startY = window.scrollY || window.pageYOffset
  const distanceX = endX - startX
  const distanceY = endY - startY
  const startTime = new Date().getTime()

  duration = typeof duration !== 'undefined' ? duration : 400

  // Easing function
  const easeInOutQuart = (time, from, distance, duration) => {
    if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from
    return -distance / 2 * ((time -= 2) * time * time * time - 2) + from
  }

  const timer = setInterval(() => {
    const time = new Date().getTime() - startTime
    const newX = easeInOutQuart(time, startX, distanceX, duration)
    const newY = easeInOutQuart(time, startY, distanceY, duration)
    if (time >= duration) {
      clearInterval(timer)
    }
    window.scroll(newX, newY)
  }, 1000 / 60) // 60 fps
}