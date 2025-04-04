
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

const productWeights = {
  "Pokemon Full": 0.31,
  "Pokemon Half": 0.21,
  "One Piece Full": 0.35,
  "Union Arena Full": 0.36,
  "Yu-Gi-Oh Full": 0.32,
  "Yu-Gi-Oh Half": 0.14,
};

const countryToZone = { /* truncated for brevity */ };
const ratesByZone = { /* truncated for brevity */ };

const roundUpToNearestHalf = (value) => {
  return Math.ceil(value * 2) / 2;
};

const ShippingEstimator = () => {
  const [quantities, setQuantities] = useState({});
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [packageCount, setPackageCount] = useState(1);
  const [result, setResult] = useState(null);

  const handleQuantityChange = (product, value) => {
    setQuantities({ ...quantities, [product]: parseInt(value) || 0 });
  };

  const handleDimensionChange = (key, value) => {
    setDimensions({ ...dimensions, [key]: parseFloat(value) || 0 });
  };

  const calculateShipping = () => {
    const totalWeight = Object.entries(quantities).reduce(
      (sum, [product, qty]) => sum + (productWeights[product] * qty),
      0
    );

    const boxWeight = packageCount * 0.5; // 0.5kg per package
    const finalWeight = totalWeight + boxWeight;

    const { length, width, height } = dimensions;
    const volumeWeight = (length * width * height) / 5000;
    const chargeableWeight = Math.max(finalWeight, volumeWeight);
    const roundedWeight = Math.max(3.5, roundUpToNearestHalf(chargeableWeight));
    const zone = countryToZone[selectedCountry] || "N/A";
    const rate = ratesByZone[zone]?.[roundedWeight] || "-";

    setResult({
      totalWeight: finalWeight,
      volumeWeight,
      chargeableWeight: roundedWeight,
      zone,
      rate
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Shipping Estimator</h1>

      <Select onValueChange={setSelectedCountry}>
        <SelectTrigger>
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(countryToZone).map((country) => (
            <SelectItem key={country} value={country}>
  {new Intl.DisplayNames(['en'], { type: 'region' }).of(country)}
</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>
        <label className="block mb-1 font-medium">Number of Packages</label>
        <Input
          type="number"
          min="1"
          value={packageCount}
          onChange={(e) => setPackageCount(parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="space-y-2">
        {Object.keys(productWeights).map((product) => (
          <div key={product} className="flex items-center gap-2">
            <label className="w-40">{product}</label>
            <Input
              type="number"
              min="0"
              value={quantities[product] || ""}
              onChange={(e) => handleQuantityChange(product, e.target.value)}
              placeholder="Qty"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Input
          placeholder="Length (cm)"
          type="number"
          value={dimensions.length}
          onChange={(e) => handleDimensionChange("length", e.target.value)}
        />
        <Input
          placeholder="Width (cm)"
          type="number"
          value={dimensions.width}
          onChange={(e) => handleDimensionChange("width", e.target.value)}
        />
        <Input
          placeholder="Height (cm)"
          type="number"
          value={dimensions.height}
          onChange={(e) => handleDimensionChange("height", e.target.value)}
        />
      </div>

      <Button onClick={calculateShipping}>Calculate</Button>

      {result && (
        <div className="mt-4 space-y-1">
          <p>Total Weight (with boxes): {result.totalWeight.toFixed(2)} kg</p>
          <p>Volume Weight: {result.volumeWeight.toFixed(2)} kg</p>
          <p className="font-bold">Chargeable Weight: {result.chargeableWeight.toFixed(2)} kg</p>
          <p>Zone: {result.zone}</p>
          <p className="font-bold text-lg">Estimated Shipping: {result.rate === "-" ? "N/A" : `${result.rate.toLocaleString()} JPY`}</p>
        </div>
      )}
    {result && (
        <div className="mt-2">
          <Button
            onClick={() => {
              const summary = `Shipping Estimate
Country: ${new Intl.DisplayNames(['en'], { type: 'region' }).of(selectedCountry)}
Zone: ${result.zone}
Total Weight: ${result.totalWeight.toFixed(2)} kg
Volume Weight: ${result.volumeWeight.toFixed(2)} kg
Chargeable Weight: ${result.chargeableWeight.toFixed(2)} kg
Shipping Cost: ${result.rate === '-' ? 'N/A' : `${result.rate.toLocaleString()} JPY`}`;
              navigator.clipboard.writeText(summary);
            }}
          >
            Copy Result
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShippingEstimator;
