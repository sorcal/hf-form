export interface Rate {
  borrowingRate: number
  monthlyRate: number
}

// might be worth to move to .env
const GRAPHQL_API_URL = 'https://hypofriend.de/q'

export async function fetchMortgageRates(payload: {
  propertyPrice: number
  loanAmount: number
  annualRepayRate: number
}): Promise<Record<string, Rate>> {
  try {
    // Apollo client is a better choice overall but I'm not doing it in this test task
    const fetchResponse = await fetch(GRAPHQL_API_URL, {
      headers: {
        accept: '*/*',
        'accept-language': 'en,de;q=0.9,cs;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      referrer: 'https://hypofriend.de',
      referrerPolicy: 'same-origin',
      body: `{"query":"query { root {rates_table( property_price: ${payload.propertyPrice}, repayment: ${payload.annualRepayRate}, loan_amount: ${payload.loanAmount}, years_fixed: [5,10,15,20,25,30]) }}","variables":null}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
    const res = await fetchResponse.json()

    return res?.data?.root?.ratesTable || {}
  } catch (error) {
    // send error to monitoring service
    throw error
  }
}
