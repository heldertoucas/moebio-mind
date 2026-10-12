let e3D

const W = 800
const H = 800
const D = 800
const Wh = W*0.5
const Hh = H*0.5
const Dh = D*0.5
const prism = {
	p000:new _.P3D(-Wh, - Hh, -Dh),
	p001:new _.P3D(-Wh, - Hh,  Dh),
	p010:new _.P3D(-Wh,   Hh, -Dh),
	p011:new _.P3D(-Wh,   Hh,  Dh),
	p100:new _.P3D(Wh, - Hh, -Dh),
	p101:new _.P3D(Wh, - Hh,  Dh),
	p110:new _.P3D(Wh,   Hh, -Dh),
	p111:new _.P3D(Wh,   Hh,  Dh)
}

let htmlArea
let helpOn = false

let temperatureActive = false
let simulatedTemperature = 1.6

initDraw = function(){
	e3D = new _.Engine3D({
	    lens:900
	})

	e3D.min_zoom = 0.2
	e3D.max_zoom = 3

	e3D.alfa_rotation = 0.01
	e3D.beta_rotation = 0.007
	e3D.zoom = 0.5

	htmlArea = new HtmlArea()
	htmlArea.setData("")
	htmlArea.setActive(false)
	htmlArea.div.style.fontFamily = fontName
}

let stableOverNode
let prevOverNode
let overNodeTimer

drawTree = function(){
	prevOverNode = overNode

	if(temperatureActive){
		drawTemperatureControl()
	}

	if(k.mX>k.W-22 && k.mY<22) k.MOUSE_PRESSED = false
	if(k.mX < 0 || k.mY < 0){
		k.MOUSE_PRESSED = false
		k.DX_MOUSE_PRESSED = 0
		k.DY_MOUSE_PRESSED = 0
	}
	e3D.mouseControl(k, 0.92)
	e3D.x0 = k.cX
	e3D.y0 = k.cY

	const sortedNodes = tree.nodes.getSortedByProperty("size")

	let pairs = []
	sortedNodes.forEach(node=>{
		if(!node.object?.pca) return
		node.p = e3D.projectCoordinates(node.object.pca.x, node.object.pca.y, node.object.pca.z)
		const d = Math.sqrt((node.p.x-k.mX)**2+(node.p.y-k.mY)**2)/(node.p.z*(node.to.length==1?1:2)+1)
		if(d<node.p.z*5) pairs.push([node, d])
	})

	if(k.mX>=0){
		overNode = null
		if(pairs.length>0){
			pairs = pairs.sort((p0,p1)=>p0[1]-p0[0])
			overNode = pairs[0][0]
		}
	}

	const overFather = overNode==tree.nodes[0]

	sortedNodes.forEach(node=>{
		if(node.p.z<0.01) return

		// Efeito direto da temperatura: ramos com probabilidade marginal desvanecem progressivamente
		let tempAlpha = 1.0
		let tempSizeMultiplier = 1.0
		if(typeof simulatedTemperature !== "undefined" && node.flow != null){
			if(simulatedTemperature < 1.58){
				const flow = node.flow
				tempAlpha = Math.max(Math.min(flow * 3.5, 1.0), 0.03)
				tempSizeMultiplier = Math.max(Math.min(Math.pow(flow, 0.25), 1.0), 0.18)
			}
		}

		const color = _.antiTemperature(0.95*node.id.length/maxLength)
		const highlighted = overNode==node || overFather

		node.size = node.p.z*2.4*(node.to.length==1?1:1.2) * tempSizeMultiplier

		const baseAlpha = node.p.z*(highlighted?1.4:(!overNode?0.9:0.2))
		k.fill(_.addAlpha(color, baseAlpha * tempAlpha))
		k.fCircle(node.p.x, node.p.y, node.size, 2)

		if(node.fromRelations[0]) drawRelation(node.fromRelations[0], color, highlighted, tempAlpha)
	})


	k.stroke("rgba(255,255,255,0.5)", 1)
	drawPrism()

	if(overNode != prevOverNode){
		treeView.sendData({type:"over", value:overNode})
		complete_text = null
		let withDelay = !overNode || !overNode.nodes.includes(stableOverNode)
		triggerStableOverNode(withDelay)
		updateDidacticOverlay(overNode)
	}

	drawText()
	drawHelp()
}

let pressButtonTemperature = false

// Recalcular propagação de probabilidade condicional ao longo da árvore (Softmax / Power Temperature)
recalculateTemperatureWeights = function(val){
	if(!tree || !tree.nodes || tree.nodes.length === 0) return
	let newTemp = Math.max(Math.min(Number(val), 1.6), 0)
	simulatedTemperature = newTemp
	temperatureActive = true

	const root = tree.nodes[0]
	root.flow = 1.0
	const queue = [root]

	// tau varia de ~0.015 a 1.0. Em T=0.0, power é alto (argmax puro: caminho determinístico)
	const tau = Math.max(newTemp / 1.6, 0.015)
	const power = 1.0 / tau

	const weightsMap = {}
	weightsMap[root.id] = root.nDown || 100

	while(queue.length > 0){
		const parent = queue.shift()
		const children = parent.to
		if(!children || children.length === 0) continue

		let totalDown = 0
		children.forEach(c => { totalDown += (c.nDown || 1) })

		let sumPowered = 0
		const pows = children.map(c => {
			const rawProb = (c.nDown || 1) / totalDown
			const p = Math.pow(rawProb, power)
			sumPowered += p
			return p
		})

		children.forEach((c, idx) => {
			const prob_T = sumPowered > 0 ? (pows[idx] / sumPowered) : (1 / children.length)
			c.prob_T = prob_T
			c.flow = (parent.flow || 1.0) * prob_T
			const scaledWeight = Math.max(c.flow * (c.nDown || 1) * 5, 0.001)
			c.descentWeight = scaledWeight
			weightsMap[c.id] = scaledWeight
			queue.push(c)
		})
	}

	// Notificar a árvore no iframe (Tree Tile) com os novos pesos calculados sem reiniciar o layout
	if(typeof treeView !== "undefined" && treeView){
		treeView.sendData({type:"temperature_update", value: weightsMap})
	}

	// Atualizar DOM se existir
	const slider = document.getElementById("didactic-temp-slider")
	const label = document.getElementById("didactic-temp-val")
	if(slider && Number(slider.value) !== newTemp) slider.value = newTemp
	if(label) label.textContent = newTemp.toFixed(2)
}

// Função global para definir a temperatura via painel didático (ou atalho)
window.setSimulatedTemperature = function(val){
	recalculateTemperatureWeights(val)
}

drawTemperatureControl = function(){
	const x = k.W - 130
	const y = k.H-30
	const w = 100

	k.stroke("white", 2)
	k.line(x,y,x+w,y)

	if(pressButtonTemperature){
		k.MOUSE_PRESSED = false
		const prevSimulatedTemperature = simulatedTemperature
		let newTemp = 1.6*(k.mX-x)/w
		newTemp = Math.max(Math.min(newTemp, 1.6), 0)
		if(Math.abs(prevSimulatedTemperature - newTemp) > 0.01){
			recalculateTemperatureWeights(newTemp)
		}
	}

	const xT = x + w*simulatedTemperature/1.6
	k.fill("white")
	k.setText("white", 12, null, null, "left", "bottom")
	k.context.font = "12px "+fontName
	k.fText("Temperatura: " + simulatedTemperature.toFixed(2), x, y - 8)
	let over = k.fCircleM(xT,y,4, 5)
	if(over){
		k.pointer()
		if(k.MOUSE_DOWN){
			pressButtonTemperature = true
			k.MOUSE_PRESSED = false
		}
	}

	if(k.MOUSE_UP) pressButtonTemperature = false
}

triggerStableOverNode = function(withDelay){
	if(!withDelay){
		stableOverNode=overNode
		return
	}
	stableOverNode = null
	clearTimeout(overNodeTimer)
	overNodeTimer = setTimeout(()=>{stableOverNode=overNode}, 1500)
}


drawRelation = function(relation, color, highlighted, tempAlpha=1.0){
	const p0 = relation.node0.p
	const p1 = relation.node1.p
	
	let onPath = overNode && overNode.id.includes(relation.node1.id)
	let onComingPath = overNode && relation.node1.id.includes(overNode.id)
	highlighted = highlighted || onPath || onComingPath

	const alpha = (highlighted?(onPath?1:0.4):(!overNode?0.3:0.03))*(p0.z + p1.z) * tempAlpha
	if(alpha < 0.015) return
	
	k.stroke(color, alpha+0.05)
	k.line(p0.x, p0.y, p1.x, p1.y)
}



drawPrism = function(){
	let p000 = e3D.projectPoint3D(prism.p000)
	let p001 = e3D.projectPoint3D(prism.p001)
	let p010 = e3D.projectPoint3D(prism.p010)
	let p011 = e3D.projectPoint3D(prism.p011)
	let p100 = e3D.projectPoint3D(prism.p100)
	let p101 = e3D.projectPoint3D(prism.p101)
	let p110 = e3D.projectPoint3D(prism.p110)
	let p111 = e3D.projectPoint3D(prism.p111)

	k.sLines(
		p000.x, p000.y,
		p100.x, p100.y,
		p110.x, p110.y,
		p010.x, p010.y,
		p000.x, p000.y
	)

	k.sLines(
		p001.x, p001.y,
		p101.x, p101.y,
		p111.x, p111.y,
		p011.x, p011.y,
		p001.x, p001.y
	)

	k.line(p000.x, p000.y,p001.x, p001.y)
	k.line(p100.x, p100.y,p101.x, p101.y)
	k.line(p010.x, p010.y,p011.x, p011.y)
	k.line(p110.x, p110.y,p111.x, p111.y)
}

let complete_text

getRandomSon = function(node){
	if(node.to.length==0) return null 
	let nDown = 0
	node.to.forEach(son=>nDown+=son.nDown)
	let randNum = Math.random()*nDown

	nDown = 0

	let chosenSon
	let i=0


	while(!chosenSon){
		son = node.to[i]
		if(randNum>=nDown && randNum<(nDown+son.nDown+1) ) chosenSon=son
		nDown+=son.nDown
		i++
	}

	return chosenSon
}

buildCompleteText = function(){
	complete_text = stableOverNode.id

	let nextNode = getRandomSon(stableOverNode)// stableOverNode.to.getRandomElement()
	while(nextNode){
		complete_text = nextNode?nextNode.id:complete_text
		nextNode = getRandomSon(nextNode)//nextNode.to.getRandomElement()
	}

	complete_text = complete_text.substr(stableOverNode.id.length)
}


document.clickFunction = function(e){
	let n = Number(e)
	if(n==100){//temperature
		helpOn = false
		htmlArea.setActive(helpOn)
		k.MOUSE_DOWN = false
		temperatureActive = true
		return
	}
	if(!promptFiles[n]) return

	currentDatasetIndex = n
	start = promptFiles[n].start

	// Feedback visual imediato no painel didático
	const badge = document.getElementById("didactic-status-badge")
	const contextEl = document.getElementById("didactic-context")
	if(badge){
		badge.textContent = "A carregar modelo..."
		badge.style.background = "#f59e0b"
	}
	if(contextEl){
		contextEl.innerHTML = `<i>A processar espaço semântico do prompt: "<b>${start}</b>"...</i>`
	}

	// Sincronizar dropdown no painel didático
	const selectEl = document.getElementById("didactic-dataset-select")
	if(selectEl && Number(selectEl.value) !== n){
		selectEl.value = n
	}

	_.loadData(promptFiles[n].file, onLoadData, "json")
}

window.switchDataset = function(n){
	document.clickFunction(Number(n))
}

drawHelp = function(){
	const x = k.W-18
	const y = 18

	if(!helpOn){
		k.fill("rgba(16,35,120,0.6)")
		k.fCircle(x, y, 12)
	}

	k.setText("white", 16, null, null, "center", "middle")
	k.context.font = "16px "+fontName
	k.fText(helpOn?"x":"?", x-3, y+4)

	if(k.mX>k.W-22 && k.mY<22){
		k.pointer()
		if(k.MOUSE_DOWN){
			helpOn = !helpOn
			if(helpOn) htmlArea.setData(helpHtml)
			htmlArea.setActive(helpOn)
			k.MOUSE_DOWN = false
		}
	}
}

drawText = function(){
	htmlArea.setDimensions(20,20,k.W-40,k.H-40)

	if(helpOn){
		k.fill("rgba(16,35,120,0.65)")
		k.fRect(8,7,k.W-14,k.H-16)
		return
	}

	// Limpar o texto de fundo para manter o cubo 3D limpo e desobstruído
	htmlArea.setData("")
}

// -------------------------------------------------------------
// SISTEMA DE OVERLAY DIDÁTICO PEDAGÓGICO
// -------------------------------------------------------------
let didacticActive = true
let lastDidacticNode = null

window.toggleDidacticMode = function(){
	didacticActive = !didacticActive
	const panel = document.getElementById("didactic-panel")
	const btnText = document.getElementById("didactic-btn-text")
	if(panel){
		panel.classList.toggle("active", didacticActive)
	}
	if(btnText){
		btnText.textContent = didacticActive ? "Modo Didático: LIGADO" : "Modo Didático: DESLIGADO"
	}
}

// Atalho de teclado 'D'
window.addEventListener("keydown", function(e){
	if(e.key === "d" || e.key === "D"){
		toggleDidacticMode()
	}
})

updateDidacticOverlay = function(node){
	if(!didacticActive) return

	const badge = document.getElementById("didactic-status-badge")
	const contextEl = document.getElementById("didactic-context")
	const tokenEl = document.getElementById("didactic-token")
	const probEl = document.getElementById("didactic-prob")
	const coordsEl = document.getElementById("didactic-coords")

	if(!node){
		lastDidacticNode = null
		if(badge){
			const count = (tree && tree.nodes) ? tree.nodes.length : 0
			badge.textContent = count > 0 ? `${count.toLocaleString('pt-PT')} nós prontos` : "Modelo Carregado"
			badge.style.background = "#10b981"
		}
		if(contextEl) contextEl.innerHTML = "<i>Passa o rato sobre uma palavra na árvore ou nó no cubo 3D para inspecionar o modelo...</i>"
		if(tokenEl) tokenEl.textContent = "—"
		if(probEl) probEl.textContent = "—"
		if(coordsEl) coordsEl.textContent = "—"
		return
	}

	// Se o nó veio da árvore do iframe (cópia desserializada), obter o nó correspondente na árvore principal
	let canonicalNode = node
	if(tree && node.id && (!node.object || !node.object.pca)){
		const found = tree.get(node.id)
		if(found) canonicalNode = found
	}

	if(lastDidacticNode && lastDidacticNode.id === canonicalNode.id) return
	lastDidacticNode = canonicalNode

	if(badge){
		badge.textContent = "Nó Selecionado"
		badge.style.background = "#3b82f6"
	}

	// Apresentação pedagógica com Smart Cut quando no dicionário baseline
	let displaySentence = canonicalNode.id
	const isTerminal = !canonicalNode.to || canonicalNode.to.length === 0
	if(typeof currentDatasetIndex !== "undefined" && currentDatasetIndex === 1 && isTerminal && !/[.!?)]$/.test(displaySentence.trim())){
		const lastPeriod = displaySentence.lastIndexOf('.')
		if(lastPeriod !== -1){
			const completePart = displaySentence.substring(0, lastPeriod + 1)
			const tailPart = displaySentence.substring(lastPeriod + 1).trim()
			displaySentence = `${completePart} <span style="opacity: 0.65; font-style: italic;">${tailPart}…</span>`
		} else {
			displaySentence = `${displaySentence}…`
		}
	}

	if(contextEl) contextEl.innerHTML = `“<b>${displaySentence}</b>”`
	if(tokenEl) tokenEl.textContent = `"${canonicalNode.name}"`

	// Cálculo da probabilidade condicional
	let probText = "100% (Raiz)"
	if(canonicalNode.parent && canonicalNode.parent.to && canonicalNode.parent.to.length > 0){
		let totalSiblingsDown = 0
		canonicalNode.parent.to.forEach(son => {
			totalSiblingsDown += (son.nDown || 1)
		})
		const myDown = canonicalNode.nDown || 1
		const pct = Math.round((myDown / totalSiblingsDown) * 100)
		probText = `${pct}% (${myDown} de ${totalSiblingsDown} ramificações)`
	} else if(canonicalNode.to && canonicalNode.to.length > 0) {
		let totalDown = 0
		canonicalNode.to.forEach(son => { totalDown += (son.nDown || 1) })
		probText = `Origem com ${canonicalNode.to.length} alternativas (${totalDown} trajetórias)`
	}
	if(probEl) probEl.textContent = probText

	// Coordenadas semânticas do PCA
	if(canonicalNode.object && canonicalNode.object.pca){
		const px = Math.round(canonicalNode.object.pca.x)
		const py = Math.round(canonicalNode.object.pca.y)
		const pz = Math.round(canonicalNode.object.pca.z)
		if(coordsEl) coordsEl.textContent = `X: ${px} | Y: ${py} | Z: ${pz}`
	} else {
		if(coordsEl) coordsEl.textContent = "A calcular..."
	}
}

