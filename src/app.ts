import { Elysia } from 'elysia';
import { userRoutes } from './routes/user.routes';
import { yamlRoutes } from './routes/yaml.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = new Elysia()
    .use(errorHandler)
    .decorate('parseJson', true)
    .group('/api', app => app
        .use(userRoutes)
        .use(yamlRoutes)
    )
    .get('/health', () => ({ status: 'ok' }));

export default app;