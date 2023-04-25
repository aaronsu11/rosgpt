import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  GOOGLE_SEARCH = 'google-search',
  ROS_DOC_SEARCH = 'ros-doc-search',
}

export enum PluginName {
  GOOGLE_SEARCH = 'Google Search',
  ROS_DOC_SEARCH = 'ROS Doc Search',
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.GOOGLE_SEARCH]: {
    id: PluginID.GOOGLE_SEARCH,
    name: PluginName.GOOGLE_SEARCH,
    requiredKeys: [
      {
        key: 'GOOGLE_API_KEY',
        value: '',
      },
      {
        key: 'GOOGLE_CSE_ID',
        value: '',
      },
    ],
  },
  [PluginID.ROS_DOC_SEARCH]: {
    id: PluginID.ROS_DOC_SEARCH,
    name: PluginName.ROS_DOC_SEARCH,
    requiredKeys: [
      {
        key: 'PINECONE_API_KEY',
        value: '',
      },
      {
        key: 'PINECONE_INDEX_NAME',
        value: '',
      },
      {
        key: 'PINECONE_ENVIRONMENT',
        value: '',
      },
    ],
  },
};

export const PluginList = Object.values(Plugins);
