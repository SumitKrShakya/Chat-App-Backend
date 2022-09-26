const { register, addContact, login, setAvatar, getAllUsers } = require('../controllers/usersController')

const router = require('express').Router()


router.post('/register', register)
router.post('/login', login)
router.post('/setAvatar/:id', setAvatar)
router.post('/allusers/:id', getAllUsers)
router.post('/addContact', addContact)

module.exports = router