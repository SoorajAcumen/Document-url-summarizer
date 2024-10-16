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

app.get("/", (req, res) => res.send("Document url summarizer"))

app.get("/doc", async (req, res) => {
    try {
        const { url } = req.query
        let result ;
        const fileExtension = url?.split('.').pop().split(/\#|\?/)[0];
        if (fileExtension == 'pdf') {
            result = await generateFromVertexAI(url)
        } else {
            result = await generateFromGeminiAi(url)
        }
        res.status(200).json({ result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

app.get("/pdf/:url", async (req, res) => {
    try {
        const { url } = req.params
        const result = await generateFromVertexAI(url)
        res.status(200).json({result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})



app.listen(port , () => {
    console.log(`Server running on http://localhost:${port}`)
})