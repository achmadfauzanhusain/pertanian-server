const redis = require("redis")

const REDIS_PORT = 5000

const client = redis.createClient(REDIS_PORT)

module.exports = { client }