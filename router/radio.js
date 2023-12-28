const express = require("express")
const router = express.Router()

const radios = require('../data/radios.json')

router.get('/', (req, res) => {
  res.render('radio/radio-list', {path: '/radio/', data: radios})
})

router.get('/:id', (req, res) => {
  const {id} = req.params
  const radio = radios.filter(item => item.id.toString() === id.toString())[0]

  if (!radio) {
    return res.status(404).json({message: "Radio not found!"})
  }

  res.render('radio/listen', {
    title: radio.title,
    cover: radio.cover,
    id: radio.id,
    canPrevChannel: parseInt(id) - 1 > 0,
    canNextChannel: parseInt(id) + 1 <= radios.length,
    radioLength: radios.length
  })
})

module.exports = router
