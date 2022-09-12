import { google } from 'googleapis'

import { env } from 'env/server.mjs'

const getSheets = async () => {
  const auth = await google.auth.getClient({
    // scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}
export const read = async (range?: string) => {
  const sheets = await getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: env.SHEET_ID,
    range: range || 'Sheet1!A2:C',
  })

  return res
}

export const append = async (values: Array<Array<string>>, range = 'Sheet1!A2:C4') => {
  const sheets = await getSheets()
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.SHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  })
}

export const update = async (range: string) => {
  const sheets = await getSheets()
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.SHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        ['my post', 'c221'],
        ['oranges', 'c23'],
      ],
    },
  })
}
