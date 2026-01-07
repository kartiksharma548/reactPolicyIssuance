
import React, { useEffect, useState } from 'react';
import { getQuestionnaire } from '../../services/masterService/masterService';
import {saveAnswers} from '../../services/masterService/masterService';
import {getProposalDetails} from '../../services/policyServices/proposerService';
import { APIOption, APIQuestion, Question, Props } from '../../models/types/MCQ/questionnaireType';


const Questionnaire: React.FC<Props> = ({onClose, ProposalId,updateQuote }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);



 
 useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch questions
      const data: APIQuestion[] = await getQuestionnaire('Customer');
      const formatted: Question[] = data.map((item) => ({
        id: item.QuestId,
        question: item.Question,
        options: item.Options.map((opt) => ({
          text: opt.OptionText.trim(),
          weight: opt.Weightage,
          optionId: opt.OptionId
        }))
      }));
      setQuestions(formatted);

      // Fetch existing answers
      const proposalData = await getProposalDetails({ ProposalId });
      const existingAnswers = proposalData?.SelectedAnswers || [];

      const prefilled: { [key: number]: string } = {};

      existingAnswers.forEach((answer) => {
        const question = formatted.find((q) => q.id === answer.QuestionId);
        const option = question?.options.find((o) => o.optionId === answer.OptionId);
        if (option) {
          prefilled[answer.QuestionId] = option.text;
        }
      });

      setAnswers(prefilled);
    } catch (error) {
      console.error('Error loading questionnaire or proposal details:', error);
    }
  };

  fetchData();
}, [ProposalId]);



  const handleOptionChange = (questionId: number, selected: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selected }));
  };

//   const handleSubmit = () => {
//     setSubmitted(true);
//     console.log('User Answers:', answers); 
//   };


const handleSubmit = async () => {
  debugger;
  setSubmitted(true);

  const answerArray1 = Object.entries(questions).map((questionId) => {
    
        const question = questions.find((q) => q.id === parseInt(questionId[1].id));
        var answersexist=answers[questionId[1].id];
        
        if(answersexist===undefined)
        {
        const selectedOption = question?.options.find((opt) => opt.text === "No");
        return {
        FKQUEST_ID: parseInt(questionId[1].id),
            FKOPTION_ID: selectedOption?.optionId ?? 0
        };
        }
        else{
        const selectedOption = question?.options.find((opt) => opt.text === answersexist);

        return {
        FKQUEST_ID:parseInt(questionId[1].id),
        FKOPTION_ID: selectedOption?.optionId ?? 0 
        };
        
        }

     

  });
  

  

  console.log("Submitted JSON", JSON.stringify(answerArray1));

  try {
    // const proposalId = 101; 
    const result = await saveAnswers(ProposalId, answerArray1);
    console.log('Save Result:', result);
    
    handleClose();
  } catch (error) {
    console.error('Error saving answers:', error);
  }

  updateQuote();
};


  const handleClose = () => {
    setSubmitted(false);
    setAnswers({});
    onClose(); 
  };


const score = questions.reduce((acc, question) => {
  const selectedOption = question.options.find(
    (opt) => opt.text === answers[question.id]
  );
  return acc + (selectedOption?.weight || 0);
}, 0);


const maxScore = questions.reduce((acc, question) => {
  const maxWeight = Math.max(...question.options.map((opt) => opt.weight));
  return acc + maxWeight;
}, 0);


  return (
    <>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
            <button
                onClick={handleClose}
                className="absolute top-2 right-4 text-xl text-gray-600 hover:text-red-500 font-bold"
                >
                ×
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              Additional Information
            </h2>

            {questions.map((q) => (
              <div key={q.id} className="mb-4">
                <p className="font-medium mb-2">
                  {q.id}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <label key={option.text} className="block">
                        <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option.text}
                        disabled={submitted}
                        checked={answers[q.id] === option.text}
                        onChange={() => handleOptionChange(q.id, option.text)}
                        className="mr-2"
                        />
                        {option.text}
                    </label>
                    ))}

                </div>
              </div>
            ))}

            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            ) : (
              <div className="mt-6 text-center text-xl font-semibold text-green-700">
                {/* Your Score: {score} / {maxScore} */}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Questionnaire;