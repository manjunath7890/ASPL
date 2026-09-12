const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../model/userSchema");