interface QuestionModel  {
    type: 'multiple' | 'boolean';
    question: string;
    answer: string[];
    
}

export default QuestionModel;