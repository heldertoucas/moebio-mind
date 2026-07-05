class HtmlArea{

	/////////////////////////////////////////constructor
	constructor(callBackSendData, config){
		//super(callBackSendData, config)

		this.callBackSendData = callBackSendData
		this.config = config

		this.text

		this.div = this._buildTextArea()

		console.log(this.div)

		this.div.style = "overflow-y:auto"
		//this.div.style.overflow-y = "scroll"

		
	}

	setBackgroundColor = function(color){
		this.div.style["background-color"] = color
	}

	setActive = function(value){
		this.div.style.pointerEvents = value?"auto":"none"
	}

	setDimensions = function(x, y, w, h, z){
		//this.div.style = `position:absolute; left:${x}px; top:${y}px; width:${w-wB-15}px; height:${h}px; resize: none;`
		this.div.style.position = "absolute"
		this.div.style.left = x+"px"
		this.div.style.top = y+"px"
		this.div.style.width = w+"px"
		this.div.style.height = h+"px"

		if(z) this.div.style.zIndex = z
	}

	setHeight = function(h){
		this.div.style.height = h+"px"
	}

	getScrollHeight(){
		return this.div.scrollHeight
	}

	setScrollTopProportion = function(value){
		let maxScroll = this.div.scrollHeight// - this.div.clientHeight
		this.div.scrollTop = maxScroll*value;
	}
	getScrollTopProportion = function(){
		let maxScroll = this.div.scrollHeight// - this.div.clientHeight
		return this.div.scrollTop/maxScroll
	}

	getScrollVisibleProportion = function(){
		return this.div.clientHeight/this.div.scrollHeight
	}

	scrollDown = function(){
		this.div.scrollTop = this.div.scrollHeight
	}

	setFontSize(size){
		this.div.style.fontSize = size
	}
	
	setCSS(css){
		var style = document.createElement('style')
		style.type = 'text/css'
		style.innerHTML = css
		document.getElementsByTagName('head')[0].appendChild(style)
	}

	setData(text){
		//console.log("text", text)
		this.div.innerHTML = _.expandSimpleHtml(text)
	}

	getData(){
		return this.div.value
	}

	setConfig(config){
		super.setConfig(config)
	}

	control(object){
		super.control(object)
	}

	

	draw(){
  		
	}

	
	//////private

	_buildTextArea = function(){
	  let div = document.createElement('div')
	  let main = document.getElementById('maindiv')
	  main.appendChild(div)

	  let it = this

	  return div
	}
}