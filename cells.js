import { BACKWARD, BEAT, BREAK, cell, DIRECTIONAL, DOWN, FORWARD, LEFT, NORMAL, RIGHT, sound, UP } from './simulation.js'


const redColors = ['#600', '#700', '#800', '#900', '#a00', '#b00', '#c00', '#d00']
const breadColors = ['#cb8', '#ca7', '#c96']

cell({
	name: 'Generator',
	tick(){
		const a = this.look(BACKWARD)
		if(a)this.make(FORWARD, a), sound(BEAT)
	},
	update: DIRECTIONAL,
	tx: 1, ty: 1
})
cell({
	name: 'CW Rotator',
	tick(){
		let a = this.get(UP)
		if(a) a.rot(RIGHT)
		a = this.get(RIGHT)
		if(a) a.rot(RIGHT)
		a = this.get(LEFT)
		if(a) a.rot(RIGHT)
		a = this.get(DOWN)
		if(a) a.rot(RIGHT)
	},
	update: NORMAL,
	tx: 3, ty: 1
})
cell({
	name: 'CCWRotator',
	tick(){
		let a = this.get(UP)
		if(a) a.rot(LEFT)
		a = this.get(RIGHT)
		if(a) a.rot(LEFT)
		a = this.get(LEFT)
		if(a) a.rot(LEFT)
		a = this.get(DOWN)
		if(a) a.rot(LEFT)
	},
	update: NORMAL,
	tx: 0, ty: 2
})
cell({
	name: 'Mover',
	tick(){
		this.go(FORWARD)
	},
	push(dir){
		return dir == this.dir ? 1 : (dir ^ 2) == this.dir ? -1 : 0
	},
	update: DIRECTIONAL,
	tx: 0, ty: 1
})
cell({
	name: 'Push',
	tx: 1, ty: 2
})
cell({
	name: 'Slide',
	push(dir){
		return ((dir ^ this.dir) & 1) ? -Infinity : 0
	},
	tx: 2, ty: 2
})
const wall = cell({
	name: 'Wall',
	push(dir){
		return -Infinity
	},
	tx: 3, ty: 0
})
cell({
	name: 'Enemy',
	push(dir){
		this.explode(redColors)
		sound(BREAK)
		this.pop()
		return Infinity
	},
	tx: 2, ty: 1
})
cell({
	name: 'Trash',
	push(dir){
		sound(BREAK)
		return Infinity
	},
	tx: 3, ty: 2
})
cell({
	name: 'Bread',
	push(dir, f){
		if(f < 2)return -Infinity
		this.explode(breadColors)
		sound(BREAK)
		this.pop()
		return Infinity
	},
	tx: 0, ty: 3
})
cell({
	name: 'Trapenemy',
	push(dir){
		this.summon(dir, this)
		return Infinity
	},
	tx: 2, ty: 1
})
const sticky = cell({
	name: 'Sticky',
	push(dir, f){
		if(v2.has(this))return 0
		vstack++
		let a = stick(this, dir, f)
		if(!--vstack)visited.clear(), v2.clear()
		return a ? NaN : -Infinity
	},
	tx: 1, ty: 3
})
const visited = new Set, v2 = new Set
let vstack = 0
function stick(me, dir, f, l = 3){
	if(visited.has(me))return false
	visited.add(me)
	if(me.is(wall))return false
	if(!me.is(sticky))return me.move(dir, f)
	const a = l & 1 ? me.get(dir + 1) : null, b = l & 2 ? me.get(dir - 1) : null, c = l & 4 ? me.get(dir + 2) : null
	if(!me.move(dir, f))return false
	if(a)stick(a, dir, f, 5)
	if(b)stick(b, dir, f, 6)
	if(c)return v2.add(this), stick(c, dir, f, 7)
	return true
}
