export interface Proposal {
    category: "feature" | "integration",
    title: string,
    desc: string,
    ownerPK: string,
    for: number,
    against: number,
    status: "vote" | "close" | "completed" | "pass" | "failed",
  }