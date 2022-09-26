const User = require('../model/userModel')
const brcypt = require('bcrypt')

module.exports.register = async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username })
        if (usernameCheck) {
            return res.json({ msg: "Username already used", status: false });
        }
        const emailCheck = await User.findOne({ email })
        if (emailCheck) {
            return res.json({ msg: "Email already used", status: false });
        }
        const hashedPassword = await brcypt.hash(password, 10)
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        })
        delete user.password
        return res.json({ status: true, user })
    } catch (ex) {
        next(ex)
    }

}

module.exports.login = async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        if (!user) {
            return res.json({ msg: "Incorrect username or password", status: false });
        }
        const isPasswordValid = await brcypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect username or password", status: false });
        }
        delete user.password
        return res.json({ status: true, user })
    } catch (ex) {
        next(ex)
    }

}


module.exports.setAvatar = async(req, res, next) => {
    try {
        const userID = req.params.id
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(userID, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage })
    } catch (ex) {
        next(ex)
    }

}

module.exports.getAllUsers = async(req, res, next) => {
    try {
        const currUser = await User.findOne({ _id: req.params.id })

        var list = []
        await Promise.all(
            currUser.contacts.map((id) =>
                User.findById(id).select(['email', 'username', 'avatarImage', '_id']).then((result) => list.unshift(result))
            )
        )
        return res.json(list)
    } catch (ex) {
        next(ex)
    }
}

module.exports.addContact = async(req, res, next) => {
    try {
        const userID = req.body.to
        const addUser = req.body.add
        const userData = await User.findByIdAndUpdate(userID, { $push: { contacts: addUser } })
        const newContacts = await User.findById(userID).select(['contacts'])
        var list = []
        await Promise.all(
            newContacts.contacts.map((id) =>
                User.findById(id).select(['email', 'username', 'avatarImage', '_id']).then((result) => list.unshift(result))
            )
        )
        return res.json(list)
    } catch (ex) {
        next(ex)
    }
}