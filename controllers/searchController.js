const User = require('../model/userModel')

module.exports.search = async(req, res, next) => {
    try {
        let searchResults = await User.find({ username: { $regex: `${req.body.val}` }, _id: { $ne: req.body.currentUser._id } }).select(['email', 'username', 'avatarImage', '_id'])
        const contacts = await User.findById(req.body.currentUser._id).select('contacts')
        searchResults = searchResults.filter((val) => !contacts.contacts.includes(val._id));
        return res.json(searchResults)
    } catch (ex) {
        next(ex)
    }

}