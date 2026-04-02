import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/contractor-proposal-tool.module.css";
import EstimateSection from "../components/EstimateSection";

/* ========================
   Helpers
======================== */
const formatCurrency = (num) =>
  `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const parseNumber = (str) => {
  const cleaned = str.replace(/[^0-9.]/g, "");
  return cleaned ? Number(cleaned) : null;
};

/* ========================
   Currency Input
======================== */
function CurrencyInput({ label, value, onChange, min, max, className }) {
  const [text, setText] = useState("$");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) {
      setText(value === null ? "$" : formatCurrency(value));
    }
  }, [value, editing]);

  const handleChange = (e) => {
    setEditing(true);
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setText(raw ? `$${raw}` : "$");

    const parsed = parseNumber(raw);
    if (parsed !== null) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    setEditing(false);
    setText(value === null ? "$" : formatCurrency(value));
  };

  return (
    <>
      <label>{label}</label>
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
      />
    </>
  );
}

/* ========================
   Page Wrapper
======================== */
export default function ContractorProposalTool() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.calculatorWrapper}>
        <TuCieloCalculator />
      </div>
    </div>
  );
}

/* ========================
   Calculator
======================== */
function TuCieloCalculator() {
  const router = useRouter();

  const [units, setUnits] = useState(50);
  const [cost, setCost] = useState(null);
  const [term, setTerm] = useState(25);
  const [showFees, setShowFees] = useState(false);

  const MIN_COST = 1_000_000;
  const MAX_COST = 10_000_000;
  const STEP = 50_000;

  const rate = 0.0999;
  const monthlyRate = rate / 12;
  const totalPayments = term * 12;

  const originationFee = cost ? cost * 0.05 : 0;
  const basePayment =
    cost
      ? (cost * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -totalPayments))
      : 0;

  const debtServiceReserve = basePayment * 10;
  const totalLoan = cost ? cost + originationFee + debtServiceReserve : 0;

  const monthlyPayment =
    cost
      ? (totalLoan * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -totalPayments))
      : 0;

  const perUnitPayment = units ? monthlyPayment / units : 0;

  // ✅ SAFE VALUES (this is the only logical addition)
  const safeMonthlyPayment = cost ? monthlyPayment : 0;
  const safePerUnitPayment = cost ? perUnitPayment : 0;

  const fmt = (n) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className={styles.contractorProposalTool}>
      {/* Units */}
      <label>Number of Units</label>
      <input
        type="number"
        min={1}
        value={units}
        onChange={(e) => setUnits(Number(e.target.value))}
        className={styles.input}
      />

      {/* Cost */}
      <CurrencyInput
        label="Cost of Project or Reserves to Finance"
        value={cost}
        onChange={setCost}
        min={MIN_COST}
        max={MAX_COST}
        className={styles.input}
      />

      {/* Slider */}
      <input
        type="range"
        min={MIN_COST}
        max={MAX_COST}
        step={STEP}
        value={cost ?? MIN_COST}
        onChange={(e) => setCost(Number(e.target.value))}
      />

      {/* Term */}
      <label>Select Loan Term</label>
      <select
        value={term}
        onChange={(e) => setTerm(Number(e.target.value))}
        className={styles.input}
      >
        <option value={10}>10 Years</option>
        <option value={15}>15 Years</option>
        <option value={20}>20 Years</option>
        <option value={25}>25 Years</option>
      </select>

      {/* Payments — ALWAYS VISIBLE */}
      <p>
        <strong>Total Monthly Payment Association:</strong>{" "}
        ${fmt(safeMonthlyPayment)}
      </p>

      <p>
        <strong>Monthly Payment Per Unit:</strong>{" "}
        ${fmt(safePerUnitPayment)}
      </p>

      {/* Fees Toggle */}
      <button type="button" onClick={() => setShowFees(!showFees)}>
        {showFees
          ? "Hide Fees and Total Financed Amount"
          : "Show Fees and Total Financed Amount"}
      </button>

      {/* Fees Table */}
      {showFees && cost && (
        <div className={styles.feesTableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Origination Fee (5%)</td>
                <td>${fmt(originationFee)}</td>
              </tr>
              <tr>
                <td>Debt Service Coverage Reserve</td>
                <td>${fmt(debtServiceReserve)}</td>
              </tr>
              <tr>
                <td>Total Financed Amount</td>
                <td>${fmt(totalLoan)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <EstimateSection />

      <button
        className={styles.backToMain}
        onClick={() => router.push("/")}
      >
        Back to TuCielo
      </button>
    </div>
  );
}