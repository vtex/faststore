import React from 'react'
import { Button, Dropzone, Icon, UIProvider } from '@faststore/components'

export default {
  title: 'Dropzone',
  decorators: [
    (Story: React.ComponentType) => (
      <UIProvider>
        <Story />
      </UIProvider>
    ),
  ],
}

export function Default() {
  return (
    <div style={{ margin: 16, maxWidth: 500 }}>
      <Dropzone
        text="Drag and drop files here, or click to select files"
        ariaLabel="File upload dropzone"
        dragActiveText="Drop the files here..."
        icon={<Icon name="ClipPlus" />}
        onFilesAccepted={(files) => console.log('Accepted:', files)}
        onFilesRejected={(rejections) => console.log('Rejected:', rejections)}
      />
    </div>
  )
}

export function WithSelectFileButton() {
  return (
    <div style={{ margin: 16, maxWidth: 500 }}>
      <Dropzone
        text="Drag and drop a CSV file, or use the button below"
        ariaLabel="Upload CSV file"
        dragActiveText="Release to upload your file"
        icon={<Icon name="ClipPlus" />}
        onFilesAccepted={(files) => console.log('Accepted:', files)}
        selectFilesButton={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="button" variant="secondary" size="small">
              Select File
            </Button>
          </div>
        }
      />
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ margin: 16, maxWidth: 500 }}>
      <Dropzone
        text="File upload is currently disabled"
        ariaLabel="File upload dropzone (disabled)"
        dragActiveText="Drop the files here..."
        icon={<Icon name="ClipPlus" />}
        disabled
      />
    </div>
  )
}

export function WithAcceptedTypes() {
  return (
    <div style={{ margin: 16, maxWidth: 500 }}>
      <Dropzone
        text="Only CSV files are accepted (max 5 MB)"
        ariaLabel="Upload CSV file"
        dragActiveText="Drop your CSV file here"
        icon={<Icon name="ClipPlus" />}
        accept={{ 'text/csv': ['.csv'] }}
        maxFiles={1}
        maxSize={5 * 1024 * 1024}
        multiple={false}
        onFilesAccepted={(files) => console.log('Accepted:', files)}
        onFilesRejected={(rejections) => console.log('Rejected:', rejections)}
      />
    </div>
  )
}

export function CustomLabelsPortuguese() {
  return (
    <div style={{ margin: 16, maxWidth: 500 }}>
      <Dropzone
        text="Arraste e solte arquivos aqui, ou clique para selecionar"
        ariaLabel="Área de upload de arquivos"
        dragActiveText="Solte os arquivos aqui..."
        icon={<Icon name="ClipPlus" />}
        onFilesAccepted={(files) => console.log('Aceitos:', files)}
        selectFilesButton={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="button" variant="secondary" size="small">
              Selecionar arquivo
            </Button>
          </div>
        }
      />
    </div>
  )
}
