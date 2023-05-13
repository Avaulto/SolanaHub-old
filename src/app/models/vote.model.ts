
export interface newProposal {
  proposalOwnerPk: string,
  signeture: Uint8Array,
  category: "feature" | "integration",
  title: string,
  desc: string,
}
export interface Proposal {
  uuid: string;
  proposalOwnerPk: string,
  signeture: string,
  signers: voteSinger[]
  date: Date,
  category: "feature" | "integration",
  title: string,
  desc: string,
  for: number,
  against: number,
  status: "active" | "pass" | "failed",
}

export interface voteSinger{
  signer: string;
  signeture: Uint8Array;
  voted: "for" | "against"
}