import React, { useState } from 'react';

const shippingRates = {
  US: {
    1: 3800, 2: 3800, 2.5: 4500, 3: 5100, 3.5: 5400, 4: 6100, 4.5: 6500, 5: 7200, 5.5: 7900, 6: 8400, 6.5: 8800, 7: 9100, 7.5: 9500, 8: 10000, 8.5: 10300, 9: 10700, 9.5: 12500, 10: 13000
  },
  CA: {
    1: 3800, 2: 3800, 2.5: 4500, 3: 5100, 3.5: 5400, 4: 6100, 4.5: 6500, 5: 7200, 5.5: 7900, 6: 8400, 6.5: 8800, 7: 9100, 7.5: 9500, 8: 10000, 8.5: 10300, 9: 10700, 9.5: 12500, 10: 13000
  }
};

function App() {
  const [country, setCountry] = useState('US');
  const [weight, setWeight] = useState(1);
  const [price, setPrice] = useState(null);

  const handleEstimate = () => {
    const rate = shippingRates[country]?.[weight];
    setPrice(rate ?? 'N/A');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shipping Estimator</h1>
      <label>
        Country:
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          {Object.keys(shippingRates).map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Weight (kg):
        <input
          type="number"
          step="0.5"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
        />
      </label>
      <br />
      <button onClick={handleEstimate}>Estimate</button>
      {price !== null && <p>Shipping Cost: ¥{price}</p>}
    </div>
  );
}

export default App;
