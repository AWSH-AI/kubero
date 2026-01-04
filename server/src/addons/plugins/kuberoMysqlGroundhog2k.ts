import { Plugin } from './plugin';
import { IPlugin, IPluginFormFields } from './plugin.interface';

export class KuberoMysqlGroundhog2k extends Plugin implements IPlugin {
  public id: string = 'kubero-operator';
  public displayName = 'MySQL (Official)';
  public description =
    'MySQL is a fast, reliable, scalable, and easy to use open source relational database system. Uses official MySQL images from Docker Hub.';
  public icon = '/img/addons/mysql.svg';
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
    'KuberoMysqlGroundhog2k.metadata.name': {
      type: 'text',
      label: 'MySQL Instance Name',
      name: 'metadata.name',
      required: true,
      default: 'mysql',
      description: 'The name of the MySQL instance',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.image.tag': {
      type: 'combobox',
      label: 'Version/Tag',
      options: ['8.0', '8.1', '8.4', 'latest'],
      name: 'spec.mysql.image.tag',
      required: true,
      default: '8.4',
      description: 'Version of the MySQL image to use',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.image.repository': {
      type: 'text',
      label: 'Image Repository',
      name: 'spec.mysql.image.repository',
      required: true,
      default: 'mysql',
      description: 'Docker image repository (e.g., mysql)',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.settings.rootPassword.value': {
      type: 'text',
      label: 'MySQL Root Password*',
      name: 'spec.mysql.settings.rootPassword.value',
      default: '',
      required: true,
      description: 'Password for the root user',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.userDatabase.user.value': {
      type: 'text',
      label: 'Username*',
      name: 'spec.mysql.userDatabase.user.value',
      default: '',
      required: true,
      description: 'Username for an additional user to create',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.userDatabase.password.value': {
      type: 'text',
      label: 'User Password*',
      name: 'spec.mysql.userDatabase.password.value',
      default: '',
      required: true,
      description: 'Password for an additional user to create',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.userDatabase.name.value': {
      type: 'text',
      label: 'Database*',
      name: 'spec.mysql.userDatabase.name.value',
      default: 'my_database',
      required: true,
      description: 'Name for a custom database to create',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.storage.className': {
      type: 'select-storageclass',
      label: 'Storage Class',
      name: 'spec.mysql.storage.className',
      default: 'default',
      required: true,
    },
    'KuberoMysqlGroundhog2k.spec.mysql.storage.requestedSize': {
      type: 'text',
      label: 'Storage Size*',
      name: 'spec.mysql.storage.requestedSize',
      default: '1Gi',
      required: true,
      description: 'Size of the storage',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.replicaCount': {
      type: 'number',
      label: 'Replica Count',
      name: 'spec.mysql.replicaCount',
      required: true,
      default: 1,
      description: 'Number of MySQL replicas',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.resources.limits.cpu': {
      type: 'text',
      label: 'CPU Limit',
      name: 'spec.mysql.resources.limits.cpu',
      default: '500m',
      required: false,
      description: 'CPU resource limit',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.resources.limits.memory': {
      type: 'text',
      label: 'Memory Limit',
      name: 'spec.mysql.resources.limits.memory',
      default: '512Mi',
      required: false,
      description: 'Memory resource limit',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.resources.requests.cpu': {
      type: 'text',
      label: 'CPU Request',
      name: 'spec.mysql.resources.requests.cpu',
      default: '250m',
      required: false,
      description: 'CPU resource request',
    },
    'KuberoMysqlGroundhog2k.spec.mysql.resources.requests.memory': {
      type: 'text',
      label: 'Memory Request',
      name: 'spec.mysql.resources.requests.memory',
      default: '256Mi',
      required: false,
      description: 'Memory resource request',
    },
  };

  public env: any[] = [];

  public resourceDefinitions: object = {
    KuberoMysqlGroundhog2k: {
      apiVersion: 'application.kubero.dev/v1alpha1',
      kind: 'KuberoMysqlGroundhog2k',
      metadata: {
        name: 'mysql',
      },
      spec: {
        mysql: {
          image: {
            repository: 'mysql',
            tag: '8.4',
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
          useDeployment: true,
          replicaCount: 1,
          settings: {
            rootPassword: {
              value: '',
            },
          },
          userDatabase: {
            name: {
              value: 'kubero_database',
            },
            user: {
              value: 'kubero_user',
            },
            password: {
              value: '',
            },
          },
          storage: {
            volumeName: 'mysql-data',
            requestedSize: '1Gi',
            className: 'default',
            accessModes: ['ReadWriteOnce'],
            keepPvc: false,
          },
        },
      },
    },
  };

  protected additionalResourceDefinitions: object = {
    mysqlSecret: {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: 'mysql-secret',
        annotations: {
          'meta.helm.sh/release-name': 'mysql',
          'meta.helm.sh/release-namespace': 'kubero-dev',
        },
        labels: {
          'app.kubernetes.io/managed-by': 'Kubero',
        },
      },
      type: 'Opaque',
      stringData: {
        'mysql-root-password': '',
        'mysql-user': '',
        'mysql-password': '',
      },
    },
  };

  constructor(availableOperators: any) {
    super();
    super.init(availableOperators);
  }
}
