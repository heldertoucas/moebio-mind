const URL_VIEW_BASE = "Pulse_And_Tiles/Tiles/"

let k
let tree

//
//let accumulative = ""

let TEXTS_OBJECT = []
let textsOnList = {}
let treeView
let maxLength
let overNode


let start = "Intelligence is "//"I had this crazy dream: "//"When "
const dataFile = "data/intelligence_is.json"//"tree2.json"// 
let runCompletions = false

// let start = "Santiago Ortiz is "//"I had this crazy dream: "//"When "
// const dataFile = "data/Santiago_Ortiz_is.json"//"tree2.json"// 
// let runCompletions = true


// let start = "When "//"I had this crazy dream: "//"When "
// const dataFile = "data/When.json"//"tree2.json"// 
// let runCompletions = true


// let start = "The best thing about AI is its ability to "//"I had this crazy dream: "//"When "
// const dataFile = "data/best_thing_about_ai_is.json"//"tree2.json"// 
// let runCompletions = false

// let start = "tell me a story: "//"I had this crazy dream: "//"When "
// const dataFile = "data/tell_me_a_story.json"//"tree2.json"// 
// let runCompletions = false


// let start = "chatgpt is "//"I had this crazy dream: "//"When "
// const dataFile = "data/chatgpt_is.json"//"tree2.json"// 
// let runCompletions = true

// let start = "my dream "//"I had this crazy dream: "//"When "
// const dataFile = "data/My_dream.json"//"tree2.json"// 
// let runCompletions = false

//let start = "L'ERP c'est "//"I had this crazy dream: "//"When "
//const dataFile = "data/ERP.json"// = "data/My_dream.json"//"tree2.json"// 
//let runCompletions = true


const promptFiles = [
	{
		start:"Chatgpt is ",//"I had this crazy dream: "//"When "
		file:"data/chatgpt_is.json"
	},
	{
		start:"The best thing about AI is its ability to ",//"I had this crazy dream: "//"When "
		file:"data/best_thing_about_ai_is.json"
	},
	{
		start:"When ",//"I had this crazy dream: "//"When "
		file:"data/When.json"
	},
	{
		start:"Santiago Ortiz is ",//"I had this crazy dream: "//"When "
		file:"data/Santiago_Ortiz_is.json"
	},
	{
		start:"My dream ",//"I had this crazy dream: "//"When "
		file:"data/My_dream.json"
	},
	{
		start:"Tell me a story: ",//"I had this crazy dream: "//"When "
		file:"data/tell_me_a_story.json"
	},
	{
		start:"ERP c'est ",//"I had this crazy dream: "//"When "
		file:"data/ERP.json"
	},
	{
		start:"Intelligence is ",//"I had this crazy dream: "//"When "
		file:"data/intelligence_is.json"
	}
]

const fastPCA = true
const limit_n_words = 36//12//24//60 
let temperature = 1.6


let addPCAs = false
let simplifyTree = false
let expandJson = false // add sub-sequences with embeddings to all responses

let fontName = "Roboto_Condensed"// "Rubik"
let fontStyle = "Regular"
let fontStyleTree = "Regular"

let helpHtml
let font

simplify_embedding_numbers = true

init=function(){
	let proceed = function(){
	  	if(dataFile){
			_.loadData(dataFile, onLoadData, "json")
		} else {
			onLoadData({result:[]})
		}
	}

	try {
		font = new FontFace(fontName, 'url(fonts/'+fontName+'/'+fontName.replaceAll("_","")+'-'+fontStyle+'.ttf'+')');
		font.load().then(function(loadedFont){
		  	document.fonts.add(loadedFont)
		  	proceed()
		}).catch(function(err){
			console.warn("Font loading fallback:", err)
			proceed()
		})
	} catch(e) {
		console.warn("Font error:", e)
		proceed()
	}
	_.loadData("Help.txt", onLoadHelp, "txt")
}

onLoadHelp = function(obj){
	helpHtml = obj.result.replaceAll("\n", "<br>")
}

cycle=function(){
	const xSeparation = window.innerWidth - window.innerHeight
	treeView.setDimensions(xSeparation,0,window.innerWidth-xSeparation,window.innerHeight)
	k.setDimensions(0,0,xSeparation,window.innerHeight)
	drawTree()
}

onLoadData = function(obj){
	TEXTS_OBJECT = obj.result

	buildTree()
	calculatePCAs(fastPCA)

	if(runCompletions){
		TEXTS_OBJECT.forEach(ob=>textsOnList[ob.text]=true)
		startCompletions()
	}

	if(expandJson){
		expandTEXTS_OBJECT()
		return
	}

	if(!treeView){
		loadTile(
			URL_VIEW_BASE+"Tree",
			vw => {
				treeView = vw
				buildTree()

				treeView.sendData({type:"background_color", value:"black"})
				treeView.sendData({type:"nodes_color", value:"rgb(10,40,100)"})
				treeView.sendData({type:"text_color", value:"rgb(255,255,255)"})

				treeView.iframe.contentDocument.fonts.add(font)
				treeView.scope.fontName = fontName
				
				k = new _.MetaCanvas({cycle, resize})
				k.setBackgroundColor("white")

				initDraw()
			},
			receiveDataFromView,
			"tree",
		)
	}
}

receiveDataFromView = function(ob){
	if(ob.data.value){
		let withDelay = !ob.data.value.nodes.includes(overNode)
		overNode = ob.data.value
		triggerStableOverNode(withDelay)
		k.mX=-1000
	} else {
		overNode = null
	}
}

buildObject = function(){
	if(tree.nodes.length == TEXTS_OBJECT.length ){
		console.log(JSON.stringify(TEXTS_OBJECT))
		return
	}
	embedding(tree.nodes[TEXTS_OBJECT.length].id, onEmbedd)
}

onEmbedd = function(ob){
	ob.embedding = ob.embedding.map(val=>Math.round(val*1000))
	TEXTS_OBJECT.push({text:ob.text, embedding:ob.embedding})
	console.log(TEXTS_OBJECT.length+"/"+tree.nodes.length)
	buildObject()
}













/////

resize = function(){

}


///////////////////////////////////////////////////////////////

window.addEventListener("load", function() {
	init()
})
