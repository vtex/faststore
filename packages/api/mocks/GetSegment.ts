export const getSegmentFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/sessions',
  init: {
    body: '{}',
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  },
  result: {
    sessionToken:
      'eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ4RDU4NDM0QkJBNkRBNzdDNUFGMkZGRjJDODJCREJBOEEzQTJBMzkiLCJ0eXAiOiJqd3QifQ.eyJhY2NvdW50LmlkIjoiMDE3M2E5MzItMDZhOS00NDE4LWFhMTQtMTQyNmQxMGQyMTdhIiwiaWQiOiIxOTM3YjNjNC0wNjcxLTQwMDMtYjNlMS0zYzQ3OTM0OTczYTUiLCJ2ZXJzaW9uIjoyLCJzdWIiOiJzZXNzaW9uIiwiYWNjb3VudCI6InNlc3Npb24iLCJleHAiOjE2OTQ4MDY1ODEsImlhdCI6MTY5NDExNTM4MSwiaXNzIjoidG9rZW4tZW1pdHRlciIsImp0aSI6ImJjZmNiNzZlLTEyYzEtNGUxMS1hZGQzLTgyYzZjY2RkN2M2YyJ9.Tpe13N7-TJTEtLG-OjqF6goIzhdY13omS0IMZFhvDWHQB_SfRuyTBKvkUQpSmicEuJ1MlK5D0osocVL0gVca3A',
    segmentToken:
      'eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjpudWxsLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IlVTRCIsImN1cnJlbmN5U3ltYm9sIjoiJCIsImNvdW50cnlDb2RlIjoiVVNBIiwiY3VsdHVyZUluZm8iOiJlbi1VUyIsImNoYW5uZWxQcml2YWN5IjoicHVibGljIn0',
  },
}
