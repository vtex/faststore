import {
  Icon as UIIcon,
  Dropzone as UIDropzone,
  SearchDropdown as UISearchDropdown,
  Button,
} from '@faststore/ui'

import styles from './section.module.scss'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 1
const ACCEPTED_FILE_TYPES = { 'text/csv': ['.csv'] }

export default function UploadFileDropdown() {
  const handleFilesAccepted = (files: File[]) => {
    console.log('Files accepted:', files)
    // TODO: Processar os arquivos aqui
  }

  return (
    <UISearchDropdown className={styles.section}>
      <UIDropzone
        selectFilesButton={
          <div data-fs-upload-button-container>
            <Button
              data-fs-upload-button
              type="button"
              variant="secondary"
              size="small"
            >
              Select File
            </Button>
          </div>
        }
        icon={<UIIcon name="ClipPlus" />}
        onFilesAccepted={handleFilesAccepted}
        onFilesRejected={(fileRejections) => {
          console.log('Files rejected:', fileRejections)
          // TODO: Tratar erros aqui
          const code = fileRejections[0]?.errors[0]?.code

          if (code === 'file-too-large') {
            alert('File is too large. Maximum size is 5MB.')
          } else if (code === 'file-invalid-type') {
            alert('Invalid file type. Please upload a CSV file.')
          }
        }}
        accept={ACCEPTED_FILE_TYPES}
        maxFiles={MAX_FILES}
        maxSize={MAX_FILE_SIZE}
        text="Drop a file to search in bulk"
        dragActiveText="Drop your file here!"
      />
    </UISearchDropdown>
  )
}
