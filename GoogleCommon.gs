/**
 * スプレッドシートの操作
 */

/**
 * スプレッドシートへの情報出力
 *
 * @param value 出力値
 * @param sheetName 出力対象のシート名
 * @param startRow 出力開始行
 * @param startCol 出力開始列
 * @param url 出力するスプレッドシートのurl
 * @return {void}
 */
function outputSpread(value, sheetName, startRow, startCol, url='') {

  // urlが空の場合は本スプレッドシート、空でない場合は指定されたurlのスプレッドシート情報を取得
  const spread = (url) ? SpreadsheetApp.openByUrl(url) : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = spread.getSheetByName(sheetName);

  if(value.length != 0) {
    sheet.getRange(startRow, startCol, value.length, value[0].length).setValues(value);
  }
}

/**
 * スプレッドシート情報の取得
 *
 * @param alertName エラーの際に出力する名前
 * @param sheetName 取得対象のシート名
 * @param startRow 取得開始行
 * @param endCol 取得終了列(0を指定すると自動で列数を検知する)
 * @param url 取得するスプレッドシートのurl
 * @return {[][]}取得したデータ
 */
function inputSpread(alertName, sheetName, startRow, endCol, url='') {
  // urlが空の場合は本スプレッドシート、空でない場合は指定されたurlのスプレッドシート情報を取得
  const spread = (url) ? SpreadsheetApp.openByUrl(url) : SpreadsheetApp.getActiveSpreadsheet();

  // シート情報を取得
  const sheet = spread.getSheetByName(sheetName);

  // 取得開始行からの取得データの行数を設定
  const rowCount = (startRow == 1) ? sheet.getLastRow() : sheet.getLastRow()-startRow+1;
  if(!rowCount) {
    throw new Error(`${alertName}を記入してください。`)
  } 

  // endColが0の場合は最終列を自動で検知する。
  const colCount = (endCol) ? endCol : sheet.getLastColumn();

  return sheet.getRange(startRow, 1, rowCount, colCount).getValues();
}

/**
 * ドキュメント操作
 */

/**
 * ドキュメントのコピー
 *
 * @param sampleFileId サンプルファイルのID
 * @param folderId 出力先フォルダID
 * @return {string}コピーしたファイルのurl
 */
function docCopy(sampleFileId, folderId) {
  // サンプルファイルのドキュメント情報を取得
  const doc = DriveApp.getFileById(sampleFileId);
  // 出力先フォルダ情報を取得
  const folder = DriveApp.getFolderById(folderId);
  // 出力先フォルダにサンプルファイルをコピー
  const newfile = doc.makeCopy(doc.getName().replace("ひな形",""), folder);

  return newfile.getUrl()
}

/**
 * ドキュメントのデータを取得
 *
 * @param url ドキュメントのurl
 * @return {object}ドキュメントのデータ
 */
function openDoc(url){
  const basedoc = DocumentApp.openByUrl(url);
  return basedoc.getBody()
}

/**
 * その他操作
 */

/**
 * 新規フォルダの作成
 *
 * @param name フォルダ名
 * @return {string}フォルダID
 */
function createFolder(folderName) {
  // 新規作成したフォルダの情報を取得
  const folder = DriveApp.getFolderById(outputInfo.rootFolderId).createFolder(folderName);

  return folder.getId()
}