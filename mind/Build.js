
buildTree = function() {
    tree = new _.Tr()
    maxLength = 0
    
    TEXTS_OBJECT.forEach(obj=>{
    	const text = obj.text
    	const words = text.trim().split(" ")
    	const id = text
        const id_parent = words.length==1?null:words.slice(0,words.length-1).join(" ")
        let parent = id_parent==null?null:tree.get(id_parent)
        let node = tree.get(id)
        if(node==null){
            node = new _.Nd(id, words.at(-1))
            node.nDown = 1
            node.weight
            node.object = obj
            obj.node = node
            tree.addNodeToTree(node, parent)
            while(parent){
                parent.nDown++
                parent = parent.parent
            }
        }
        // words.forEach((word, i)=>{
        //     const id = words.slice(0,i+1).join(" ")
        //     const id_parent = i==0?null:words.slice(0,i).join(" ")
        //     const parent = id_parent==null?null:tree.get(id_parent)
        //     const node = tree.get(id)
        //     if(node==null){
        //         tree.addNodeToTree(new _.Nd(id, word), parent)
        //     }
        // })

        
        maxLength = Math.max(maxLength, obj.text.length)
    })

    // if(simulatedTemperature<1.6){
    //     let assignSurvivalToSons = function(node){
    //         let nDown=0
    //         node.to.forEach(son=>{
    //             nDown+=son.nDown
    //         })
    //         console.log(node.to.length, nDown)
    //         node.to.forEach(son=>{
    //             son.wD = son.nDown/nDown
    //         })
    //     }
        
    //     tree.nodes.forEach(assignSurvivalToSons)
    //     tree.nodes[0].wD = 1
    //     console.log(tree.nodes.map(nd=>nd.wD))
    // }


    if(simplifyTree){
        const treeSimple = new _.Tr()

        tree.nodes.forEach(node=>{
            if(node.to.length!=1){
                let name = node.name
                let parent = node.parent
                while(parent && parent.to.length==1){
                    name = parent.name+" "+name
                    parent = parent.parent
                }
                const new_node = new _.Nd(node.id, name)
                treeSimple.addNodeToTree(new_node, parent==null?null:treeSimple.get(parent.id))
                new_node.object = node.object
                new_node.object.node = new_node
            }
        })

        tree = treeSimple
    }

    tree.nodes.forEach(node=>node.size=1)

    if(tree && tree.nodes.length>2 && treeView) treeView.sendData({value:tree, type:"data"})
}




function textsToTree(texts, maxL) {
    const tree = new mo.Tree()
    
    if(maxL) texts = texts.filter(t=>t.length<maxL)
    
    texts.forEach(text=>{
        let words = text.split(" ")
        words.forEach((word, i)=>{
            const id = words.slice(0,i+1).join(" ")
            const id_parent = i==0?null:words.slice(0,i).join(" ")
            const parent = id_parent==null?null:tree.nodeList.getNodeById(id_parent)
            const node = tree.nodeList.getNodeById(id)
            if(node==null){
                console.log(id, word)
                tree.addNodeToTree(new mo.Node(id, word), parent)
            }
        })
    })
    
    return tree;
}