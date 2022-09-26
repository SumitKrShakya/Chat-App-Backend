const { search } = require('../controllers/searchController')
const router = require('./userRoutes')

router.post('', search)


module.exports = router