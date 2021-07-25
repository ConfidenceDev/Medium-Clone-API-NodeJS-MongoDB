const cors = require("cors")

//@Cors     Allow all origins
//router.use(cors())
const corsConfig = {
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    origin: ["http://localhost:4000", "http://localhost:5000"],
    optionsSuccessStatus: 200
}

module.exports = cors(corsConfig)