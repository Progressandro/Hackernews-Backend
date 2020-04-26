const jwt = require('jsonwebtoken')
const APP_SECRET = process.env.APP_SECRET

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  console.log(Authorization)
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }
}

module.exports = {
  APP_SECRET,
  getUserId,
}
