import { Plugin } from './plugin';
import { IPlugin, IPluginFormFields } from './plugin.interface';

export class KuberoPostgresqlGroundhog2k extends Plugin implements IPlugin {
  public id: string = 'kubero-operator';
  public displayName = 'PostgreSQL (Official)';
  public description =
    'PostgreSQL (Postgres) is an open source object-relational database known for reliability and data integrity. Uses official PostgreSQL images from Docker Hub.';
  public icon = '/img/addons/pgsql.svg';
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
    'KuberoPostgresqlGroundhog2k.metadata.name': {
      type: 'text',
      label: 'PostgreSQL Instance Name',
      name: 'metadata.name',
      required: true,
      default: 'postgres',
      description: 'The name of the PostgreSQL instance',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.image.tag': {
      type: 'combobox',
      label: 'Version/Tag',
      options: ['13', '14', '15', '16', '17', 'latest'],
      name: 'spec.postgres.image.tag',
      required: true,
      default: '17',
      description: 'Version of the PostgreSQL image to use',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.image.repository': {
      type: 'text',
      label: 'Image Repository',
      name: 'spec.postgres.image.repository',
      required: true,
      default: 'postgres',
      description: 'Docker image repository (e.g., postgres)',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.replicaCount': {
      type: 'number',
      label: 'Replica Count',
      name: 'spec.postgres.replicaCount',
      required: true,
      default: 1,
      description: 'Number of PostgreSQL replicas',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.auth.enablePostgresUser': {
      type: 'switch',
      label: 'Enable Postgres User',
      name: 'spec.postgres.auth.enablePostgresUser',
      required: false,
      default: true,
      description: 'Enable the default postgres user',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.auth.postgresPassword': {
      type: 'text',
      label: 'Postgres Password',
      name: 'spec.postgres.auth.postgresPassword',
      required: false,
      default: '',
      description: 'Password for the default postgres user',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.auth.username': {
      type: 'text',
      label: 'Additional Username',
      name: 'spec.postgres.auth.username',
      required: false,
      default: '',
      description: 'Username for an additional user to create',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.auth.password': {
      type: 'text',
      label: 'Additional User Password',
      name: 'spec.postgres.auth.password',
      required: false,
      default: '',
      description: 'Password for an additional user to create',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.auth.database': {
      type: 'text',
      label: 'Database Name',
      name: 'spec.postgres.auth.database',
      required: false,
      default: '',
      description: 'Name for a custom database to create',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.persistence.storageClass': {
      type: 'select-storageclass',
      label: 'Storage Class',
      name: 'spec.postgres.persistence.storageClass',
      required: false,
      default: 'default',
      description: 'Kubernetes StorageClass to use',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.persistence.size': {
      type: 'text',
      label: 'Storage Size',
      name: 'spec.postgres.persistence.size',
      required: false,
      default: '8Gi',
      description: 'Size of the storage',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.persistence.accessModes[0]': {
      type: 'text',
      label: 'Access Modes',
      name: 'spec.postgres.persistence.accessModes[0]',
      required: false,
      default: 'ReadWriteOnce',
      description: 'Access modes for the persistent volume',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.resources.limits.cpu': {
      type: 'text',
      label: 'CPU Limit',
      name: 'spec.postgres.resources.limits.cpu',
      default: '500m',
      required: false,
      description: 'CPU resource limit',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.resources.limits.memory': {
      type: 'text',
      label: 'Memory Limit',
      name: 'spec.postgres.resources.limits.memory',
      default: '512Mi',
      required: false,
      description: 'Memory resource limit',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.resources.requests.cpu': {
      type: 'text',
      label: 'CPU Request',
      name: 'spec.postgres.resources.requests.cpu',
      default: '250m',
      required: false,
      description: 'CPU resource request',
    },
    'KuberoPostgresqlGroundhog2k.spec.postgres.resources.requests.memory': {
      type: 'text',
      label: 'Memory Request',
      name: 'spec.postgres.resources.requests.memory',
      default: '256Mi',
      required: false,
      description: 'Memory resource request',
    },
  };

  public env: any[] = [];

  public resourceDefinitions: object = {
    KuberoPostgresqlGroundhog2k: {
      apiVersion: 'application.kubero.dev/v1alpha1',
      kind: 'KuberoPostgresqlGroundhog2k',
      metadata: {
        name: 'postgres',
      },
      spec: {
        postgres: {
          image: {
            repository: 'postgres',
            tag: '17',
          },
          replicaCount: 1,
          auth: {
            enablePostgresUser: true,
            postgresPassword: '',
            username: '',
            password: '',
            database: '',
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
            size: '8Gi',
            accessModes: ['ReadWriteOnce'],
          },
        },
      },
    },
  };

  protected additionalResourceDefinitions: object = {
    postgresSecret: {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: 'postgres-secret',
        annotations: {
          'meta.helm.sh/release-name': 'postgres',
          'meta.helm.sh/release-namespace': 'kubero-dev',
        },
        labels: {
          'app.kubernetes.io/managed-by': 'Kubero',
        },
      },
      type: 'Opaque',
      stringData: {
        'postgres-password': '',
        password: '',
        user: '',
      },
    },
  };

  constructor(availableOperators: any) {
    super();
    super.init(availableOperators);
  }
}
