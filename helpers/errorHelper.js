function stringify(error) {
  if (error.name === "ValidationError") {
    for (field in error.errors) {
      const pathName = capitalize(normalize(error.errors[field].path))
      switch(error.errors[field].kind) {
        case 'required':
          return `${pathName} is required`
        case 'exists':
          return `An ad with the same ${pathName} already exists`
        default:
          return `${pathName} is not valid`
      }
    }
  } else if (error.name === "Error") {
    return error.message
  }
}

function capitalize(sentence) {
  return sentence[0].toUpperCase() + sentence.slice(1)
}

function normalize(path) {
  return path.indexOf('.') != 0 ? path.split('.').join(', ') : path
}

module.exports = {
  stringify
}