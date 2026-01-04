import { Plugin } from './plugin';
import { IPlugin, IPluginFormFields } from './plugin.interface';

export class KuberoRedisGroundhog2k extends Plugin implements IPlugin {
  public id: string = 'kubero-operator';
  public displayName = 'Redis (Official)';
  public description =
    'Redis is an open source, in-memory, key-value data store. Uses official Redis images from Docker Hub.';
  public icon = '/img/addons/redis.svg';
  public install: string = '';
  public url =
    'https://artifacthub.io/packages/olm/community-operators/kubero-operator';
  public docs = [
    {
      title: 'Kubero Docs',
      url: '',
    },
  ];
  public artifact_url =
    'https://artifacthub.io/api/v1/packages/olm/kubero/kubero-operator';
  public beta: boolean = false;
  public deprecated: boolean = false;

  public formfields: { [key: string]: IPluginFormFields } = {
    'KuberoRedisGroundhog2k.metadata.name': {
      type: 'text',
      label: 'Redis Instance Name',
      name: 'metadata.name',
      required: true,
      default: 'redis',
      description: 'The name of the Redis instance',
    },
    'KuberoRedisGroundhog2k.spec.redis.image.tag': {
      type: 'combobox',
      label: 'Version/Tag',
      options: ['6', '7', '7.2', 'latest'],
      name: 'spec.redis.image.tag',
      required: true,
      default: '7.2',
      description: 'Version of the Redis image to use',
    },
    'KuberoRedisGroundhog2k.spec.redis.image.repository': {
      type: 'text',
      label: 'Image Repository',
      name: 'spec.redis.image.repository',
      required: true,
      default: 'redis',
      description: 'Docker image repository (e.g., redis)',
    },
    'KuberoRedisGroundhog2k.spec.redis.auth.enabled': {
      type: 'switch',
      label: 'Enable Authentication',
      name: 'spec.redis.auth.enabled',
      required: false,
      default: true,
      description: 'Enable Redis password authentication',
    },
    'KuberoRedisGroundhog2k.spec.redis.auth.password': {
      type: 'text',
      label: 'Redis Password*',
      name: 'spec.redis.auth.password',
      default: '',
      required: true,
      description: 'Password for Redis authentication',
    },
    'KuberoRedisGroundhog2k.spec.redis.persistence.enabled': {
      type: 'switch',
      label: 'Enable Persistence',
      name: 'spec.redis.persistence.enabled',
      required: false,
      default: true,
      description: 'Enable Redis data persistence',
    },
    'KuberoRedisGroundhog2k.spec.redis.persistence.storageClass': {
      type: 'select-storageclass',
      label: 'Storage Class',
      name: 'spec.redis.persistence.storageClass',
      required: false,
      default: 'default',
      description: 'Kubernetes StorageClass to use',
    },
    'KuberoRedisGroundhog2k.spec.redis.persistence.size': {
      type: 'text',
      label: 'Storage Size',
      name: 'spec.redis.persistence.size',
      required: false,
      default: '1Gi',
      description: 'Size of the storage',
    },
    'KuberoRedisGroundhog2k.spec.redis.persistence.accessModes[0]': {
      type: 'text',
      label: 'Access Modes',
      name: 'spec.redis.persistence.accessModes[0]',
      required: false,
      default: 'ReadWriteOnce',
      description: 'Access modes for the persistent volume',
    },
    'KuberoRedisGroundhog2k.spec.redis.replicaCount': {
      type: 'number',
      label: 'Replica Count',
      name: 'spec.redis.replicaCount',
      required: true,
      default: 1,
      description: 'Number of Redis replicas',
    },
    'KuberoRedisGroundhog2k.spec.redis.resources.limits.cpu': {
      type: 'text',
      label: 'CPU Limit',
      name: 'spec.redis.resources.limits.cpu',
      default: '500m',
      required: false,
      description: 'CPU resource limit',
    },
    'KuberoRedisGroundhog2k.spec.redis.resources.limits.memory': {
      type: 'text',
      label: 'Memory Limit',
      name: 'spec.redis.resources.limits.memory',
      default: '512Mi',
      required: false,
      description: 'Memory resource limit',
    },
    'KuberoRedisGroundhog2k.spec.redis.resources.requests.cpu': {
      type: 'text',
      label: 'CPU Request',
      name: 'spec.redis.resources.requests.cpu',
      default: '250m',
      required: false,
      description: 'CPU resource request',
    },
    'KuberoRedisGroundhog2k.spec.redis.resources.requests.memory': {
      type: 'text',
      label: 'Memory Request',
      name: 'spec.redis.resources.requests.memory',
      default: '256Mi',
      required: false,
      description: 'Memory resource request',
    },
  };

  public env: any[] = [];

  public resourceDefinitions: object = {
    KuberoRedisGroundhog2k: {
      apiVersion: 'application.kubero.dev/v1alpha1',
      kind: 'KuberoRedisGroundhog2k',
      metadata: {
        name: 'redis',
      },
      spec: {
        redis: {
          image: {
            repository: 'redis',
            tag: '7.2',
          },
          replicaCount: 1,
          auth: {
            enabled: true,
            password: '',
          },
          resources: {
            limits: {
              cpu: '500m',
              memory: '512Mi',
            },
            requests: {
              cpu: '250m',
              memory: '256Mi',
            },
          },
          persistence: {
            enabled: true,
            storageClass: 'default',
            size: '1Gi',
            accessModes: ['ReadWriteOnce'],
          },
        },
      },
    },
  };

  protected additionalResourceDefinitions: object = {
    redisSecret: {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: 'redis-secret',
        annotations: {
          'meta.helm.sh/release-name': 'redis',
          'meta.helm.sh/release-namespace': 'kubero-dev',
        },
        labels: {
          'app.kubernetes.io/managed-by': 'Kubero',
        },
      },
      type: 'Opaque',
      stringData: {
        'redis-password': '',
      },
    },
  };

  constructor(availableOperators: any) {
    super();
    super.init(availableOperators);
  }
}
