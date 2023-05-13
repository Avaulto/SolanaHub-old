
export interface newProposal {
  proposalOwnerPk: string,
  signeture: Uint8Array,
  category: "feature" | "integration",
  title: string,
  desc: string,
}
export interface Proposal {
  _id: string;
  proposalOwnerPk: string,
  signeture: string,
  signers: voter[]
  date: Date,
  category: "feature" | "integration",
  title: string,
  desc: string,
  for: number,
  against: number,
  status: "active" | "pass" | "failed",
}

export interface voter{
  voterPubkey: string;
  signeture: Uint8Array;
  voted: "for" | "against"
}