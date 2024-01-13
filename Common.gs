/**
 * リスト内のデータをすべてString型に変換する。
 *
 * @param list String型に変換するリスト
 * @return {string[]}String型に変換後のリスト
 */
function toStringAll(list) {
  return list.map(rec => {
    return rec.map(data => {
      // データの型を取得
      const type = Object.prototype.toString.call(data)
      // 数値、日付をString型に変換
      if(type == '[object Date]') {
        return Utilities.formatDate(data, 'JST', 'yyyy/MM/dd')
      } else if(type == '[object Number]') {
        return data.toLocaleString()
      } else {
        return data
      }
    })
  })
}

/**
 * 画像の高さの取得
 *
 * @param imageUrl 画像のURL
 * @param width 画像の横幅
 * @return {number}画像の長さ
 */
function getImageHight(imageUrl, width) {
  const response = UrlFetchApp.fetch(imageUrl)
  const img = ImgApp.getSize(response.getBlob())

  return (width*img.height)/img.width
}