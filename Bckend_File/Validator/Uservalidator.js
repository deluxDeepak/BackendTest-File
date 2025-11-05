const validator = require('validator')

function uservalidate(data) {

    const requireField = ["firstname",  "password", "email"];
    const isvalid = requireField.every(value => data[value]);


    if (!isvalid)
        throw new Error("All fields are mandatory");

    if (!validator.isEmail(data.email))
        throw new Error("Your Email is not valid")

    if (!validator.isStrongPassword(data.password))
        throw new Error("Weak password")
}
module.exports = uservalidate;