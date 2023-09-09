import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Noot Docs</span>,
  project: {
    link: 'https://github.com/noot-oss/noot',
  },
  chat: {
    link: 'https://discord.gg/fbU9WK23tw',
  },
  docsRepositoryBase: 'https://github.com/noot-oss/noot/docs-web',
  footer: {
    text: 'MIT 2023 © Noot-OSS, Made with love by the Noot team.',
  },
}

export default config
