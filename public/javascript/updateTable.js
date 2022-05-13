/**
 * Adds objects to a table with specified id
 * @param {String} id the id of the table
 * @param {Array<Object>} data the items to add to table
 * @param {Object} options {handle:{data_key: function()}, ignore: {data_key: true}} handle formats data, ignore ignores the key
 */
const updateTable = function(id, data, options){
    let tableBody = document.getElementById(id)
    data.map(item => {
        let tableRow = '<tr class="row" onclick="rowClicked(this)">'
        Object.keys(item).forEach(val =>{
            if(options.ignore[val]!==true){
                let tableCell =''
                if(options.handle[val]!==undefined){
                    tableCell = '<td  class="'+val+'">'+options.handle[val](item[val])+"</td>"
                }else{
                    tableCell = '<td  class="'+val+'">'+item[val]+"</td>"
                }
               
                tableRow +=tableCell
            }
        }) 
        tableRow+='</tr>'
        tableBody.innerHTML+=tableRow
    })
}