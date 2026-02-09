// TODO: Remove when fileUploadCardProps are provided by CMS. These defaults are temporary.

export const DEFAULT_FILE_UPLOAD_CARD_PROPS = {
  title: 'File Upload',
  fileInputAriaLabel: 'File upload input',
  dropzoneAriaLabel: 'Drop a file to search in bulk',
  dropzoneTitle: 'Drop your file here or click to browse',
  selectFileButtonLabel: 'Select file',
  downloadTemplateButtonLabel: 'Download template',
  removeButtonAriaLabel: 'Remove file',
  searchButtonLabel: 'Search',
  uploadingStatusText: 'Uploading...',
  getCompletedStatusText: (fileSize: number) =>
    `File ready (${(fileSize / 1024).toFixed(1)} KB)`,
  errorMessages: {
    unexpected: {
      title: 'Something went wrong',
      description: 'We could not process your file. Please try again.',
    },
    unsupported: {
      title: 'Unsupported file',
      description: 'Please upload a CSV file.',
    },
    unreadable: {
      title: 'File could not be read',
      description: 'The file may be corrupted or in an unsupported encoding.',
    },
    'invalid-structure': {
      title: 'Invalid file structure',
      description:
        'The CSV does not match the expected format. Use the template.',
    },
    empty: {
      title: 'Empty file',
      description: 'The file has no data. Add at least one row.',
    },
    'too-large': {
      title: 'File too large',
      description:
        'Please upload a file smaller than the maximum allowed size.',
    },
  },
} as const
