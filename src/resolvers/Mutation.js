const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(root, args, context) {
  const userId = getUserId(context)
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  })
}

async function signup(parent, args, context, info) {
  const hashedPassword = await bcrypt.hash(args.password, 10)
  const { password, ...user } = await context.prisma.createUser({ ...args, password: hashedPassword })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)
  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const { password, ...user } = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = bcrypt.compare(args.password, password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

module.exports = {
  signup,
  login,
  post,
}
