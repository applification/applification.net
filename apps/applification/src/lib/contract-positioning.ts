export const contractPositioning = {
  contractBasis: "Through Applification Ltd",
  location: "Remote UK",
  role: "Contract AI Product Engineer",
  stack: "React + TypeScript",
  teamFit: "Small product teams",
} as const;

const locationInSentence = contractPositioning.location.replace(
  /^./,
  (character) => character.toLowerCase(),
);

export const contractPositioningDescriptions = {
  about: `Dave Hudson is a ${contractPositioning.role} building ${contractPositioning.stack} products with ${contractPositioning.teamFit.toLowerCase()} on ${locationInSentence} contracts through Applification Ltd.`,
  clientWork: `Client work from Dave Hudson, a ${contractPositioning.role} building ${contractPositioning.stack} products with ${contractPositioning.teamFit.toLowerCase()} on ${locationInSentence} contracts through Applification Ltd.`,
  site: `Dave Hudson is a ${contractPositioning.role} building ${contractPositioning.stack} products with ${contractPositioning.teamFit.toLowerCase()} on ${locationInSentence} contracts through Applification Ltd.`,
} as const;
