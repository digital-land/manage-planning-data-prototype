const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker

const generateOrganisation = (params) => {
  return params
}

function convertToTitleCase(str) {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase()
  })
}

const generateOrganisations = () => {
  const organisations = []

  for(let i = 0; i < 10; i++) {
    organisations.push(generateOrganisation({
      id: '' + faker.number.int({ min: 123456, max: 999999 }),
      name: convertToTitleCase(faker.lorem.word()) + " Council"
    }))
  }

  return organisations
}

const generateOrganisationsFile = (filePath) => {
  const organisations = generateOrganisations()
  const filedata = JSON.stringify(organisations, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Organisations generated: ${filePath}`)
    }
  )
}

generateOrganisationsFile(path.join(__dirname, '../app/data/organisations.json'))