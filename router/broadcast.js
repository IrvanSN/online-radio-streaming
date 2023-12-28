const express = require('express')
const router = express.Router()

const radios = require('../data/radios.json')

router.get('/', (req, res) => {
  res.render('radio/radio-list', {path: '/broadcast/radio?id=',data: radios})
})

router.get('/radio', (req, res) => {
  const {id} = req.query

  if (!id) {
    return res.redirect('/broadcast')
  }

  const radio = radios.filter(item => item.id.toString() === id.toString())[0]

  res.render('radio/broadcast', {title: radio.title, id: radio.id, cover: radio.cover})
})

module.exports = router
