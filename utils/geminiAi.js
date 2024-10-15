const { GoogleGenerativeAI } = require("@google/generative-ai");
const { default: axios } = require("axios");
const officeParser = require("officeparser")
require('dotenv').config()

const apiKey = process.env.API_KEY

const googleAI = new GoogleGenerativeAI(apiKey);

const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

const geminiPromptModel = googleAI.getGenerativeModel({
    model: "gemini-pro",
    geminiConfig,
});

const generateFromVertexAi = async (url) => {
    try {
        let text = await extractTextFromDocuments(url);
        const prompt = text + "Can you summarize this document as a bulleted list."
        const result = await geminiPromptModel.generateContent(prompt);
        const response = result.response.text()
        return response
    } catch (error) {
        console.log("response error", error);
    }
};


const extractTextFromDocuments = async (url) => {
    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'arraybuffer' // Binary data for documents
        });

        const bufferData = response.data;
        const result = await parseDocumentAsync(bufferData);

        return result;

    } catch (error) {
        console.error('Error fetching or parsing document:', error);
        throw error;
    }
};


const parseDocumentAsync = (bufferData) => {
    return new Promise((resolve, reject) => {
        officeParser.parseOffice(bufferData, (data, err) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = { generateFromVertexAi }