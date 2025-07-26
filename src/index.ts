import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'

import { version } from '../package.json'
import { isAbstractMenuManager } from '@jbrowse/core/util'
import MyDialog from './Dialog'

export default class XenBaseViewerPlugin extends Plugin {
  name = 'XenBaseViewerPlugin'
  version = version

  install(_pluginManager: PluginManager) {}

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.insertMenu('XenBase', -1)
      pluginManager.rootModel.appendToMenu('XenBase', {
        label: 'Open orthologs in synteny view',
        onClick: session => {
          session.queueDialog((handleClose: () => void) => [
            MyDialog,
            {
              handleClose,
              session,
            },
          ])
        },
      })
    }
  }
}
