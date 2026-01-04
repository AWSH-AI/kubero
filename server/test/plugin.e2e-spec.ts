import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { Plugin } from '../src/addons/plugins/plugin';

class TestPlugin extends Plugin {
  constructor() {
    super();
    this.id = 'integration-test-plugin';
    this.kind = 'TestPlugin';
    this.artifact_url = 'https://example.com/artifact';
  }
}

describe('Plugin Integration (e2e)', () => {
  let moduleRef: TestingModule;
  let plugin: TestPlugin;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        TestPlugin,
        Logger,
      ],
    }).compile();

    plugin = moduleRef.get<TestPlugin>(TestPlugin);
  });

  it('should initialize without crashing on invalid data', async () => {
    const invalidData = [
      {
        spec: { names: { kind: 'TestPlugin' }, version: '1.0.0' },
        metadata: {
          annotations: {
            'alm-examples': 'INVALID JSON }',
          },
        },
      },
    ];

    await plugin.init(invalidData);
    
    expect(plugin).toBeDefined();
    // Verify that despite the error, the plugin object remains valid
    expect(plugin.enabled).toBe(true); 
  });
});
