import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Better Calendar',
  slug: 'better-calendar',
  extra: {
    eas: {
      projectId: 'b553bfae-29d3-4b91-86c4-18ea8b1a4cf9',
    },
  },
})
