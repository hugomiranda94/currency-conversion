# Currency Conversion

Hello!

This is my TDS Take Home Assigment. This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The following instructions explain how to run the project.


## Add Environment Variables

As instructed, this project uses following free API resource: [https://currencybeacon.com](https://currencybeacon.com/register). In order to properly run this project, the API Key from Currency Beacon needs to be set to the API_KEY environment variable. You can check the `.env.example` file to understand the syntax, where a valid API Key should be set and the file should be renamed to `.env`.

## Running the dev script

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.