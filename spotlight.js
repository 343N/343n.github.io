function update(e){
    var x = e.clientX || e.touches[0].clientX
    var y = e.clientY || e.touches[0].clientY
  
    var centerX = window.innerWidth/2
    var centerY = window.innerHeight/2
    var skewX = centerX - x
    var skewY = centerY - y

    document.documentElement.style.setProperty('--cursorX', x + 'px')
    document.documentElement.style.setProperty('--cursorY', y + 'px')

    // document.documentElement.style.setProperty('--skewX', Math.abs(skewX / window.innerWidth) + 1)
    // document.documentElement.style.setProperty('--skewY', Math.abs(skewY / window.innerHeight) + 1)
  }
  
document.addEventListener('mousemove',update)
document.addEventListener('touchmove',update)

function initEasterEgg(){
    document.documentElement.style.setProperty('cursor','none')
    document.body.classList.add("easterEgg")
}
