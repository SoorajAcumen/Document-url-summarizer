const { VertexAI } = require("@google-cloud/vertexai")
require('dotenv').config()

const projectId = process.env.PROJECT_ID
const vertexAI = new VertexAI({ project: projectId, location: 'us-central1' });


const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-001',
});

const generateFromVertexAI = async (url) => {
    try {
        const filePart = {
            file_data: {
                file_uri: url,
                mime_type: 'application/pdf',
            },
        };
        const textPart = {
            text: `
    You are a very professional document summarization specialist.
    Please summarize the given document by bulleted list.`,
        };

        const request = {
            contents: [{ role: 'user', parts: [filePart, textPart] }],
        };

        const resp = await generativeModel.generateContent(request);
        const contentResponse = resp.response?.candidates[0]?.content?.parts[0]?.text;
        return contentResponse
        
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = { generateFromVertexAI }


