const express = require("express")
const router = express.Router()

const radioList = [
  {
    id: 1,
    title: "HardRock FM Jakarta",
  },
  {
    id: 2,
    title: "Radio Republik Indonesia",
  },
  {
    id: 3,
    title: "Elshinta Jakarta",
  },
  {
    id: 4,
    title: "Cosmopolitan Radio",
  },
  {
    id: 5,
    title: "Trax FM",
  },
  {
    id: 6,
    title: "I-Radio",
  }
]

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

  res.render('radio/listen', {title: radio.title, id: radio.id})
})

module.exports = router
