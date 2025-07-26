;(function () {
  class DbxrefPlugin {
    install() {}
    configure(pluginManager) {
      pluginManager.jexl.addFunction('linkout', feature => {
        // no dbxref found, so return empty string
        if (!feature.dbxref) {
          return ''
        }
        const dbxrefs = Array.isArray(feature.dbxref)
          ? feature.dbxref
          : [feature.dbxref]
        return dbxrefs.map(dbxref => {
          // customized link for Genbank dbxref
          if (dbxref.startsWith('Genbank:')) {
            const ref = dbxref.replace('Genbank:', '')
            return `<a href="https://www.ncbi.nlm.nih.gov/nuccore/${ref}" target="_new">Genbank:${ref}</a>`
          }
          // customized link for Entrez dbxref
          else if (dbxref.startsWith('GeneID:')) {
            const ref = dbxref.replace('GeneID:', '')
            return `<a href="https://www.ncbi.nlm.nih.gov/gene/?term=${ref}" target="_new">Entrez Gene:${ref}</a>`
          }
          // customized link for Xenbase genepage link
          else if (dbxref.startsWith('Xenbase:')) {
            const ref = dbxref.replace('Xenbase:', '')
            return `<a href="http://www.xenbase.org/gene/showgene.do?method=display&geneId=${ref}" target="_new">Xenbase genepage</a>`
          }
          // customized link for tropicalis ENSEMBL gene dbxref
          else if (dbxref.startsWith('Ensembl:ENSXETG')) {
            const ref = dbxref.replace('Ensembl:', '')
            return `<a href="https://useast.ensembl.org/Xenopus_tropicalis/Gene/Summary?db=core;g=${ref}" target="_new">ENSEMBL</a>`
            //return `<a href="https://rapid.ensembl.org/Xenopus_tropicalis/Gene/Summary?db=core;g=${ref}" target="_new">ENSEMBL</a>`
          }
          // customized link for human ENSEMBL transcript dbxref
          else if (dbxref.startsWith('Ensembl:ENST')) {
            const ref = dbxref.replace('Ensembl:', '')
            return `<a href="https://useast.ensembl.org/Homo_Sapiens/Gene/Summary?db=core;t=${ref}" target="_new">ENSEMBL</a>`
          }          
          // customized link for RFAM dbxref
          else if (dbxref.startsWith('RFAM:')) {
            const ref = dbxref.replace('RFAM:', '')
            return `<a href="https://rfam.xfam.org/family/=${ref}" target="_new">RFAM</a>`
          }
          // customized link for GeneID dbxref
          else if (dbxref.startsWith('PubMed:')) {
            const ref = dbxref.replace('PubMed:', '')
            return `<a href="https://www.ncbi.nlm.nih.gov/pubmed/${ref}" target="_new">PubMed</a>`
          }
          // customized link for miRBase dbxref
          else if (dbxref.startsWith('miRBase:')) {
            const ref = dbxref.replace('miRBase:', '')
            return `<a href="http://mirbase.org/cgi-bin/mirna_entry.pl?acc=${ref}" target="_new">miRBase</a>`
          }
          // customized link for OMIM dbxref
          else if (dbxref.startsWith('MIM:')) {
            const ref = dbxref.replace('MIM:', '')
            return `<a href="https://omim.org/entry/${ref}" target="_new">OMIM</a>`
          }
          // customized link for HGNC dbxref
          else if (dbxref.startsWith('HGNC:')) {
            const ref = dbxref.replace('HGNC:', '')
            return `<a href="https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${ref}" target="_new">HGNC</a>`
          }
          
          
          // no link, just plaintext returned
          return dbxref
        })
      })
    }
  }

  // the plugin will be included in both the main thread and web worker, so
  // install plugin to either window or self (webworker global scope)
  ;(typeof self !== 'undefined' ? self : window).JBrowsePluginDbxrefPlugin = {
    default: DbxrefPlugin,
  }
})()