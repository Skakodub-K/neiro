 type InitialNeiro = {
  rowsCount:number,
  columnCount:number,
  countOfNeurons:number,
  layers:number[]
 }
 
const initNeiro:InitialNeiro = {
  rowsCount: 10, 
  columnCount: 5,
  countOfNeurons: 5,
  layers:[3,4,5] 
}
export default  initNeiro;