'use client';
import { useEffect, useRef, useState } from 'react';

export const CurrencyConversion = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [convertedValue, setConvertedValue] = useState<string | null>(null);
  const [fromCurrency, setFromCurrency] = useState<Currency>();
  const [toCurrency, setToCurrency] = useState<Currency>();
  const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);

  useEffect(() => {
    getAllCurrencies();
  }, []);

  const getAllCurrencies = () => {
    setLoadingCurrencies(true);
    fetch(`/api/currency/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.error('Error fetching data:', res.statusText);
        }
      })
      .then((res) => {
        const currencyList = res.response as unknown as Currency[];
        if (currencyList) {
          setCurrencies(currencyList);
        }
      })
      .catch(() => {
        console.error('Error fetching data:', 'Network error');
      })
      .finally(() => {
        setLoadingCurrencies(false);
      });
  };

  const convertCurrency = () => {
    if (!fromCurrency || !toCurrency || !amount) return;

    setConverting(true);

    fetch(
      `/api/currency/convert?from=${fromCurrency.short_code}&to=${
        toCurrency.short_code
      }&amount=${Number(amount)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.error('Error fetching data:', res.statusText);
        }
      })
      .then((res) => {
        let value = res.response.value;
        if (!value) {
          setConvertedValue('N/A');
        } else {
          value = value.toFixed(toCurrency?.precision ?? 2);
          value = toCurrency?.symbol_first
            ? `${toCurrency?.symbol} ${value}`
            : `${value} ${toCurrency?.symbol}`;
          setConvertedValue(value);
        }
      })
      .catch(() => {
        console.error('Error fetching data:', 'Network error');
      })
      .finally(() => setConverting(false));

    console.log(fromCurrency, toCurrency);
  };

  const resetConversion = () => {
    setAmount('');
    setFromCurrency(undefined);
    setToCurrency(undefined);
    setConvertedValue(null);
  };

  const handleCurrencyChange = (code: string, type: ConversionType) => {
    const currency = currencies.find(
      (currency) => currency.short_code === code
    );

    if (!currency) return;

    if (type === 'from') setFromCurrency(currency);
    if (type === 'to') setToCurrency(currency);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      convertCurrency();
    }
  };

  return (
    <div className='flex justify-center items-center text-black h-screen w-screen'>
      <div className='flex flex-col gap-8 items-center rounded bg-gray-200 p-16 min-w-3/4 relative overflow-hidden'>
        <h1 className='text-2xl font-semibold'>Currency Conversion</h1>
        <div className='flex flex-col lg:flex-row gap-8 w-full'>
          <CurrencyConversionSection
            conversionType='from'
            selectedCode={fromCurrency?.short_code ?? ''}
            currencies={currencies}
            handleCurrencyChange={handleCurrencyChange}
          >
            <div className='flex gap-1 items-center w-full bg-white rounded pl-3'>
              {fromCurrency?.symbol && (
                <span className='min-w-4 flex-shrink-0'>
                  {fromCurrency?.symbol}
                </span>
              )}
              <input
                className='bg-white text-black rounded p-4 w-full flex-grow'
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent)}
                placeholder='Enter amount'
              />
            </div>
          </CurrencyConversionSection>
          <CurrencyConversionSection
            conversionType='to'
            selectedCode={toCurrency?.short_code ?? ''}
            currencies={currencies}
            handleCurrencyChange={handleCurrencyChange}
          >
            <p
              className={`bg-gray-300 text-black rounded p-4 h-14 flex justify-center align-center text-center font-semibold text-lg`}
            >
              {convertedValue}
            </p>
          </CurrencyConversionSection>
        </div>
        <div className='flex gap-3'>
          <button
            className='min-w-40 py-4 px-6 rounded bg-red-400 text-white font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-75'
            onClick={() => resetConversion()}
            disabled={converting}
          >
            Reset
          </button>
          <button
            className='min-w-40 py-4 px-6 rounded bg-blue-500 text-white font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-25'
            onClick={() => convertCurrency()}
            disabled={!fromCurrency || !toCurrency || !amount || converting}
          >
            {converting ? 'Converting...' : 'Convert'}
          </button>
        </div>
        {loadingCurrencies && (
          <div className='w-full h-full absolute top-0 left-0 opacity-75 bg-slate-800 text-white font-semibold text-xl flex justify-center items-center'>
            Loading Currencies...
          </div>
        )}
      </div>
    </div>
  );
};

const CurrencyConversionSection = ({
  children,
  conversionType,
  currencies,
  selectedCode,
  handleCurrencyChange,
}: CurrencyConversionSectionProps) => {
  return (
    <div className='flex flex-col gap-3 w-full'>
      <p className='text-center uppercase text-sm'>{conversionType}</p>
      <CurrencySelector
        selectedCode={selectedCode}
        currencies={currencies}
        selectCurrency={(code) => handleCurrencyChange(code, conversionType)}
      />
      {children}
    </div>
  );
};

const CurrencySelector = ({
  selectedCode,
  currencies,
  selectCurrency,
}: {
  selectedCode: string;
  currencies: Currency[];
  selectCurrency: (code: string) => void;
}) => {
  return (
    <select
      className='bg-white text-black rounded p-4 cursor-pointer'
      onChange={(e) => selectCurrency(e.target.value)}
      value={selectedCode}
      disabled={!currencies || currencies.length === 0}
    >
      <option value={''} disabled>
        Select a currency
      </option>
      {currencies?.map((currency) => (
        <option
          key={currency.code}
          value={currency.short_code}
          className='cursor-pointer'
        >
          {currency.short_code} - {currency.name} ({currency.symbol})
        </option>
      ))}
    </select>
  );
};

type Currency = {
  code: string;
  decimal_mark: string;
  id: number;
  name: string;
  precision: number;
  short_code: string;
  subunit: number;
  symbol: string;
  symbol_first: boolean;
  thousands_separator: string;
};

type CurrencyConversionSectionProps = {
  children: React.ReactNode;
  conversionType: ConversionType;
  selectedCode: string;
  currencies: Currency[];
  handleCurrencyChange: (code: string, type: ConversionType) => void;
};

type ConversionType = 'from' | 'to';
