const express = require("express")
const router = express.Router()
const radios = require('../data/radios.json')

const radioList = radios

router.get('/broadcast', (req, res) => {
  const {id} = req.query

  if (!id) {
    return res.render('radio/radio-list', {data: radioList})
  }

  const radio = radioList.filter(item => item.id.toString() === id.toString())[0]

  res.render('radio/broadcast', {title: radio.title, id: radio.id})
})

router.get('/listen', (req, res) => {
  const {id} = req.query
  const radio = radioList.filter(item => item.id.toString() === id.toString())[0]

  if (!radio) {
    return res.status(404).json({message: "Radio not found!"})
  }

  res.render('radio/listen', {
    title: radio.title,
    cover: radio.cover,
    id: radio.id,
    canPrevChannel: parseInt(id) - 1 > 0,
    canNextChannel: parseInt(id) + 1 <= radioList.length,
    radioLength: radioList.length
  })
})

module.exports = router
