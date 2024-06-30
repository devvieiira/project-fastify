import type { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { prisma } from "../../../lib/prisma";

const pump = promisify(pipeline);

export async function uploadVideo(app: FastifyInstance) {
	app.register(fastifyMultipart, {
		limits: {
			files: 1_048_576 * 25, //limite de 25mb
		},
	});

	app.post("/video", async (req, reply) => {
		const data = await req.file();

		if (!data) {
			return reply.status(400).send({ error: "No file uploaded" });
		}

		const extension = path.extname(data.filename);

		if (extension !== ".mp3") {
			return reply.status(400).send({ error: "Invalid file type" });
		}

		const fileBase = path.basename(data.filename, extension);

		const fileUpload = `${fileBase}-${randomUUID()}${extension}`;

		const uploadPath = path.resolve(__dirname, "../../../uploads", fileUpload);

		await pump(data.file, fs.createWriteStream(uploadPath));

		const video = await prisma.video.create({
			data: {
				name: data.filename,
				path: uploadPath,
			},
		});

		return reply.send({ video });
	});
}
