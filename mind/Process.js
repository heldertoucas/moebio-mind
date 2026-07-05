calculatePCAs = function(fast=true){
	if(TEXTS_OBJECT.length<5) return

	TEXTS_OBJECT.forEach(ob=>{
		ob.pca = null
	})
	let table = new _.T()
	let pcaNodes = tree.nodes.filter(node=>node.from.length==0 || node.to.length==0)

	pcaNodes.map(node=>node.object).forEach(obj=>{
		let simplifiedEmbedding = new _.nL()
		if(fast){
			obj.embedding.forEach((val,i)=>{
				if(i%2==0) simplifiedEmbedding.push(val)
			})
		} else {
			simplifiedEmbedding = obj.embedding
		}
		
		table.push(simplifiedEmbedding)
	})
	table = table.transpose()

	//console.log(table)

	const pca_leaves = getPCAandComponents(table, 3, false)

	console.log(pca_leaves)

	pcaNodes.map(node=>node.object).forEach((obj,i)=>{
		obj.pca = {
			x:pca_leaves.pcaTable[0][i],
			y:pca_leaves.pcaTable[1][i],
			z:pca_leaves.pcaTable[2][i]
		}
	})

	let minX = 9999
	let minY = 9999
	let minZ = 9999
	let maxX = -9999
	let maxY = -9999
	let maxZ = -9999


	tree.nodes.map(node=>node.object).forEach(object=>{
		
		if(!object.pca){
			let simplifiedEmbedding = new _.nL()
			if(fast){
				object.embedding.forEach((val,i)=>{
					if(i%2==0) simplifiedEmbedding.push(val)
				})
			} else {
				simplifiedEmbedding = object.embedding
			}
			object.pca = projectPCA(simplifiedEmbedding, pca_leaves.components)
		} else {
			minX = Math.min(minX, object.pca.x)
			minY = Math.min(minY, object.pca.y)
			minZ = Math.min(minZ, object.pca.z)
			maxX = Math.max(maxX, object.pca.x)
			maxY = Math.max(maxY, object.pca.y)
			maxZ = Math.max(maxZ, object.pca.z)
		}
	})

	const ampX = maxX - minX
	const ampY = maxY - minY
	const ampZ = maxZ - minZ

	tree.nodes.map(node=>node.object).forEach(object=>{
		object.pca.x = -Wh + W*(object.pca.x-minX)/ampX
		object.pca.y = -Hh + H*(object.pca.y-minY)/ampY
		object.pca.z = -Dh + D*(object.pca.z-minZ)/ampZ
	})

	console.log("done PCAs")
	//console.log(TEXTS_OBJECT)
	//console.log(JSON.stringify(TEXTS_OBJECT))
}




startCompletions = function(){
	console.log(start)
	//console.trace()
	completion(start, onCompletion, undefined, undefined, temperature)
}

//let texts = []
onCompletion = function(response){
	console.log("onCompletion")
	//console.log(response.content)

	if(!response.content){
		console.log("x")
		completion(start, onCompletion, undefined, undefined, temperature)
		return
	}

	let text = response.content.replaceAll("  ", " ").replaceAll("  ", " ").trim()
	if(text.includes("\n")) text = text.split("\n")[0]
	text = start + text
	text = text.split(" ").slice(0,limit_n_words).join(" ")

	//console.log(text)

	if(textsOnList[text]){
		console.log("next")
		completion(start, onCompletion, undefined, undefined, temperature)
		return
	}

	lastObject = {
		text,
		isCompletion:true
	}

	console.log(TEXTS_OBJECT.length, TEXTS_OBJECT.filter(ob=>ob.isCompletion).length,  text)

	embedding(text, onEmbed)
}

onEmbed = function(response){
	console.log("onEmbed")
	lastObject.embedding = response.embedding
	textsOnList[lastObject.text] = true

	const words = lastObject.text.split(" ")
	const texts = []

	words.forEach((word,i)=>{
		const sub_text = words.slice(0,i).join(" ")
		if(sub_text && !textsOnList[sub_text]){
			texts.push(sub_text)
			textsOnList[sub_text] = true
		}
	})

	console.log("texts: ", texts)
	if(texts.length>0){
		embeddingMany(texts, onEmbeddEachSubtext, onEmbeddAllSubtexts)
	} else {
		completion(start, onCompletion, undefined, undefined, temperature)
	}

	//completion(start, onCompletion, undefined, undefined, temperature)
}

onEmbeddEachSubtext = function(response, nText, all, nAll){
	console.log(nText+"/"+nAll)

	if(response.embedding) TEXTS_OBJECT.push({text:response.text, embedding:response.embedding})
}

onEmbeddAllSubtexts = function(response){
	console.log("all", response)

	TEXTS_OBJECT.push(lastObject)


	buildTree()
	calculatePCAs()

	print()



	completion(start, onCompletion, undefined, undefined, temperature)
}




print = function(){
	//calculatePCAs(false)

	TEXTS_OBJECT.forEach(ob=>{
		ob.node = null
		delete ob.node
		ob.pca = null
		delete ob.pca
	})

	console.log(JSON.stringify(TEXTS_OBJECT))
}



//////////////////////////////////////////////////////////////////////////

// expandTEXTS_OBJECT = function(){
// 	console.log(TEXTS_OBJECT.length)
// 	const dictionary = {}
// 	TEXTS_OBJECT.forEach(obj=>dictionary[obj.text]=true)

// 	for(let i=0; i<TEXTS_OBJECT.length; i++){
// 		const words = TEXTS_OBJECT[i].text.split(" ")
// 		words.forEach((word,j)=>{
// 			const sub_text = words.slice(0,j).join(" ")
// 			if(sub_text && !dictionary[sub_text]){
// 				//TEXTS_OBJECT.splice(i,0,{text:sub_text})
// 				dictionary[sub_text] = true
// 				TEXTS_OBJECT.push({text:sub_text})
// 				//i++
// 			}
// 		})
// 	}

// 	TEXTS_OBJECT.sort((a,b)=>2*Number(a.text.includes(b.text))-1)


// 	// TEXTS_OBJECT.forEach((obj,i)=>{
		
// 	// })
// 	console.log(TEXTS_OBJECT.length)
// 	console.log(TEXTS_OBJECT)

// 	completeEmbeddingsAndPCA()
// }

// let iObject=0

// completeEmbeddingsAndPCA = function(){
// 	if(!TEXTS_OBJECT[0].components){
// 		let table = new _.T()
// 		TEXTS_OBJECT.filter(ob=>ob.embedding).forEach(ob=>table.push(ob.embedding))
// 		table = table.transpose()

// 		console.log(table)

// 		const pca_leaves = getPCAandComponents(table, 3, false)
// 		TEXTS_OBJECT[0].components = pca_leaves.components
// 	}

// 	while(iObject<TEXTS_OBJECT.length && TEXTS_OBJECT[iObject].embedding) iObject++

// 	if(iObject<TEXTS_OBJECT.length && TEXTS_OBJECT[iObject]){
// 		embedding(TEXTS_OBJECT[iObject].text, onEmbedIncompleteObject)
// 	} else {
// 		console.log("embeddings on all objects")
// 	}

// }

// onEmbedIncompleteObject = function(response){
// 	TEXTS_OBJECT[iObject].embedding = response.embedding
// 	iObject++
// 	console.log(iObject+"/"+TEXTS_OBJECT.length)
// 	while(TEXTS_OBJECT[iObject].embedding) iObject++
// 	if(TEXTS_OBJECT[iObject]){
// 		embedding(TEXTS_OBJECT[iObject].text, onEmbedIncompleteObject)
// 	} else {
// 		console.log(JSON.stringify(TEXTS_OBJECT))
// 	}
// }
