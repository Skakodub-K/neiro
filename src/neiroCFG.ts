 type InitialNeiro = {
  rowsCount:number,
  columnCount:number,
  layers:number[],
  eta: number
 }
 
const initNeiro:InitialNeiro = {
  rowsCount: 10, 
  columnCount: 5,
  layers:[18, 7, 5],
  eta: 0.6
}
export default  initNeiro;