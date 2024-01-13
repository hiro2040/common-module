/**
 * LINE友だち関係
 */

/**
 * 全LINE友だちの取得
 *
 * @param chanelToken チャネルトークン
 * @return {string[]}LINE友だちIDのリスト
 */
function getAllUserId(chanelToken) {
  const params = {
    method: 'get',
    headers: {
      "Authorization": 'Bearer ' + chanelToken,
    }
  };

  // 1度のリクエストで全ユーザ情報を取得できなかった場合の次回リクエスト時の継続トークン
  let next = null
  let userList = []
  do {
    // nextが空の場合は継続トークン指定なし、空でない場合は継続トークン指定あり
    const url = (next) ? "https://api.line.me/v2/bot/followers/ids?start=" + next : "https://api.line.me/v2/bot/followers/ids";
    
    let response = JSON.parse(UrlFetchApp.fetch(url, params));
    next = response.next;
    userList.push(...response.userIds)

  } while (next);
  return userList
}

/**
 * LINE友だち情報の取得
 *
 * @param chanelToken チャネルトークン
 * @param userId ユーザID
 * @return {Object}指定したユーザIDの友だち情報
 */
function getUserInfoRequest(chanelToken, userId) {
  const params = {
    method: 'get',
    headers: {
      "Authorization": 'Bearer ' + chanelToken,
    }
  };

  const url = "https://api.line.me/v2/bot/profile/" + userId;
    
  return JSON.parse(UrlFetchApp.fetch(url, params));
}

/**
 * LINEメッセージ送信
 */

/**
 * メッセージの送信リクエスト（1ユーザ単位）
 *
 * @param chanelToken チャネルトークン
 * @param postData Messaging APIにリクエストするpostデータ
 * @return {void}
 */
function messageRequest(chanelToken, postData) {
  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": 'Bearer ' + chanelToken,
    },
    payload: JSON.stringify(postData)
  };

  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", params);
}

/**
 * マルチキャストメッセージの送信のリクエスト（複数ユーザ単位）
 *
 * @param chanelToken チャネルトークン
 * @param postData Messaging APIにリクエストするJsonファイル
 * @return {void}
 */
function multicastmessageRequest(chanelToken, postData) {
  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": 'Bearer ' + chanelToken,
    },
    payload: JSON.stringify(postData)
  };

  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/multicast", params);
}

/**
 * メッセージの送信（1ユーザ単位）
 *
 * @param chanelToken チャネルトークン
 * @param messageId メッセージID
 * @param userId ユーザID
 * @param altText 送信するメッセージの題名
 * @param message 送信するメッセージ
 * @return {void}
 */
function sendMessage(chanelToken, messageId, userId, altText, message) {
  const postData = {
    "to": userId,
    "messages": [{
      "type": "template",
      "altText": altText,
      "text": message
    }],
    "customAggregationUnits": [
        messageId
    ]
  }

  messageRequest(chanelToken, postData)
}

/**
 * メッセージの送信（複数ユーザ単位）
 *
 * @param chanelToken チャネルトークン
 * @param messageId メッセージID
 * @param userIdList ユーザIDのリスト
 * @param altText 送信するメッセージの題名
 * @param message 送信するメッセージ
 * @return {void}
 */
function sendMulticastMessage(chanelToken, messageId, userIdList, altText, message) {
  const postData = {
    "to": userIdList,
    "messages": [{
      "type": "template",
      "altText": altText,
      "text": message
    }],
    "customAggregationUnits": [
        messageId
    ]
  }

  multicastmessageRequest(chanelToken, postData)
}

/**
 * リッチメッセージの送信(1ユーザ単位)
 *
 * @param chanelToken チャネルトークン
 * @param messageId メッセージID
 * @param userId ユーザID
 * @param imageUrl 画像URL
 * @param altText 送信するメッセージの題名
 * @param linkUri 画像をクリックした時のURL
 * @return {void}
 */
function sendRichMessage(chanelToken, messageId, userId, imageUrl, altText, linkUri) {
  // 画像の横幅を1040pxとした時の横幅を取得
  const imageHight = Common.getImageHight(imageUrl, 1040);
  const postData = {
    // ユーザID
    "to": userId,
    'messages': [
      {
        "type": "imagemap",
        // 画像のURL
        "baseUrl": imageUrl,
        // 送信時に通知画面等に表示するメッセージ
        "altText": altText,
        // 画像のサイズ
        "baseSize": {
          "width": 1040,
          "height": imageHight
        },
        "actions": [
          {
            "type": "uri",
            // 画像クリック時の遷移先リンク
            "linkUri": linkUri,
            // 画像のクリック位置
            "area": {
              "x": 0,
              "y": 0,
              "width": 1040,
              "height": imageHight
            }
          },
        ]
      }
    ],
    "customAggregationUnits": [
        messageId
    ]
  }

  messageRequest(chanelToken, postData)
}

/**
 * リッチメッセージの送信(複数ユーザ単位)
 *
 * @param chanelToken チャネルトークン
 * @param messageId メッセージID
 * @param userIdList ユーザIDのリスト
 * @param imageUrl 画像URL
 * @param altText 送信するメッセージの題名
 * @param linkUri 画像をクリックした時のURL
 * @return {void}
 */
function sendMulticastRichMessage(chanelToken, messageId, userIdList, imageUrl, altText, linkUri) {
  // 画像の横幅を1040pxとした時の横幅を取得
  const imageHight = Common.getImageHight(imageUrl, 1040);
  const postData = {
    // ユーザID
    "to": userIdList,
    'messages': [
      {
        "type": "imagemap",
        // 画像のURL
        "baseUrl": imageUrl,
        // 送信時に通知画面等に表示するメッセージ
        "altText": altText,
        // 画像のサイズ
        "baseSize": {
          "width": 1040,
          "height": imageHight
        },
        "actions": [
          {
            "type": "uri",
            // 画像クリック時の遷移先リンク
            "linkUri": linkUri,
            // 画像のクリック位置
            "area": {
              "x": 0,
              "y": 0,
              "width": 1040,
              "height": imageHight
            }
          },
        ]
      }
    ],
    "customAggregationUnits": [
        messageId
    ]
  }

  multicastmessageRequest(chanelToken, postData)
}

/**
 * 分析
 */

/**
 * メッセージユニット毎の分析データ取得
 *
 * @param chanelToken チャネルトークン
 * @param customAggregationUnit ユニット名
 * @param startDate 開始日
 * @param endDate 終了日
 * @return {Object}ユニットメッセージの分析情報
 */
function messegeStatisticRequest(chanelToken, customAggregationUnit, startDate, endDate) {
  const params = {
    method: 'get',
    headers: {
      "Authorization": 'Bearer ' + chanelToken,
    }
  };

  const url = `https://api.line.me/v2/bot/insight/message/event/aggregation?customAggregationUnit=${customAggregationUnit}&from=${startDate}&to=${endDate}`;
    
  return JSON.parse(UrlFetchApp.fetch(url, params));
}