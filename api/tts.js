
import { encode } from "@msgpack/msgpack";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({
                error: "Method not allowed",
            });
        }

        const { text } = req.body;

        const body = encode({
            text,
            reference_id: "your_model_id",
            format: "mp3",
        });

        const response = await fetch("https://api.fish.audio/v1/tts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.FISH_API_KEY}`,
                "Content-Type": "application/msgpack",
                model: "s1",
            },
            body,
        });

        if (!response.ok) {
            const err = await response.text();
            return res.status(500).json({
                error: err,
            });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader("Content-Type", "audio/mpeg");
        res.send(buffer);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message,
        });
    }
}
