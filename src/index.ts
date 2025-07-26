import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'

import { version } from '../package.json'

async function textfetch(url: string, arg?: RequestInit) {
  const res = await fetch(url, arg)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`)
  }
  return res.text()
}
export default class XenBaseViewerPlugin extends Plugin {
  name = 'XenBaseViewerPlugin'
  version = version

  install(pluginManager: PluginManager) {
    ;(async () => {
      const res = await textfetch(
        'https://jbrowse.org/demos/xenbase/Xenbase_07.10.2025_orthos-gene-info.tsv.tsv',
      )
      const cols = [
        'umbrella_gene',
        'XTR_XB-GENE',
        'XTR_symbol',
        'XTR_NCBI',
        'XTR_model',
        'XTR_coordinates',
        'XLAL_XB-GENE',
        'XLAL_symbol',
        'XLAL_NCBI',
        'XLAL_model',
        'XLA_coordinates',
        'XLAS_XB-GENE',
        'XLAS_symbol',
        'XLAS_NCBI',
        'XTR_model',
        'XLAS_coordinates',
        'Human_ortho_NCBI',
        'Human_ortho_symbol',
        'HSA_coordinates',
        'Mouse_ortho_NCBI',
        'Mouse_ortho_symbol',
        'Rat_ortho_NCBI',
        'Rat_ortho_symbol',
        'Fish_ortho_NCBI',
        'Fish_ortho_symbol',
        'Chicken_ortho_NCBI',
        'Chicken_ortho_symbol',
        'Fly_ortho_NCBI',
        'Fly_ortho_symbol',
        'Worm_ortho_NCBI',
        'Worm_ortho_symbol',
      ]
      const rows = res.split('\n').map(r => {
        return Object.fromEntries(
          r.split('\t').map((elt, idx) => [cols[idx], elt]),
        )
      })
      console.log(rows)
    })()
  }

  configure(_pluginManager: PluginManager) {}
}
