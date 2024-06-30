import type { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma";

export async function getAllPrompts(app: FastifyInstance) {
	app.get("/ai/prompts", async () => {
		const prompts = await prisma.prompt.findMany();
		return { prompts };
	});
}
