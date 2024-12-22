const { client } = require("../../db/redis")

module.exports = {
    cache: async (req, res, next) => {
        try {
            const redisCheck = await client.get(req.user.username);
            if (redisCheck) {
                console.log("Cache hit");
                const data = JSON.parse(redisCheck); // Parse data dari Redis
                return res.status(200).json({ data }); // Kirim data langsung dari cache
            }
            console.log("Cache miss");
            next(); // Lanjutkan ke handler berikutnya jika tidak ada data di Redis
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    },
}