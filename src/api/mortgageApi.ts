export interface Rate {
  borrowingRate: number
  monthlyRate: number
}

export async function fetchRates(payload: {
  propertyPrice: number
  loanAmount: number
  annualRepayRate: number
}): Promise<Record<string, Rate>> {
  // TODO handle exceptions

  // const fetchResponse = await fetch('https://hypofriend.de/q', {
  //   headers: {
  //     accept: '*/*',
  //     'accept-language': 'en,de;q=0.9,cs;q=0.8',
  //     'cache-control': 'no-cache',
  //     'content-type': 'application/json',
  //     pragma: 'no-cache',
  //     'sec-fetch-dest': 'empty',
  //     'sec-fetch-mode': 'cors',
  //     'sec-fetch-site': 'same-origin',
  //   },
  //   referrer: 'https://hypofriend.de',
  //   referrerPolicy: 'same-origin',
  //   // body: '{"query":"query { root {rates_table( property_price: 340000, repayment:2, loan_amount: 315664, years_fixed: [5,10,15,20,25,30]) }}","variables":null}',
  //   body: `{"query":"query { root {rates_table( property_price: ${payload.propertyPrice}, repayment: ${payload.annualRepayRate}, loan_amount: ${payload.loanAmount}, years_fixed: [5,10,15,20,25,30]) }}","variables":null}`,
  //   method: 'POST',
  //   mode: 'cors',
  //   credentials: 'include',
  // })
  // const res = await fetchResponse.json()

  const res = {
    meta: {
      serverTime: '2025-09-02T14:04:08+00:00',
      status: 0,
      key: 'OK',
    },
    data: {
      root: {
        ratesTable: {
          '5': {
            borrowingRate: 3.41,
            monthlyRate: 541,
          },
          '10': {
            borrowingRate: 3.5,
            monthlyRate: 550,
          },
          '15': {
            borrowingRate: 3.6,
            monthlyRate: 560,
          },
          '20': {
            borrowingRate: 3.95,
            monthlyRate: 595,
          },
          '25': {
            borrowingRate: 4.4,
            monthlyRate: 640,
          },
          '30': {
            borrowingRate: 4.45,
            monthlyRate: 645,
          },
        },
      },
    },
  }

  return res?.data?.root?.ratesTable
}
