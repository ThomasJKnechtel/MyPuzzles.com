/**
 * creates a variation object storing the sequence of moves and any sub-variations.
 * @param {Integer} startingPly the ply that the variation starts at
 * @param {str} FEN the FEN representing the starting position
 * @returns the Variation Object
 */
function Variation(startingPly, FEN){
    this.startingPly= startingPly
    this.FEN = FEN
    this.currentPly=startingPly
    this.variationIndex=0
    this.size = 0
    this.moves = []
    this.fens = []
    this.variations=[]

    this.addSubVariation = function(startingPly, FEN){
        let subvariation = new Variation(startingPly, FEN)
        this.variations.push(subvariation)
        return subvariation
    }    
    this.addMove = function(move, FEN){
        this.moves.push(move)
        this.fens.push(FEN)
        this.size++
    }
    this.hasMove = function(move, ply){
        if(this.size>ply-startingPly){
            if(this.moves[ply-startingPly]==move)return true
            return false
        }
    }
    this.getPGN = function(){
        let pgn = ''
        let ply=0
        this.moves.map((move)=>{
            pgn+=Math.ceil((ply+1)/2)+" "+move+" "
            ply++
            if(this.variations.length!=0){
                this.variations.map((variation)=>{
                    if(variation.size!=0){
                        if(variation.startingPly==ply){
                            pgn+="( "+variation.getPGN()+" )"
                        }
                    }
                })
            }
        })
        return pgn

    }
    this.getPGNHTML = function(){
        let pgnHTML = ""
        let ply=startingPly
        this.moves.map((move)=>{
            pgnHTML+="<label class='moveLabel' onclick='moveClicked(this)' ply="+ply+">"+Math.ceil((ply+1)/2)+" "+move+" </label>"
            ply++
            if(this.variations.length!=0){
                this.variations.map((variation)=>{
                    if(variation.size!=0){
                        if(variation.startingPly==ply){
                            pgnHTML+="<label class='moveLabel' onclick='moveClicked(this)' ply="+ply+">( "+variation.getPGNHTML()+" )</label>"
                        }
                    }
                })
            }
        })
        return pgnHTML
    }
}