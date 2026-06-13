const canvas = document.getElementById('reform-canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

canvas.width = window.innerWidth
canvas.height = window.innerHeight

ctx.fillStyle = '#ab0000'
ctx.font = '24px monospace'
ctx.fillText('Hello ReForm! — engine initializing...', 40, 60)