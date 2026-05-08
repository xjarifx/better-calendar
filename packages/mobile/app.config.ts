import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Better Calendar',
  slug: 'better-calendar',
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'your-eas-project-id',
    },
  },
})
