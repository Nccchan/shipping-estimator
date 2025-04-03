import React, { useState } from 'react';

function ShippingEstimator() {
  const [country, setCountry] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState(null);

  const shippingRates = {
    US: {
      1: 3800,
      2: 3800,
      2.5: 4500,
      3: 5100,
      3.5: 5400,
      4: 6100,
      4.5: 6500,
      5: 7200,
      5.5: 7900,
      6: 8400,
      6.5: 8800,
      7: 9100,
      7.5: 9500,
      8: 10000,
      8.5: 10300,
      9: 10700,
      9.5: 12500,
      10: 13000,
    },
  };

  const calculateShipping = () => {
    const w = parseFloat(weight);
    if (!country || isNaN(w)) {
      setPrice('Please select a country and enter valid weight.');
      return;
    }

    const rates = shippingRates[country];
    if (!rates) {
      setPrice('No rate data available for selected country.');
      return;
    }

    const applicableWeight = Object.keys(rates)
      .map(Number)
      .filter((k) => w <= k)
      .sort((a, b) => a - b)[0];

    if (applicableWeight) {
      setPrice(`Estimated shipping: ¥${rates[applicableWeight]}`);
    } else {
      setPrice('Weight too high or no rate available.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Shipping Estimator</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Country:&nbsp;
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="US">United States</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Weight (kg):&nbsp;
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
      </div>

      <button onClick={calculateShipping}>Estimate</button>

      {price && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          {price}
        </div>
      )}
    </div>
  );
}

export default ShippingEstimator;
