import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { OpenAIStream, streamToResponse } from "ai";
import { openai } from "../../../lib/openai";
export async function generateAi(app: FastifyInstance) {
	app.post("ai/complete", async (req, reply) => {
		const bodySchema = z.object({
			videoId: z.string().uuid(),
			prompt: z.string(),
			temperature: z.number().min(0).max(1).default(0.5),
		});

		const { videoId, prompt, temperature } = bodySchema.parse(req.body);

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			},
		});

		if (!video.transcription) {
			return reply.status(400).send({ error: video.transcription });
		}

		const promptMsg = prompt.replace("{transcription}", video.transcription);

		const res = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: promptMsg }],
			stream: true,
		});

		const stream = OpenAIStream(res);
		streamToResponse(stream, reply.raw, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			},
		});
	});
}
