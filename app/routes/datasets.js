const _ = require('lodash')
const Pagination = require('../helpers/pagination')
const statuses = require('../data/statuses.json')

module.exports = router => {

  router.get('/datasets', (req, res) => {
    let datasets = req.session.data.datasets

    let emailAddress = _.get(req.session.data.search, 'emailAddress')

    if(emailAddress) {
      datasets = datasets.filter(dataset => {
        return dataset.personalDetails.emailAddress.indexOf(emailAddress) > -1
      })
    }

    // ['Received', ...]
    let selectedStatusFilters = _.get(req.session.data.filters, 'statuses')
    let selectedOrganisationFilters = _.get(req.session.data.filters, 'organisations')

    let hasFilters = _.get(selectedStatusFilters, 'length') || _.get(selectedOrganisationFilters, 'length')

    let selectedFilters = {
      categories: []
    }

    // the user has selected a status filter
    if(hasFilters) {
      datasets = datasets.filter(dataset => {
        let matchesStatus = true
        let matchesOrganisation = true

        if(_.get(selectedStatusFilters, 'length')) {
          matchesStatus = selectedStatusFilters.includes(dataset.status);
        }

        if(_.get(selectedOrganisationFilters, 'length')) {
          matchesOrganisation = selectedOrganisationFilters.includes(dataset.organisation.name);
        }

        return matchesStatus && matchesOrganisation
      })
    }

    if(_.get(selectedStatusFilters, 'length')) {
      selectedFilters.categories.push({
        heading: { text: 'Status' },
        items: selectedStatusFilters.map(label => {
          return {
            text: label,
            href: `/datasets/remove-status/${label}`
          }
        })
      })
    }

    if(_.get(selectedOrganisationFilters, 'length')) {
      selectedFilters.categories.push({
        heading: { text: 'Organisation' },
        items: selectedOrganisationFilters.map(label => {
          return {
            text: label,
            href: `/datasets/remove-organisation/${label}`
          }
        })
      })
    }

    let pageSize = 25
    let pagination = new Pagination(datasets, req.query.page, pageSize)
    datasets = pagination.getData()

    let organisationCheckboxItems = require('../data/organisations.json').map(item => {
      return {
        text: item.name,
        value: item.name
      }
    })

    let statusFilterOptions = statuses.map(status => {
      return {
        text: status,
        value: status
      }
    })

    res.render('datasets/index', {
      statusFilterOptions,
      datasets,
      selectedFilters,
      pagination,
      organisationCheckboxItems
    })
  })

  router.get('/datasets/clear-search', (req, res) => {
    _.set(req, 'session.data.search.emailAddress', '')
    res.redirect('/datasets')
  })

  router.get('/datasets/remove-status/:status', (req, res) => {
    _.set(req, 'session.data.filters.statuses', _.pull(req.session.data.filters.statuses, req.params.status))
    res.redirect('/datasets')
  })

  router.get('/datasets/remove-organisation/:organisation', (req, res) => {
    _.set(req, 'session.data.filters.organisation', _.pull(req.session.data.filters.organisations, req.params.organisation))
    res.redirect('/datasets')
  })

  router.get('/datasets/clear-filters', (req, res) => {
    _.set(req, 'session.data.filters.statuses', null)
    _.set(req, 'session.data.filters.organisations', null)
    res.redirect('/datasets')
  })

  router.get('/datasets/:datasetId', (req, res) => {
    let dataset = req.session.data.datasets.find(dataset => dataset.id === req.params.datasetId)

    res.render('datasets/show', {
      dataset
    })
  })




}