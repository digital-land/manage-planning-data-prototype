const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
const organisations = require('../app/data/organisations.json')

const generateDataset = (params) => {
  let dataset = {}

  dataset.id = "" + faker.number.int({ min: 123456, max: 999999 })

  dataset.organisation = params.organisation
  dataset.name = params.name
  dataset.subject = params.subject

  let now = new Date().toISOString()

  dataset.lastUpdatedDate = faker.date.recent({ days: 21 })

  dataset.status = faker.helpers.arrayElement([
    'Not started',
    'Not working',
    'Awaiting publication',
    'Published'
  ])

  return dataset;
}

const generateDatasets = () => {
  const datasets = []

  organisations.forEach((item) => {
    datasets.push(generateDataset({
      organisation: item,
      name: 'Brownfield land',
      subject: 'Brownfield land data'
    }))
    datasets.push(generateDataset({
      organisation: item,
      name: 'Article 4 direction',
      subject: 'Article 4'
    }))
    datasets.push(generateDataset({
      organisation: item,
      name: 'Article 4 direction area',
      subject: 'Article 4'
    }))
    datasets.push(generateDataset({
      organisation: item,
      name: 'Conservation area',
      subject: 'Conservation area'
    }))
    datasets.push(generateDataset({
      organisation: item,
      name: 'Conservation area document',
      subject: 'Conservation area'
    }))
    datasets.push(generateDataset({
      organisation: item,
      name: 'Listed building',
      subject: 'Listed building',
      status: 'Not started'
    }))
    datasets.push(generateDataset({
      organisation: item,
      name: 'Tree preservation order',
      subject: 'Tree preservation order'
    }))
    datasets.push(generateDataset({
      organisation: item,
      name: 'Tree preservation zone',
      subject: 'Tree preservation order'
    }))
    datasets.push(generateDataset({
      organisation: item,
      name: 'Tree preservation order',
      subject: 'Tree dataset'
    }))
  })

  return datasets
}

const generateDatasetsFile = (filePath) => {
  const datasets = generateDatasets()
  const filedata = JSON.stringify(datasets, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Datasets generated: ${filePath}`)
    }
  )
}

generateDatasetsFile(path.join(__dirname, '../app/data/datasets.json'))