import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { createReadStream } from "fs";
import { openai } from "../../../lib/openai";

export async function createTs(app: FastifyInstance) {
	app.post("/video/:videoId/transcript", async (req) => {
		const paramsSchema = z.object({
			videoId: z.string().uuid(),
		});
		const { videoId } = paramsSchema.parse(req.params);

		const bodySchema = z.object({
			prompt: z.string(),
		});
		const { prompt } = bodySchema.parse(req.body);

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			},
		});

		const path = video.path;
		const audioRS = createReadStream(path);

		const res = await openai.audio.transcriptions.create({
			file: audioRS,
			model: "whisper-1",
			language: "pt",
			response_format: "json",
			temperature: 0,
			prompt,
		});

		const transcription = res.text;

		await prisma.video.update({
			where: {
				id: videoId,
			},
			data: {
				transcription,
			},
		});
	});
}
