const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db');
const {User, Organization} = require('../model')
require('dotenv').config()

exports.RegisterUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body
        if(!fullname || !email || !password){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const existingUser = await User.findOne({where: {email}})
        if(existingUser){
            return res.status(409).json({
                message: 'User already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
        })
        res.status(201).json({
            message: 'User registered successfully', user
        })
    } catch (err){
        res.status(500).json({message: 'Server error'})
        console.log(err)
    }
}

exports.LoginUser = async (req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const user = await User.findOne({where: {email}})
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        
        if(!user || !isPasswordMatched){
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        const token = jwt.sign(
            {userId: user.id, isAdmin: user.isAdmin, isOrg: false,},
            process.env.JWT_SECRET,
            {expiresIn: '7h'}
        )
        res.status(200).json({ message: 'Login successful.',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.', err });
    }
}

exports.RegisterOrg = async (req, res) => {
    try{
        const {
            orgName,
            description,
            category,
            state,
            city,
            district,
            locality,
            pin,
            email,
            password
        } = req.body

        if(!orgName || !description || !category || !state || !city || !district || !locality || !pin || !email || !password){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const existingOrg = await Organization.findOne({where: {email}})
        if(existingOrg){
            return res.status(409).json({
                message: 'Organization already exists'
            })
        }
        const existingOrgName = await Organization.findOne({where: {orgName}})
        if(existingOrgName){
            return res.status(400).json({
                message: 'Organization name already in use'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const Org = await Organization.create({
            orgName,
            description,
            category,
            state,
            city,
            district,
            locality,
            pin,
            email,
            password: hashedPassword
        })
        res.status(201).json({
            message: 'Organization registered successfully', Org
        })
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.', err });
    }
}

exports.LoginOrg = async (req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const Org = await Organization.findOne({where: {email}})
        const isPasswordMatched = await bcrypt.compare(password, Org.password)
        
        if(!Org || !isPasswordMatched){
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        const token = jwt.sign(
            {OrgId: Org.id, isOrg: true},
            process.env.JWT_SECRET,
            {expiresIn: '7h'}
        )
        res.status(200).json({ message: 'Login successful.',
            token,
            Org: {
                id: Org.id,
                fullname: Org.orgName,
                email: Org.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.', err });
    }
}