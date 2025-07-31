import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, LoadingEllipses } from '@jbrowse/core/ui'
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from '@mui/material'
import { textfetch } from './util'
import { dedupe } from '@jbrowse/core/util'

function makeId(configuration: string) {
  return {
    type: 'SyntenyTrack',
    configuration,
    displays: [
      {
        type: 'LinearSyntenyDisplay',
        configuration: `${configuration}-LinearSyntenyDisplay`,
      },
    ],
  }
}

type COLS =
  | 'umbrella_gene'
  | 'XTR_XB-GENE'
  | 'XTR_symbol'
  | 'XTR_NCBI'
  | 'XTR_model'
  | 'XTR_coordinates'
  | 'XLAL_XB-GENE'
  | 'XLAL_symbol'
  | 'XLAL_NCBI'
  | 'XLAL_model'
  | 'XLA_coordinates'
  | 'XLAS_XB-GENE'
  | 'XLAS_symbol'
  | 'XLAS_NCBI'
  | 'XTR_model'
  | 'XLAS_coordinates'
  | 'Human_ortho_NCBI'
  | 'Human_ortho_symbol'
  | 'HSA_coordinates'
  | 'Mouse_ortho_NCBI'
  | 'Mouse_ortho_symbol'
  | 'Rat_ortho_NCBI'
  | 'Rat_ortho_symbol'
  | 'Fish_ortho_NCBI'
  | 'Fish_ortho_symbol'
  | 'Chicken_ortho_NCBI'
  | 'Chicken_ortho_symbol'
  | 'Fly_ortho_NCBI'
  | 'Fly_ortho_symbol'
  | 'Worm_ortho_NCBI'
  | 'Worm_ortho_symbol'

type Row = Record<COLS, string>
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

export default function MyDialog({
  session,
  handleClose,
}: {
  session: any
  handleClose: () => void
}) {
  const [rows, setRows] = useState<Row[]>()
  const [selectedGene, setSelectedGene] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  useEffect(() => {
    ;(async () => {
      const res = await textfetch(
        'https://jbrowse.org/demos/xenbase/Xenbase_07.10.2025_orthos-gene-info.tsv.tsv',
      )

      const rows = res
        .split('\n')
        .slice(1)
        .map(r =>
          Object.fromEntries(r.split('\t').map((elt, idx) => [cols[idx], elt])),
        )
      setRows(rows)
    })()
  }, [])

  const allOptions = useMemo(() => {
    return rows
      ? [
          ...dedupe(rows, row => row.XLAL_symbol)
            .map(r => ({
              ...r,
              label: r.Human_ortho_symbol,
            }))
            .filter(f => !!f.label),
          ...dedupe(rows, row => row.XTR_symbol).map(r => ({
            ...r,
            label: r.XTR_symbol,
          })),
          ...dedupe(rows, row => row.XTR_symbol).map(r => ({
            ...r,
            label: r.XLAL_symbol,
          })),
          ...dedupe(rows, row => row.XTR_symbol).map(r => ({
            ...r,
            label: r.XLAS_symbol,
          })),
        ].filter(f => !!f.label)
      : []
  }, [rows])

  const filteredOptions = useMemo(() => {
    if (!inputValue || inputValue.length < 1) {
      return allOptions.slice(0, 100)
    }
    const searchTerm = inputValue.toLowerCase()
    return allOptions
      .filter(option => option.label.toLowerCase().includes(searchTerm))
      .slice(0, 100)
  }, [allOptions, inputValue])

  const selectedValue = useMemo(() => {
    return allOptions.find(v => v.label === selectedGene) || null
  }, [allOptions, selectedGene])
  return (
    <Dialog
      onClose={handleClose}
      maxWidth="xl"
      title="Open in synteny view"
      open
    >
      <DialogContent>
        {rows ? (
          <div>
            <Typography>
              Select a gene symbol to create a synteny view for X. laevis (S and
              L subgenomes), X. tropicalis, and Hg38:
            </Typography>
            <Autocomplete
              options={filteredOptions}
              value={selectedValue}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
              onChange={(_, newValue) => setSelectedGene(newValue?.label || '')}
              sx={{ width: 300 }}
              ListboxProps={{
                style: {
                  maxHeight: '200px',
                },
              }}
              renderInput={params => (
                <TextField {...params} variant="outlined" label="Gene symbol" />
              )}
            />
            {selectedValue ? (
              <div>
                <ul>
                  <li>
                    X.laevis L coord: {selectedValue?.XLA_coordinates || 'N/A'}
                  </li>
                  <li>
                    X.laevis L symbol: {selectedValue?.XLAL_symbol || 'N/A'}
                  </li>
                  <li>
                    X.laevis S coord: {selectedValue?.XLAS_coordinates || 'N/A'}
                  </li>
                  <li>
                    X.laevis S symbol: {selectedValue?.XLAS_symbol || 'N/A'}
                  </li>
                  <li>
                    X.tropicalis coord:{' '}
                    {selectedValue?.XTR_coordinates || 'N/A'}
                  </li>
                  <li>
                    X.tropicalis symbol: {selectedValue?.XTR_symbol || 'N/A'}
                  </li>
                  <li>Hg38 coord: {selectedValue?.HSA_coordinates || 'N/A'}</li>
                  <li>
                    Hg38 symbol: {selectedValue?.Human_ortho_symbol || 'N/A'}
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <LoadingEllipses />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            handleClose()
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            session.addView('LinearSyntenyView', {
              type: 'LinearSyntenyView',
              views: [
                selectedValue?.HSA_coordinates
                  ? {
                      type: 'LinearGenomeView',
                      hideHeader: true,
                      init: {
                        assembly: 'HG38',
                        loc: selectedValue?.HSA_coordinates,
                        tracks: ['GCF_human_hg38_prim'],
                      },
                    }
                  : undefined,

                selectedValue?.XTR_coordinates
                  ? {
                      type: 'LinearGenomeView',
                      hideHeader: true,
                      init: {
                        assembly: 'XT10.0',
                        loc: selectedValue?.XTR_coordinates,
                        tracks: ['XT10_0_longest'],
                      },
                    }
                  : undefined,
                selectedValue?.XLA_coordinates
                  ? {
                      type: 'LinearGenomeView',
                      hideHeader: true,
                      init: {
                        assembly: 'XL10.1_L',
                        loc: selectedValue?.XLA_coordinates,
                        tracks: ['Xlaevisv10.17.sorted.gff3'],
                      },
                    }
                  : undefined,
                selectedValue?.XLAS_coordinates
                  ? {
                      type: 'LinearGenomeView',
                      hideHeader: true,
                      init: {
                        assembly: 'XL10.1_S',
                        loc: selectedValue?.XLAS_coordinates,
                        tracks: ['Xlaevisv10.17.sorted.gff3'],
                      },
                    }
                  : undefined,
              ].filter(f => !!f),
              levels: [
                {
                  level: 0,
                  tracks: [makeId('Human_vs_XTR_all_chrs')],
                },
                {
                  level: 1,
                  tracks: [makeId('XTR_XLAL_all_chrs')],
                },
                {
                  level: 2,
                  tracks: [makeId('XLAL_vs_XLAS_all_chrs')],
                },
              ],
            })
            handleClose()
          }}
          variant="contained"
        >
          Launch
        </Button>
      </DialogActions>
    </Dialog>
  )
}
