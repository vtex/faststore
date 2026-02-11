import React, { useState } from 'react'
import {
  Button,
  Dropzone,
  Icon,
  Loader,
  SearchDropdown,
  UIProvider,
} from '@faststore/components'

export default {
  title: 'UploadFileDropdown',
  decorators: [
    (Story: React.ComponentType) => (
      <UIProvider>
        <Story />
      </UIProvider>
    ),
  ],
}

/**
 * These labels mirror the `UploadFileDropdownLabels` interface
 * from `@faststore/core`. They are duplicated here so the story
 * is self-contained (the storybook package doesn't depend on core).
 *
 * When integrating via CMS, pass the same shape to the
 * `uploadFileDropdownLabels` prop of `<SearchInput>`.
 */
interface UploadFileDropdownLabels {
  toastErrorTitle?: string
  toastRejectionTitle?: string
  toastRejectionDefaultMessage?: string
  toastFileTooLargeMessage?: string
  toastFileInvalidTypeMessage?: string
  toastTooManyFilesMessage?: string
  toastDownloadFailedTitle?: string
  toastDownloadFailedMessage?: string
  toastDownloadSuccessTitle?: string
  toastDownloadSuccessMessage?: string
  searchButtonLabel?: string
  selectFileButtonLabel?: string
  processingButtonLabel?: string
  downloadTemplateButtonLabel?: string
  dropzoneText?: string
  dropzoneAriaLabel?: string
  dropzoneDragActiveText?: string
  templateFileName?: string
  getCompletedStatusText?: (fileSize: string, totalRows: number) => string
}

const DEFAULT_LABELS: Required<UploadFileDropdownLabels> = {
  toastErrorTitle: 'File Upload Error',
  toastRejectionTitle: 'File Upload Error',
  toastRejectionDefaultMessage: 'Failed to upload file',
  toastFileTooLargeMessage: 'File is too large. Maximum size is 5MB.',
  toastFileInvalidTypeMessage: 'Invalid file type. Please upload a CSV file.',
  toastTooManyFilesMessage: 'Too many files. Please upload only one file.',
  toastDownloadFailedTitle: 'Download Failed',
  toastDownloadFailedMessage:
    'Failed to download template file. Please try again.',
  toastDownloadSuccessTitle: 'Template Downloaded',
  toastDownloadSuccessMessage: 'Template file has been downloaded successfully',
  searchButtonLabel: 'Search',
  selectFileButtonLabel: 'Select File',
  processingButtonLabel: 'Processing...',
  downloadTemplateButtonLabel: 'Download Template',
  dropzoneText: 'Drop a file to search in bulk',
  dropzoneAriaLabel: 'Drop a file to search in bulk',
  dropzoneDragActiveText: 'Drop a CSV file with SKU and Quantity columns',
  templateFileName: 'bulk-search-template.csv',
  getCompletedStatusText: (fileSize, totalRows) =>
    `Completed · ${fileSize} · ${totalRows} products found`,
}

// ── Helpers ──────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// ── Stories ──────────────────────────────────────────────────

/**
 * Default (English) labels – demonstrates the initial empty state
 * with the dropzone and download-template button.
 */
export function DefaultLabels() {
  const labels = { ...DEFAULT_LABELS }

  return (
    <div style={{ margin: 16, maxWidth: 500, position: 'relative' }}>
      <SearchDropdown>
        <div style={{ padding: 'var(--fs-spacing-3, 16px)' }}>
          <Dropzone
            selectFilesButton={
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="button" variant="secondary" size="small">
                  {labels.selectFileButtonLabel}
                </Button>
              </div>
            }
            icon={<Icon name="ClipPlus" />}
            onFilesAccepted={(files) => console.log('Files accepted:', files)}
            text={labels.dropzoneText}
            ariaLabel={labels.dropzoneAriaLabel}
            dragActiveText={labels.dropzoneDragActiveText}
          />
          <Button type="button" variant="tertiary" size="small">
            {labels.downloadTemplateButtonLabel}
          </Button>
        </div>
      </SearchDropdown>
    </div>
  )
}

/**
 * Custom labels (e.g. Portuguese) – shows how every string can
 * be overridden through the `labels` prop.
 */
export function CustomLabels() {
  const labels: Required<UploadFileDropdownLabels> = {
    ...DEFAULT_LABELS,
    toastErrorTitle: 'Erro no upload',
    toastRejectionTitle: 'Erro no upload',
    toastRejectionDefaultMessage: 'Falha ao enviar o arquivo',
    toastFileTooLargeMessage: 'O arquivo é muito grande. Tamanho máximo: 5 MB.',
    toastFileInvalidTypeMessage:
      'Tipo de arquivo inválido. Envie um arquivo CSV.',
    toastTooManyFilesMessage: 'Envie apenas um arquivo por vez.',
    toastDownloadFailedTitle: 'Falha no download',
    toastDownloadFailedMessage:
      'Não foi possível baixar o template. Tente novamente.',
    toastDownloadSuccessTitle: 'Template baixado',
    toastDownloadSuccessMessage: 'O template foi baixado com sucesso.',
    searchButtonLabel: 'Buscar',
    selectFileButtonLabel: 'Selecionar arquivo',
    processingButtonLabel: 'Processando...',
    downloadTemplateButtonLabel: 'Baixar template',
    dropzoneText: 'Arraste um arquivo para buscar em massa',
    dropzoneAriaLabel: 'Arraste um arquivo para buscar em massa',
    dropzoneDragActiveText: 'Solte o CSV com colunas SKU e Quantidade',
    templateFileName: 'template-busca-em-massa.csv',
    getCompletedStatusText: (fileSize, totalRows) =>
      `Concluído · ${fileSize} · ${totalRows} produtos encontrados`,
  }

  return (
    <div style={{ margin: 16, maxWidth: 500, position: 'relative' }}>
      <SearchDropdown>
        <div style={{ padding: 'var(--fs-spacing-3, 16px)' }}>
          <Dropzone
            selectFilesButton={
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="button" variant="secondary" size="small">
                  {labels.selectFileButtonLabel}
                </Button>
              </div>
            }
            icon={<Icon name="ClipPlus" />}
            onFilesAccepted={(files) => console.log('Files accepted:', files)}
            text={labels.dropzoneText}
            ariaLabel={labels.dropzoneAriaLabel}
            dragActiveText={labels.dropzoneDragActiveText}
          />
          <Button type="button" variant="tertiary" size="small">
            {labels.downloadTemplateButtonLabel}
          </Button>
        </div>
      </SearchDropdown>
    </div>
  )
}

/**
 * Completed state – shows the file-result view with the `searchButtonLabel`
 * and `getCompletedStatusText` labels in action.
 */
export function CompletedState() {
  const labels = { ...DEFAULT_LABELS }

  const fakeFile = { fileName: 'products.csv', fileSize: 2048, totalRows: 42 }

  return (
    <div style={{ margin: 16, maxWidth: 500, position: 'relative' }}>
      <SearchDropdown>
        <div style={{ padding: 'var(--fs-spacing-3, 16px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 8,
                border: '1px solid #e0e0e0',
                borderRadius: 4,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontWeight: 600 }}>
                  {fakeFile.fileName}
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                  {labels.getCompletedStatusText(
                    formatFileSize(fakeFile.fileSize),
                    fakeFile.totalRows
                  )}
                </p>
              </div>
              <Button variant="tertiary" size="small">
                <Icon name="X" />
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="small" style={{ width: '100%' }}>
                {labels.searchButtonLabel}
              </Button>
            </div>
          </div>
        </div>
      </SearchDropdown>
    </div>
  )
}

/**
 * Processing state – shows the processing button label.
 */
export function ProcessingState() {
  const labels = { ...DEFAULT_LABELS }

  return (
    <div style={{ margin: 16, maxWidth: 500, position: 'relative' }}>
      <SearchDropdown>
        <div style={{ padding: 'var(--fs-spacing-3, 16px)' }}>
          <Dropzone
            selectFilesButton={
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="button" variant="secondary" size="small" disabled>
                  {labels.processingButtonLabel}
                </Button>
              </div>
            }
            icon={<Icon name="ClipPlus" />}
            disabled
            text={labels.dropzoneText}
            ariaLabel={labels.dropzoneAriaLabel}
            dragActiveText={labels.dropzoneDragActiveText}
          />
          <Button type="button" variant="tertiary" size="small" disabled>
            {labels.downloadTemplateButtonLabel}
          </Button>
        </div>
      </SearchDropdown>
    </div>
  )
}

/**
 * All configurable labels – reference table for CMS integration.
 * Each row shows the prop name, its default value, and a description.
 */
export function LabelReference() {
  const entries: Array<{
    prop: string
    defaultValue: string
    description: string
  }> = [
    {
      prop: 'toastErrorTitle',
      defaultValue: DEFAULT_LABELS.toastErrorTitle,
      description: 'Toast title when CSV parsing fails',
    },
    {
      prop: 'toastRejectionTitle',
      defaultValue: DEFAULT_LABELS.toastRejectionTitle,
      description: 'Toast title when a file is rejected',
    },
    {
      prop: 'toastRejectionDefaultMessage',
      defaultValue: DEFAULT_LABELS.toastRejectionDefaultMessage,
      description: 'Default rejection message',
    },
    {
      prop: 'toastFileTooLargeMessage',
      defaultValue: DEFAULT_LABELS.toastFileTooLargeMessage,
      description: 'Message when file exceeds size limit',
    },
    {
      prop: 'toastFileInvalidTypeMessage',
      defaultValue: DEFAULT_LABELS.toastFileInvalidTypeMessage,
      description: 'Message when file type is wrong',
    },
    {
      prop: 'toastTooManyFilesMessage',
      defaultValue: DEFAULT_LABELS.toastTooManyFilesMessage,
      description: 'Message when too many files are dropped',
    },
    {
      prop: 'toastDownloadFailedTitle',
      defaultValue: DEFAULT_LABELS.toastDownloadFailedTitle,
      description: 'Toast title when template download fails',
    },
    {
      prop: 'toastDownloadFailedMessage',
      defaultValue: DEFAULT_LABELS.toastDownloadFailedMessage,
      description: 'Toast message when template download fails',
    },
    {
      prop: 'toastDownloadSuccessTitle',
      defaultValue: DEFAULT_LABELS.toastDownloadSuccessTitle,
      description: 'Toast title on successful template download',
    },
    {
      prop: 'toastDownloadSuccessMessage',
      defaultValue: DEFAULT_LABELS.toastDownloadSuccessMessage,
      description: 'Toast message on successful template download',
    },
    {
      prop: 'searchButtonLabel',
      defaultValue: DEFAULT_LABELS.searchButtonLabel,
      description: 'Label for the search / use-data button',
    },
    {
      prop: 'selectFileButtonLabel',
      defaultValue: DEFAULT_LABELS.selectFileButtonLabel,
      description: 'Label for the select-file button',
    },
    {
      prop: 'processingButtonLabel',
      defaultValue: DEFAULT_LABELS.processingButtonLabel,
      description: 'Button label while processing a file',
    },
    {
      prop: 'downloadTemplateButtonLabel',
      defaultValue: DEFAULT_LABELS.downloadTemplateButtonLabel,
      description: 'Label for the download-template button',
    },
    {
      prop: 'dropzoneText',
      defaultValue: DEFAULT_LABELS.dropzoneText,
      description: 'Text inside the dropzone area',
    },
    {
      prop: 'dropzoneAriaLabel',
      defaultValue: DEFAULT_LABELS.dropzoneAriaLabel,
      description: 'Accessible label for the dropzone',
    },
    {
      prop: 'dropzoneDragActiveText',
      defaultValue: DEFAULT_LABELS.dropzoneDragActiveText,
      description: 'Text when dragging a file over the dropzone',
    },
    {
      prop: 'templateFileName',
      defaultValue: DEFAULT_LABELS.templateFileName,
      description: 'File name for the downloaded CSV template',
    },
    {
      prop: 'getCompletedStatusText',
      defaultValue: '(fileSize, totalRows) => `Completed · …`',
      description: 'Builds the completed status string',
    },
  ]

  return (
    <div style={{ margin: 16 }}>
      <h2 style={{ marginBottom: 8 }}>UploadFileDropdownLabels reference</h2>
      <p style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>
        Pass these via{' '}
        <code style={{ background: '#f4f4f4', padding: '2px 4px' }}>
          {'<SearchInput uploadFileDropdownLabels={…} />'}
        </code>{' '}
        or directly to{' '}
        <code style={{ background: '#f4f4f4', padding: '2px 4px' }}>
          {'<UploadFileDropdown labels={…} />'}
        </code>
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 13,
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>Prop</th>
            <th style={{ padding: '8px 12px' }}>Default</th>
            <th style={{ padding: '8px 12px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(({ prop, defaultValue, description }) => (
            <tr key={prop} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '6px 12px', fontFamily: 'monospace' }}>
                {prop}
              </td>
              <td
                style={{
                  padding: '6px 12px',
                  color: '#555',
                  maxWidth: 300,
                  wordBreak: 'break-word',
                }}
              >
                {defaultValue}
              </td>
              <td style={{ padding: '6px 12px' }}>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
