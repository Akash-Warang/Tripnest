const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationOTP: String,
    otpExpiry: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastLogin: {
        type: Date
    },
    adminLevel: {
        type: Number,
        enum: [0, 1, 2], // 0=regular, 1=moderator, 2=super admin
        default: 0
    },
    permissions: {
        type: [String],
        default: []
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);