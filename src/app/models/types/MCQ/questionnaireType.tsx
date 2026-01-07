export type APIOption = {
  OptionId: number;
  FKQuestId: number;
  OptionText: string;
  Weightage: number;
};

export type APIQuestion = {
  QuestId: number;
  Type: string;
  Question: string;
  Options: APIOption[];
};

export type Question = {
  id: number;
  question: string;
  options: {
    text: string;
    weight: number;
    optionId: number;
  }[];
};

export type Props = {
  onClose: () => void;
  ProposalId: number;
};