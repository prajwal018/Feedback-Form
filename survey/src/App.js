/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [sessionID, setSessionID] = useState('');
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState({});
	const [submitted, setSubmitted] = useState(false);

	const [questions, setQuestions] = useState([
		{
			id: 1,
			text: 'How satisfied are you with our products?',
			type: 'rating',
			options: [1, 2, 3, 4, 5],
		},
		{
			id: 2,
			text: 'How fair are the prices compared to similar retailers?',
			type: 'rating',
			options: [1, 2, 3, 4, 5],
		},
		{
			id: 3,
			text: 'How satisfied are you with the value for money of your purchase?',
			type: 'rating',
			options: [1, 2, 3, 4, 5],
		},
		{
			id: 4,
			text: 'On a scale of 1-10 how would you recommend us to your friends and family?',
			type: 'rating',
			options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		},
		{
			id: 5,
			text: 'What could we do to improve our service?',
			type: 'text',
		},
	]);

	useEffect(() => {
		// Generate a unique session ID
		const newSessionID = Math.random().toString(36).substr(2, 9);
		setSessionID(newSessionID);
	}, []);

	const saveAnswer = (questionID, answer) => {
		setAnswers((prevAnswers) => {
			const newAnswers = { ...prevAnswers };
			newAnswers[`(UID:${sessionID})Q_${questionID}`] = answer;
			return newAnswers;
		});
	};

	const getSavedAnswer = (questionID) => {
		return answers[`(UID:${sessionID})Q_${questionID}`];
	};

	const handleNextQuestion = () => {
		setCurrentQuestion((prevQuestion) => prevQuestion + 1);
	};

	const handlePrevQuestion = () => {
		setCurrentQuestion((prevQuestion) => prevQuestion - 1);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log('Submitting answers', answers);

		// Check if an answer has been selected for all questions
		const isComplete = questions.every((question) => {
			const answer = getSavedAnswer(question.id);
			if (question.type === 'rating') {
				return answer !== undefined && answer !== null;
			} else {
				return answer && answer.trim() !== '';
			}
		});

		if (isComplete) {
			// Send the answers to the server
			fetch('http://localhost:3001/survey', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(answers),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Response from server:', data);
				})
				.catch((error) => {
					console.error('Error sending answers to server:', error);
					setSubmitted(false);
				})
				.finally(() => {
					setSubmitted(true);
				});
		} else {
			alert('Please answer all questions before submitting the form.');
		}
	};

	const renderQuestion = (question) => {
		switch (question.type) {
			case 'rating':
				return (
					<div>
						<p className="question">{question.text}</p>
						<div className="rating">
							{question.options.map((option) => (
								<label key={option}>
									<button
										type="button"
										className={
											getSavedAnswer(question.id) === option ? 'selected' : ''
										}
										onClick={(event) => saveAnswer(question.id, option)}
									>
										{option}
									</button>
								</label>
							))}
						</div>
					</div>
				);
			case 'text':
				return (
					<div style={{ textAlign: 'center' }}>
						<p className="question">{question.text}</p>
						<div className="textarea">
							<textarea
								name={`question_${question.id}`}
								value={getSavedAnswer(question.id) || ''}
								onChange={(event) =>
									saveAnswer(question.id, event.target.value)
								}
							/>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	if (submitted) {
		return (
			<div>
				<div className="title">
					<p>Thank you for completing our survey!</p>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<div className="title">
					<p>Customer Survey</p>
				</div>
				<div className="form-container">
					<div>
						{currentQuestion === 0 ? (
							<div>
								<div className="start">
									<p>Welcome to our survey!</p>
								</div>
								<div className="start">
									<button onClick={handleNextQuestion}>Start</button>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmit}>
								<p className="question-number">{`Question ${currentQuestion} / ${questions.length}`}</p>
								{renderQuestion(questions[currentQuestion - 1])}
								<div className="nav">
									{currentQuestion > 1 && (
										<button type="button" onClick={handlePrevQuestion}>
											Previous
										</button>
									)}
									{currentQuestion < questions.length && (
										<button type="button" onClick={handleNextQuestion}>
											Next
										</button>
									)}
									{currentQuestion === questions.length && (
										<button type="submit">Submit</button>
									)}
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
