const express = require('express')
const router = express.Router()
const {RegisterUser, LoginUser, RegisterOrg, LoginOrg} = require('../controller/authController')


router.post("/signup", RegisterUser)
router.post("/login", LoginUser)

router.post("/org-signup", RegisterOrg)
router.post("/org-login", LoginOrg)


module.exports = router