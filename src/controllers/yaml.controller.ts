// src/controllers/yaml.controller.ts
import { Context } from 'elysia';
import { parse } from 'yaml';
import { OpenAIService } from '../services/openai.service';
import type { Capability, ProcessedCapability } from '../types/yaml.types';

interface FileUpload {
  file: Blob & {
    name: string;
    type: string;
    size: number;
  };
}

export class YamlController {
  private openAIService: OpenAIService;

  constructor() {
    this.openAIService = new OpenAIService();
  }

  async processYaml(context: Context<{ body: FileUpload }>) {
    try {
      console.log('Received body:', context.body);
      
      if (!context.body?.file) {
        throw new Error('No file uploaded');
      }

      // Log file details
      console.log('File details:', {
        name: context.body.file.name,
        type: context.body.file.type,
        size: context.body.file.size
      });

      // Read file contents
      const file = context.body.file;
      const content = await new Response(file).text();
      
      console.log('Raw YAML content:', content);
      
      if (!content) {
        throw new Error('Empty file content');
      }

      // Parse YAML content
      const parsedYaml = parse(content);
      console.log('Parsed YAML:', JSON.stringify(parsedYaml, null, 2));
      
      if (!parsedYaml || typeof parsedYaml !== 'object') {
        throw new Error('Invalid YAML format');
      }

      const capability = parsedYaml as Capability;
      
      if (!capability.description) {
        throw new Error('YAML is missing required description field');
      }
      
      // Generate embedding for the capability description
      const embedding = await this.openAIService.generateEmbedding(capability.description);
      
      // Create processed capability with embedding
      const processedCapability: ProcessedCapability = {
        ...capability,
        embedding
      };

      return {
        message: 'Capability processed successfully',
        capability: {
          id: processedCapability.id,
          type: processedCapability.type,
          description: processedCapability.description,
          embedding: processedCapability.embedding,
          version: processedCapability.version,
          inputs: Object.keys(processedCapability.inputs),
          tasks: processedCapability.tasks.map(task => task.id)
        }
      };
    } catch (error: unknown) {
      console.error('Error processing YAML:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
        throw new Error(`Failed to process capability YAML file: ${error.message}`);
      }
      throw new Error('Failed to process capability YAML file');
    }
  }
}