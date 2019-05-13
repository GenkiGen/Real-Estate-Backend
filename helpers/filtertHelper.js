function getSortObject(req, resp) {
  //Get sort credentials
  const sortField = req.query.sort ? req.query.sort : 'price'
  if (sortField !== 'price' &&
      sortField !== 'title' && 
      sortField !== 'size' &&
      sortField !== 'totalBedrooms' &&
      sortField !== 'totalFloors')
    return resp.status(400).json({
      message: 'Operation failed: Sort on unknown field',
      data: null
    })
  //Get order
  let order = req.query.order ? req.query.order : 'asc'
  if (order !== 'asc' && order !== 'desc') 
    return resp.status(400).json({
      message: 'Operation failed: Unknown order identifier',
      data: null
    })
  else {
    order = order === 'asc' ? 1 : -1
  }
  //Create object
  const sortCred = {}
  sortCred[sortField] = order
  return sortCred
}

function getFilterObject(req, resp) {
  const filterField = req.query.filter? req.query.filter : 'price'
  if (filterField !== 'price' &&
      filterField !== 'title' && 
      filterField !== 'size' &&
      filterField !== 'totalBedrooms' &&
      filterField !== 'totalFloors')
    return resp.status(400).json({
      message: 'Invalid filtering field',
      data: null
    })

  const greaterOrEqual = req.query.gte ? parseFloat(req.query.gte) : 0
  if (isNaN(greaterOrEqual)) 
    return resp.status(400).json({
      message: 'Gte must be a valid number',
      data: null
    })

  const lessOrEqual = req.query.lte ? parseFloat(req.query.lte) : Infinity
  if (isNaN(lessOrEqual)) 
    return resp.status(400).json({
      message: 'Lte must be a valid number',
      data: null
    })

  const result = {}
  result[filterField] = { $gte: greaterOrEqual, $lte: lessOrEqual }
  return result
}

module.exports = {
  getSortObject,
  getFilterObject
}