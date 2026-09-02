export const personalLinkedInUrl = "https://www.linkedin.com/in/hudsond/";

export const contractPositioning = {
  availability: "Available immediately",
  contractBasis: "Through Applification Ltd",
  location: "Remote UK",
  role: "Senior Contract AI Product Engineer",
  stack: "React, Next.js + TypeScript",
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
