import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { cohere } from '@ai-sdk/cohere';
import { generateText, streamText } from 'ai';

dotenv.config();

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Backend is running!');
});

app.post('/api/ask-cohere', async (req: express.Request, res: express.Response) => {
    const { message, resumeText } = req.body as {
        message?: string;
        resumeText?: string;
    };
    if (!message || !resumeText) {
        return res.status(400).json({ error: 'Missing message or resumeText' });
    }
    try {
        const result = await streamText({
            model: cohere('command-r-plus'),
            messages: [
                {
                    role: 'system',
                    content: `You are an expert resume assistant. Here is the user's resume:\n${resumeText}. Produce all results that is ReactMarkdown compatible only. no other markdowns. Make it reader friedly and not long paragraphs. Provide headings, subheadings and bullets wherever needed.`,
                },
                { role: 'user', content: message },
            ],
        });
        result.pipeTextStreamToResponse(res);
    } catch (err) {
        console.error('Cohere error:', err);
        res.status(500).json({ error: 'Failed to get response from Cohere.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});