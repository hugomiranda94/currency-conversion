import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return new Response('Missing API Key', { status: 500 });
  }

  const amount = req.nextUrl.searchParams.get('amount');
  const from = req.nextUrl.searchParams.get('from');
  const to = req.nextUrl.searchParams.get('to');

  if (!from) {
    return new Response('Missing from currency', { status: 500 });
  }
  if (!to) {
    return new Response('Missing to currency', { status: 500 });
  }
  if (!amount) {
    return new Response('Missing amount', { status: 500 });
  }

  const route = `https://api.currencybeacon.com/v1/convert?from=${from}&to=${to}&amount=${amount}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };
  const response = await fetch(route, options);
  if (response.status !== 200) {
    return new Response('Failed fetch', { status: 500 });
  }
  const data = await response.json();
  if (!data) return new Response('Failed fetch', { status: 500 });
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
