export const HEPARIN_CONCENTRATION = 40;
export const SOURCE_WEIGHTS_KG = [40, 50, 60, 70];

export const PROTOCOLS = {
  acs: {
    label: "ACS",
    therapeuticRange: "50–75 秒",
    bands: [
      { label: "< 40 秒", test: (value) => value < 40, bolusPerKg: 50, rateDeltaPerKg: 2 },
      { label: "40–49 秒", test: (value) => value < 50, rateDeltaPerKg: 2 },
      { label: "50–75 秒", test: (value) => value <= 75, rateDeltaPerKg: 0 },
      { label: "76–85 秒", test: (value) => value <= 85, rateDeltaPerKg: -2 },
      { label: "86–100 秒", test: (value) => value <= 100, holdMinutes: 30, rateDeltaPerKg: -2 },
      { label: "> 100 秒", test: () => true, holdMinutes: 60, rateDeltaPerKg: -3, notifyPhysician: true },
    ],
  },
  vte: {
    label: "VTE / PE",
    therapeuticRange: "60–79 秒",
    bands: [
      { label: "< 35 秒", test: (value) => value < 35, bolusPerKg: 80, rateDeltaPerKg: 4 },
      { label: "35–49 秒", test: (value) => value < 50, bolusPerKg: 40, rateDeltaPerKg: 2 },
      { label: "50–59 秒", test: (value) => value < 60, rateDeltaPerKg: 2 },
      { label: "60–79 秒", test: (value) => value < 80, rateDeltaPerKg: 0 },
      { label: "80–89 秒", test: (value) => value < 90, rateDeltaPerKg: -2 },
      { label: "90–120 秒", test: (value) => value <= 120, holdMinutes: 30, rateDeltaPerKg: -2 },
      { label: "> 120 秒", test: () => true, holdMinutes: 60, rateDeltaPerKg: -3, notifyPhysician: true },
    ],
  },
};

function roundToIncrement(value, increment) {
  return Math.round((value + Number.EPSILON) / increment) * increment;
}

function roundBolus(units) {
  return Math.min(5000, roundToIncrement(units, 500));
}

function assertFiniteInRange(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}`);
  }
}

export function calculateAdjustment({ indication, weightKg, apttSeconds, currentRateMlHour }) {
  const protocol = PROTOCOLS[indication];
  if (!protocol) throw new TypeError("Unknown indication");

  assertFiniteInRange("weightKg", weightKg, 20, 300);
  assertFiniteInRange("apttSeconds", apttSeconds, 1, 300);
  assertFiniteInRange("currentRateMlHour", currentRateMlHour, 0, 200);

  const band = protocol.bands.find(({ test }) => test(apttSeconds));
  const bolusUnits = band.bolusPerKg ? roundBolus(weightKg * band.bolusPerKg) : 0;
  const rawRateDelta = (weightKg * band.rateDeltaPerKg) / HEPARIN_CONCENTRATION;
  const rateDeltaMlHour = Math.sign(rawRateDelta) * roundToIncrement(Math.abs(rawRateDelta), 0.5);
  const newRateMlHour = roundToIncrement(
    Math.max(0, currentRateMlHour + rateDeltaMlHour),
    0.5,
  );

  return {
    indication,
    indicationLabel: protocol.label,
    therapeuticRange: protocol.therapeuticRange,
    bandLabel: band.label,
    weightKg,
    apttSeconds,
    concentrationUnitsMl: HEPARIN_CONCENTRATION,
    bolusUnits,
    holdMinutes: band.holdMinutes ?? 0,
    rateDeltaMlHour,
    currentRateMlHour,
    currentUnitsHour: currentRateMlHour * HEPARIN_CONCENTRATION,
    newRateMlHour,
    newUnitsHour: newRateMlHour * HEPARIN_CONCENTRATION,
    notifyPhysician: band.notifyPhysician ?? false,
    isSourceWeight: SOURCE_WEIGHTS_KG.includes(weightKg),
  };
}
