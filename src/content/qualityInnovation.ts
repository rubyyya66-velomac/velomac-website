import qualityInnovationData from "./data/quality-innovation.json";

export type QualityDocument = {
  id: string;
  title: string;
  category: string;
  holder: string;
  issuer: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate: string;
  scope: string;
  thumbnail: string;
  alt: string;
  publicDisplayApproved: boolean;
};

export type PatentRecord = {
  title: string;
  publicationNumber: string;
  recordType: string;
  technicalArea: string;
  legalEntity: string;
  status: string;
  verifiedSource: string;
  verifiedDate: string;
  thumbnail: string;
  alt: string;
  publicDisplayApproved: boolean;
};

type QualityDocumentGroupSource = {
  id: string;
  title: string;
  documentIds: string[];
};

export type QualityDocumentGroup = Omit<QualityDocumentGroupSource, "documentIds"> & {
  documents: QualityDocument[];
};

const approvedDocuments = qualityInnovationData.documents.filter(
  (document) => document.publicDisplayApproved
) as QualityDocument[];
const documentsById = new Map(approvedDocuments.map((document) => [document.id, document]));

export const qualityInnovationContent = {
  ...qualityInnovationData,
  documents: approvedDocuments,
  documentGroups: (qualityInnovationData.documentGroups as QualityDocumentGroupSource[]).map((group) => ({
    id: group.id,
    title: group.title,
    documents: group.documentIds
      .map((documentId) => documentsById.get(documentId))
      .filter((document): document is QualityDocument => Boolean(document))
  })),
  patents: qualityInnovationData.patents.filter((patent) => patent.publicDisplayApproved) as PatentRecord[]
};
