export default function getCookieByName(cookiename: string, source: string) {
  var cookiestring = RegExp(cookiename + '=[^;]+').exec(source)
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : ''
  )
}
