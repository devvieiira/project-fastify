import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";

const app = fastify();

app.listen({
	port: 4000,
});

app
	.register(fastifyCors, { origin: true })

	.then(() => {
		console.log("HTTP Server Running!");
	});
