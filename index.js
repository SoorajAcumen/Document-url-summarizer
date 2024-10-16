const express = require("express");
const cors = require("cors");
require("dotenv").config()

const { generateFromGeminiAi } = require("./utils/geminiAi")
const { generateFromVertexAI } = require("./utils/vertexAi")

const port = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
    try {
        const result = await generateFromGeminiAi("https://storage.googleapis.com/moksh-dev/word-doc.docx")
        res.status(200).json({ result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

app.get("/pdf", async (req, res) => {
    try {
        const result = await generateFromVertexAI("https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf")
        res.status(200).json({result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})



app.listen(port , () => {
    console.log(`Server running on http://localhost:${port}`)
})