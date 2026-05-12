const BASE_TABLE = [
  { start: "00:00", end: "04:59", values: ["11:00", "11:00", "10:30", "10:00", "09:30"] },
  { start: "05:00", end: "05:14", values: ["12:00", "12:00", "11:30", "11:00", "10:30"] },
  { start: "05:15", end: "05:29", values: ["12:15", "12:15", "11:45", "11:15", "10:45"] },
  { start: "05:30", end: "05:44", values: ["12:30", "12:30", "12:00", "11:30", "11:00"] },
  { start: "05:45", end: "05:59", values: ["12:45", "12:45", "12:15", "11:45", "11:15"] },
  { start: "06:00", end: "06:14", values: ["13:00", "13:00", "12:30", "12:00", "11:30"] },
  { start: "06:15", end: "13:29", values: ["13:00", "13:00", "12:30", "12:00", "11:30"] },
  { start: "13:30", end: "13:59", values: ["12:45", "12:45", "12:15", "11:45", "11:15"] },
  { start: "14:00", end: "14:29", values: ["12:30", "12:30", "12:00", "11:30", "11:00"] },
  { start: "14:30", end: "14:59", values: ["12:15", "12:15", "11:45", "11:15", "10:45"] },
  { start: "15:00", end: "15:29", values: ["12:00", "12:00", "11:30", "11:00", "10:30"] },
  { start: "15:30", end: "15:59", values: ["11:45", "11:45", "11:15", "10:45", "10:15"] },
  { start: "16:00", end: "16:29", values: ["11:30", "11:30", "11:00", "10:30", "10:00"] },
  { start: "16:30", end: "16:59", values: ["11:15", "11:15", "10:45", "10:15", "09:45"] },
  { start: "17:00", end: "17:29", values: ["11:00", "11:00", "10:30", "10:00", "09:30"] },
  { start: "17:30", end: "17:59", values: ["11:00", "11:00", "10:30", "10:00", "09:30"] },
  { start: "18:00", end: "18:29", values: ["11:00", "11:00", "10:30", "10:00", "09:30"] },
  { start: "18:30", end: "18:59", values: ["11:00", "11:00", "10:30", "10:00", "09:30"] },
  { start: "19:00", end: "23:59", values: ["11:00", "11:00", "10:30", "10:00", "09:30"] }
];

const EXTENDED_TABLE = [
  { start: "19:00", end: "04:59", values: ["11:00", "11:00", "10:30", "10:00", "09:30"], overnight: true },
  { start: "05:00", end: "05:14", values: ["12:00", "12:00", "11:30", "11:00", "10:30"] },
  { start: "05:15", end: "05:29", values: ["12:15", "12:15", "11:45", "11:15", "10:45"] },
  { start: "05:30", end: "05:44", values: ["12:30", "12:30", "12:00", "11:30", "11:00"] },
  { start: "05:45", end: "05:59", values: ["12:45", "12:45", "12:15", "11:45", "11:15"] },
  { start: "06:00", end: "06:14", values: ["13:00", "13:00", "12:30", "12:00", "11:30"] },
  { start: "06:15", end: "06:29", values: ["13:15", "13:15", "12:45", "12:15", "11:45"] },
  { start: "06:30", end: "06:44", values: ["13:30", "13:30", "13:00", "12:30", "12:00"] },
  { start: "06:45", end: "06:59", values: ["13:45", "13:45", "13:15", "12:45", "12:15"] },
  { start: "07:00", end: "13:29", values: ["14:00", "14:00", "13:30", "13:00", "12:30"] },
  { start: "13:30", end: "13:59", values: ["13:45", "13:45", "13:15", "12:45", "11:15"] },
  { start: "14:00", end: "14:29", values: ["13:30", "13:30", "13:00", "12:30", "11:00"] },
  { start: "14:30", end: "14:59", values: ["13:15", "13:15", "12:45", "12:15", "10:45"] },
  { start: "15:00", end: "15:29", values: ["13:00", "13:00", "12:30", "12:00", "10:30"] },
  { start: "15:30", end: "15:59", values: ["12:45", "12:45", "11:15", "10:45", "10:15"] },
  { start: "16:00", end: "16:29", values: ["12:30", "12:30", "11:00", "10:30", "10:00"] },
  { start: "16:30", end: "16:59", values: ["12:15", "12:15", "10:45", "10:15", "09:45"] },
  { start: "17:00", end: "17:29", values: ["12:00", "12:00", "10:30", "10:00", "09:30"] },
  { start: "17:30", end: "17:59", values: ["11:45", "11:45", "10:30", "10:00", "09:30"] },
  { start: "18:00", end: "18:29", values: ["11:30", "11:30", "10:30", "10:00", "09:30"] },
  { start: "18:30", end: "18:59", values: ["11:15", "11:15", "10:30", "10:00", "09:30"] }
];

const STORAGE_KEY = "fdp-calculator-state-v2";
const MAX_DELAY_LOOKBACK = 12 * 60;
const DEFAULT_STATE = {
  report: "12:20",
  utcOffsetHours: "2",
  utcOffsetHalf: "0",
  sectors: "2",
  serviceType: "normal",
  hasDelayMessage: "no",
  delayDuration: "00:00",
  firstDelayMessageTime: "10:00",
  hasSecondDelayMessage: "no",
  secondDelayMessageTime: "11:00",
  hasSby: "no",
  sbyStart: "00:00",
  usePlanningCall: "no",
  sbyCallTime: "00:00",
  lastLeg: "02:04",
  taxi: "00:10"
};

function byId(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = byId(id);
  if (el) el.textContent = value;
}

function toMinutes(timeString) {
  if (!timeString || !timeString.includes(":")) return 0;
  const [h, m] = timeString.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function normalizeMinutes(totalMinutes) {
  return ((totalMinutes % 1440) + 1440) % 1440;
}

function minutesToDuration(totalMinutes) {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(totalMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function localToUtc(localMinutes, utcOffsetHours) {
  return localMinutes - utcOffsetHours * 60;
}

function diffForwardMinutes(fromMinutes, toMinutes) {
  let diff = toMinutes - fromMinutes;
  if (diff < 0) diff += 1440;
  return diff;
}

function isNightMinute(minuteOfDay) {
  const normalized = ((minuteOfDay % 1440) + 1440) % 1440;
  return normalized >= 1380 || normalized < 420;
}

function isInRange(reportMinutes, startMinutes, endMinutes, overnight = false) {
  if (overnight || startMinutes > endMinutes) {
    return reportMinutes >= startMinutes || reportMinutes <= endMinutes;
  }
  return reportMinutes >= startMinutes && reportMinutes <= endMinutes;
}

function lookupTableValue(table, reportMinutes, sectors) {
  const normalizedReport = normalizeMinutes(reportMinutes);

  for (const row of table) {
    const start = toMinutes(row.start);
    const end = toMinutes(row.end);
    if (isInRange(normalizedReport, start, end, row.overnight)) {
      return toMinutes(row.values[sectors - 1]);
    }
  }
  return null;
}

function overlapMinutes(startA, endA, startB, endB) {
  const start = Math.max(startA, startB);
  const end = Math.min(endA, endB);
  return Math.max(0, end - start);
}

function calculateStandbyDurationFromStart(reportMinutes, sbyStartMinutes) {
  let duration = reportMinutes - sbyStartMinutes;
  if (duration < 0) duration += 1440;
  return duration;
}

function calculateBaseCountableStandbyMinutes(reportMinutes, sbyMinutes) {
  const standbyStart = reportMinutes - sbyMinutes;
  const standbyEnd = reportMinutes;
  let countable = 0;
  const firstDay = Math.floor(standbyStart / 1440);
  const lastDay = Math.floor((standbyEnd - 1) / 1440);

  for (let day = firstDay; day <= lastDay; day += 1) {
    const dayOffset = day * 1440;
    countable += overlapMinutes(standbyStart, standbyEnd, dayOffset + 420, dayOffset + 1380);
  }

  return countable;
}

function calculateCountableStandbyMinutes(reportMinutes, sbyMinutes, callTimeMinutes) {
  const standbyStart = reportMinutes - sbyMinutes;
  const standbyEnd = reportMinutes;
  let countable = calculateBaseCountableStandbyMinutes(reportMinutes, sbyMinutes);

  if (callTimeMinutes === null || callTimeMinutes === undefined) return countable;
  if (!isNightMinute(callTimeMinutes)) return countable;

  const firstDay = Math.floor(standbyStart / 1440) - 1;
  const lastDay = Math.floor(standbyEnd / 1440) + 1;
  let effectiveCallAbsolute = null;

  for (let day = firstDay; day <= lastDay; day += 1) {
    const candidate = day * 1440 + callTimeMinutes;
    if (candidate >= standbyStart && candidate <= standbyEnd) {
      effectiveCallAbsolute = candidate;
      break;
    }
  }

  if (effectiveCallAbsolute === null) return countable;

  const intervalStart = effectiveCallAbsolute;
  const intervalEnd = standbyEnd;
  const totalCallToReport = Math.max(0, intervalEnd - intervalStart);
  let alreadyCountedInCallToReport = 0;
  const firstOverlapDay = Math.floor(intervalStart / 1440);
  const lastOverlapDay = Math.floor((intervalEnd - 1) / 1440);

  for (let day = firstOverlapDay; day <= lastOverlapDay; day += 1) {
    const dayOffset = day * 1440;
    alreadyCountedInCallToReport += overlapMinutes(intervalStart, intervalEnd, dayOffset + 420, dayOffset + 1380);
  }

  const extraNightMinutesToAdd = totalCallToReport - alreadyCountedInCallToReport;
  return countable + Math.max(0, extraNightMinutesToAdd);
}

function calculateStandbyReduction(countableStandby) {
  return Math.max(0, countableStandby - 360);
}

function formatUtcOffset(offset) {
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const minutes = Math.round((abs - hours) * 60);
  return `UTC${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

function getSelectedServiceType() {
  return document.querySelector('input[name="serviceType"]:checked')?.value || "normal";
}

function getSelectedHasSby() {
  return document.querySelector('input[name="hasSby"]:checked')?.value === "yes";
}

function getSelectedUsePlanningCall() {
  return document.querySelector('input[name="usePlanningCall"]:checked')?.value === "yes";
}

function getSelectedHasDelayMessage() {
  return document.querySelector('input[name="hasDelayMessage"]:checked')?.value === "yes";
}

function getSelectedHasSecondDelayMessage() {
  return document.querySelector('input[name="hasSecondDelayMessage"]:checked')?.value === "yes";
}

function setPanelVisibility(id, visible) {
  const panel = byId(id);
  if (!panel) return;
  panel.classList.toggle("visible", visible);
  if (id === "secondDelayFields" || id === "planningCallFields") {
    panel.style.display = visible ? "block" : "none";
  }
}

function toggleConditionalFields() {
  const hasSby = document.querySelector('input[name="hasSby"]:checked')?.value;
  const usePlanningCall = document.querySelector('input[name="usePlanningCall"]:checked')?.value;
  const hasDelayMessage = document.querySelector('input[name="hasDelayMessage"]:checked')?.value;
  const hasSecondDelayMessage = document.querySelector('input[name="hasSecondDelayMessage"]:checked')?.value;

  setPanelVisibility("sbyFields", hasSby === "yes");
  setPanelVisibility("planningCallFields", hasSby === "yes" && usePlanningCall === "yes");
  setPanelVisibility("delayFields", hasDelayMessage === "yes");
  setPanelVisibility("secondDelayFields", hasDelayMessage === "yes" && hasSecondDelayMessage === "yes");
}

function collectFormState() {
  return {
    report: byId("report")?.value || DEFAULT_STATE.report,
    utcOffsetHours: byId("utcOffsetHours")?.value || DEFAULT_STATE.utcOffsetHours,
    utcOffsetHalf: byId("utcOffsetHalf")?.value || DEFAULT_STATE.utcOffsetHalf,
    sectors: byId("sectors")?.value || DEFAULT_STATE.sectors,
    serviceType: document.querySelector('input[name="serviceType"]:checked')?.value || DEFAULT_STATE.serviceType,
    hasDelayMessage: document.querySelector('input[name="hasDelayMessage"]:checked')?.value || DEFAULT_STATE.hasDelayMessage,
    delayDuration: byId("delayDuration")?.value || DEFAULT_STATE.delayDuration,
    firstDelayMessageTime: byId("firstDelayMessageTime")?.value || DEFAULT_STATE.firstDelayMessageTime,
    hasSecondDelayMessage: document.querySelector('input[name="hasSecondDelayMessage"]:checked')?.value || DEFAULT_STATE.hasSecondDelayMessage,
    secondDelayMessageTime: byId("secondDelayMessageTime")?.value || DEFAULT_STATE.secondDelayMessageTime,
    hasSby: document.querySelector('input[name="hasSby"]:checked')?.value || DEFAULT_STATE.hasSby,
    sbyStart: byId("sbyStart")?.value || DEFAULT_STATE.sbyStart,
    usePlanningCall: document.querySelector('input[name="usePlanningCall"]:checked')?.value || DEFAULT_STATE.usePlanningCall,
    sbyCallTime: byId("sbyCallTime")?.value || DEFAULT_STATE.sbyCallTime,
    lastLeg: byId("lastLeg")?.value || DEFAULT_STATE.lastLeg,
    taxi: byId("taxi")?.value || DEFAULT_STATE.taxi
  };
}

function applyFormState(state) {
  const merged = { ...DEFAULT_STATE, ...state };
  Object.entries(merged).forEach(([key, value]) => {
    const element = byId(key);
    if (element) {
      element.value = value;
      return;
    }

    const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
    if (radio) radio.checked = true;
  });
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectFormState()));
  } catch {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function calculateDelayLogic(originalReport, delayDuration, firstMessageTime, hasSecondDelayMessage, secondMessageTime) {
  const delayedReport = originalReport + delayDuration;
  const firstMessageLead = diffForwardMinutes(firstMessageTime, originalReport);
  const firstMessageReasonable = firstMessageLead <= MAX_DELAY_LOOKBACK;
  const firstMessageValid = firstMessageReasonable && firstMessageLead >= 90;
  const warnings = [];

  if (!firstMessageReasonable) {
    warnings.push("Čas 1. zprávy vypadá jako více než 12 hodin před reportingem. Zkontroluj, jestli není omylem posunutý o den.");
  }

  if (!firstMessageValid) {
    return {
      delayApplied: false,
      firstMessageValid: false,
      firstMessageLead,
      delayedReport,
      effectiveFdpStart: originalReport,
      delayDuration: 0,
      usedMoreLimitingRule: false,
      usedSecondMessageRule: false,
      warnings
    };
  }

  let effectiveFdpStart = delayedReport;
  let usedSecondMessageRule = false;

  if (hasSecondDelayMessage && secondMessageTime !== null) {
    const secondMessageLead = diffForwardMinutes(secondMessageTime, originalReport);
    if (secondMessageLead <= MAX_DELAY_LOOKBACK) {
      const secondMessageStart = secondMessageTime + 60;
      effectiveFdpStart = Math.min(secondMessageStart, originalReport);
      usedSecondMessageRule = true;
    } else {
      warnings.push("Čas 2. zprávy vypadá mimo běžný rozsah a nebyl použit do výpočtu.");
    }
  }

  return {
    delayApplied: true,
    firstMessageValid: true,
    firstMessageLead,
    delayedReport,
    effectiveFdpStart,
    delayDuration,
    usedMoreLimitingRule: delayDuration >= 240,
    usedSecondMessageRule,
    warnings
  };
}

function calculateResults() {
  const originalReport = toMinutes(byId("report")?.value || "00:00");
  const utcOffsetHours = parseInt(byId("utcOffsetHours")?.value ?? "1", 10);
  const utcOffsetHalf = parseInt(byId("utcOffsetHalf")?.value ?? "0", 10);
  const utcOffset = utcOffsetHours + (utcOffsetHours < 0 ? -utcOffsetHalf / 60 : utcOffsetHalf / 60);
  const sectors = parseInt(byId("sectors")?.value ?? "1", 10);
  const lastLeg = toMinutes(byId("lastLeg")?.value || "00:00");
  const taxi = toMinutes(byId("taxi")?.value || "00:00");
  const serviceType = getSelectedServiceType();
  const warnings = [];

  const hasDelayMessage = getSelectedHasDelayMessage();
  const delayDuration = hasDelayMessage ? toMinutes(byId("delayDuration")?.value || "00:00") : 0;
  const firstDelayMessageTime = hasDelayMessage ? toMinutes(byId("firstDelayMessageTime")?.value || "00:00") : null;
  const hasSecondDelayMessage = hasDelayMessage ? getSelectedHasSecondDelayMessage() : false;
  const secondDelayMessageTime = hasDelayMessage && hasSecondDelayMessage ? toMinutes(byId("secondDelayMessageTime")?.value || "00:00") : null;

  const delayLogic = hasDelayMessage
    ? calculateDelayLogic(originalReport, delayDuration, firstDelayMessageTime, hasSecondDelayMessage, secondDelayMessageTime)
    : {
        delayApplied: false,
        firstMessageValid: false,
        firstMessageLead: 0,
        delayedReport: originalReport,
        effectiveFdpStart: originalReport,
        delayDuration: 0,
        usedMoreLimitingRule: false,
        usedSecondMessageRule: false,
        warnings: []
      };

  warnings.push(...delayLogic.warnings);

  const effectiveReport = delayLogic.effectiveFdpStart;
  const delayedReport = delayLogic.delayedReport;

  const hasSby = getSelectedHasSby();
  const usePlanningCall = hasSby ? getSelectedUsePlanningCall() : false;
  const sbyStart = hasSby ? toMinutes(byId("sbyStart")?.value || "00:00") : null;
  const sby = hasSby ? calculateStandbyDurationFromStart(effectiveReport, sbyStart) : 0;
  const sbyCallTime = hasSby && usePlanningCall ? toMinutes(byId("sbyCallTime")?.value || "00:00") : null;

  const selectedTable = serviceType === "extended" ? EXTENDED_TABLE : BASE_TABLE;
  const selectedOriginal = lookupTableValue(selectedTable, originalReport, sectors);
  const selectedDelayed = lookupTableValue(selectedTable, delayedReport, sectors);

  if (selectedOriginal === null || selectedDelayed === null) {
    return { error: "Nepodařilo se najít odpovídající řádek v tabulce." };
  }

  let selectedTableFdp;
  let basisReportUsed;

  if (!delayLogic.delayApplied) {
    selectedTableFdp = selectedOriginal;
    basisReportUsed = originalReport;
  } else if (delayLogic.usedMoreLimitingRule) {
    selectedTableFdp = Math.min(selectedOriginal, selectedDelayed);
    basisReportUsed = selectedOriginal <= selectedDelayed ? originalReport : delayedReport;
  } else {
    selectedTableFdp = selectedOriginal;
    basisReportUsed = originalReport;
  }

  const baseBasisValue = lookupTableValue(BASE_TABLE, basisReportUsed, sectors);
  if (baseBasisValue === null) {
    return { error: "Nepodařilo se najít odpovídající řádek v základní tabulce." };
  }

  const plannedExtensionDifference = selectedTableFdp - baseBasisValue;
  const captainExtraApplied = Math.max(0, 120 - Math.max(0, plannedExtensionDifference));
  const countableStandby = hasSby ? calculateCountableStandbyMinutes(effectiveReport, sby, sbyCallTime) : 0;
  const standbyReduction = calculateStandbyReduction(countableStandby);
  const maxFdp = selectedTableFdp - standbyReduction;
  const maxFdpCaptain = selectedTableFdp + captainExtraApplied - standbyReduction;

  const dutyEndLocal = effectiveReport + maxFdp;
  const dutyEndCaptainLocal = effectiveReport + maxFdpCaptain;
  const latestDepartureLocal = dutyEndLocal - lastLeg - taxi;
  const latestDepartureCaptainLocal = dutyEndCaptainLocal - lastLeg - taxi;

  const dutyEndUtc = localToUtc(dutyEndLocal, utcOffset);
  const dutyEndCaptainUtc = localToUtc(dutyEndCaptainLocal, utcOffset);
  const latestDepartureUtc = localToUtc(latestDepartureLocal, utcOffset);
  const latestDepartureCaptainUtc = localToUtc(latestDepartureCaptainLocal, utcOffset);

  if (hasDelayMessage && delayDuration === 0) {
    warnings.push("Zpoždění je zapnuté, ale doba zpoždění je 00:00.");
  }

  if (hasSby && sby === 0) {
    warnings.push("SBY vychází na 00:00. Zkontroluj, jestli je čas začátku SBY správně.");
  }

  if (usePlanningCall && sbyCallTime !== null && !isNightMinute(sbyCallTime)) {
    warnings.push("Call time neleží mezi 23:00 a 07:00, takže noční výjimka se nepoužila.");
  }

  if (lastLeg + taxi > maxFdp) {
    warnings.push("Součet posledního sektoru a taxi-in je delší než vypočítaný FDP. Zkontroluj vstupy.");
  }

  return {
    error: null,
    serviceType,
    utcOffset,
    originalReport,
    effectiveReport,
    delayedReport,
    basisReportUsed,
    sectors,
    hasDelayMessage,
    delayDuration,
    firstDelayMessageTime,
    hasSecondDelayMessage,
    secondDelayMessageTime,
    delayApplied: delayLogic.delayApplied,
    firstMessageValid: delayLogic.firstMessageValid,
    firstMessageLead: delayLogic.firstMessageLead,
    usedMoreLimitingRule: delayLogic.usedMoreLimitingRule,
    usedSecondMessageRule: delayLogic.usedSecondMessageRule,
    hasSby,
    usePlanningCall,
    sbyStart,
    sby,
    sbyCallTime,
    countableStandby,
    standbyReduction,
    lastLeg,
    taxi,
    baseBasisValue,
    selectedTableFdp,
    plannedExtensionDifference,
    captainExtraApplied,
    maxFdp,
    maxFdpCaptain,
    dutyEndLocal,
    dutyEndCaptainLocal,
    latestDepartureLocal,
    latestDepartureCaptainLocal,
    dutyEndUtc,
    dutyEndCaptainUtc,
    latestDepartureUtc,
    latestDepartureCaptainUtc,
    warnings
  };
}

function renderResults(result) {
  const infoBox = byId("infoBox");
  if (!infoBox) return;

  if (result.error) {
    setText("maxFdp", "--:--");
    setText("maxFdpCaptain", "--:--");
    setText("fdpEndText", "Konec duty: --:-- LT / --:-- UTC");
    setText("fdpEndCaptainText", "Konec duty: --:-- LT / --:-- UTC");
    setText("latestDeparture", "--:-- LT");
    setText("latestDepartureUtc", "--:-- UTC");
    setText("latestDepartureCaptain", "--:-- LT");
    setText("latestDepartureCaptainUtc", "--:-- UTC");
    infoBox.className = "status bad";
    infoBox.textContent = result.error;
    return;
  }

  setText("maxFdp", minutesToDuration(result.maxFdp));
  setText("maxFdpCaptain", minutesToDuration(result.maxFdpCaptain));
  setText("fdpEndText", `Konec duty: ${minutesToTime(result.dutyEndLocal)} LT / ${minutesToTime(result.dutyEndUtc)} UTC`);
  setText("fdpEndCaptainText", `Konec duty: ${minutesToTime(result.dutyEndCaptainLocal)} LT / ${minutesToTime(result.dutyEndCaptainUtc)} UTC`);
  setText("latestDeparture", `${minutesToTime(result.latestDepartureLocal)} LT`);
  setText("latestDepartureUtc", `${minutesToTime(result.latestDepartureUtc)} UTC`);
  setText("latestDepartureCaptain", `${minutesToTime(result.latestDepartureCaptainLocal)} LT`);
  setText("latestDepartureCaptainUtc", `${minutesToTime(result.latestDepartureCaptainUtc)} UTC`);

  let infoText = "";

  if (result.serviceType === "extended") {
    infoText =
      `Služba je počítaná z tabulky „e“. Oproti základní tabulce je plánované prodloužení ${minutesToDuration(result.plannedExtensionDifference)}. ` +
      `Kapitánské prodloužení přidává ještě ${minutesToDuration(result.captainExtraApplied)}.`;
  } else {
    infoText =
      `Služba je počítaná ze základní tabulky. Kapitánské prodloužení přidává ${minutesToDuration(result.captainExtraApplied)}.`;
  }

  if (result.hasDelayMessage) {
    if (!result.firstMessageValid) {
      infoText += ` 1. zpráva o zpoždění přišla jen ${minutesToDuration(result.firstMessageLead)} před původním reportingem, takže se nepoužila.`;
    } else {
      infoText += ` Původní reporting byl ${minutesToTime(result.originalReport)} LT.`;
      infoText += ` Doba zpoždění je ${minutesToDuration(result.delayDuration)}.`;
      infoText += ` Posunutý reporting je ${minutesToTime(result.delayedReport)} LT.`;
      infoText += ` FDP začíná v ${minutesToTime(result.effectiveReport)} LT.`;

      if (result.delayDuration < 240) {
        infoText += ` Zpoždění je menší než 4:00, proto se limit FDP počítá podle původního reportingu ${minutesToTime(result.originalReport)} LT.`;
      } else {
        infoText += ` Zpoždění je 4:00 nebo více, proto se použil více limitující čas pro výpočet FDP: ${minutesToTime(result.basisReportUsed)} LT.`;
      }

      if (result.usedSecondMessageRule && result.secondDelayMessageTime !== null) {
        infoText += ` Druhá zpráva přišla v ${minutesToTime(result.secondDelayMessageTime)} LT, takže začátek FDP byl určen jako dřívější z původního reportingu a 1:00 po druhé zprávě.`;
      }
    }
  }

  if (result.hasSby) {
    infoText += ` SBY začala v ${minutesToTime(result.sbyStart)} LT.`;
    infoText += ` Celková SBY byla ${minutesToDuration(result.sby)}.`;
    infoText += ` Pro krácení se počítá ${minutesToDuration(result.countableStandby)}.`;

    if (result.usePlanningCall && result.sbyCallTime !== null) {
      if (isNightMinute(result.sbyCallTime)) {
        infoText += ` Čas hovoru ${minutesToTime(result.sbyCallTime)} spadl do 23:00–07:00, takže od call time do reportingu se vše počítá jako denní držení.`;
      } else {
        infoText += ` Čas hovoru ${minutesToTime(result.sbyCallTime)} byl zadaný, ale neleží v 23:00–07:00, takže noční výjimka se nepoužila.`;
      }
    }

    if (result.standbyReduction > 0) {
      infoText += ` SBY zkrátila duty o ${minutesToDuration(result.standbyReduction)}.`;
    } else {
      infoText += ` SBY duty nezkrátila.`;
    }
  } else {
    infoText += ` Před reportingem nebyla SBY.`;
  }

  infoText += ` Přepočet do UTC je udělaný s posunem ${formatUtcOffset(result.utcOffset)}.`;

  if (result.warnings.length) {
    infoText += ` Upozornění: ${result.warnings.join(" ")}`;
    infoBox.className = "status warn";
  } else {
    infoBox.className = "status good";
  }

  infoBox.textContent = infoText;
}

function runCalculation() {
  try {
    const result = calculateResults();
    renderResults(result);
    saveState();
  } catch (err) {
    const infoBox = byId("infoBox");
    if (infoBox) {
      infoBox.className = "status bad";
      infoBox.textContent = "JS chyba: " + (err?.message || err);
    }
  }
}

function bindEvents() {
  document.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("change", () => {
      toggleConditionalFields();
      runCalculation();
    });

    el.addEventListener("input", runCalculation);
  });

  byId("calculateBtn")?.addEventListener("click", runCalculation);
}

document.addEventListener("DOMContentLoaded", () => {
  applyFormState(loadState());
  bindEvents();
  toggleConditionalFields();
  runCalculation();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
