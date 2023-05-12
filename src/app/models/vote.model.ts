export interface Proposal {
  uuid: string;
  ownerPK: string,
  signeture: string,
  signers: signers[]
  date: Date,
  category: "feature" | "integration",
  title: string,
  desc: string,
  for: number,
  against: number,
  status: "vote" | "close" | "completed" | "pass" | "failed",
}

interface signers{
  signer: string;
  signeture: string;
}