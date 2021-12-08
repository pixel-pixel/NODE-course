enum TruckTypes {
  SPRINTER = 'SPRINTER',
  SMALL_STRAIGHT = 'SMALL_STRAIGHT',
  LARGE_STRAIGHT = 'LARGE_STRAIGHT,',
}

const getSizes = (t: TruckTypes) => {
  switch(t){
    case 'SPRINTER': return {
      width: 300,
      length: 250,
      height: 170,
      payload: 1700
    }
    case 'SMALL_STRAIGHT': return {
      width: 500,
      length: 250,
      heigth: 170,
      payload: 2500
    }
    default: return {
      width: 700,
      length: 350,
      height: 200,
      payload: 4000
    }
  }
}

export default TruckTypes
export { getSizes }