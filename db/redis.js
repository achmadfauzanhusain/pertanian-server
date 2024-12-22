const redis = require("redis")

const REDIS_PORT = 6379

const client = redis.createClient(REDIS_PORT)
client.connect()

module.exports = { client }