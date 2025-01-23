import { Elysia, t } from 'elysia';
import { YamlController } from '../controllers/yaml.controller';

const yamlController = new YamlController();

export const yamlRoutes = new Elysia({ prefix: '/yaml' })
  .post('/process', 
    (context) => yamlController.processYaml(context),
    {
      body: t.Object({
        file: t.File({
          type: ['text/yaml', 'application/x-yaml', 'text/plain']
        })
      })
    }
  );