import React, { useState } from 'react';
import styled from 'styled-components';

function GoalSetter() {
    const [goal, setGoal] = useState('');
    const [goalsList, setGoalsList] = useState([]);

    const handleGoalChange = (e) => {
        setGoal(e.target.value);
    };

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (goal) {
            setGoalsList([...goalsList, goal]);
            setGoal('');
        }
    };

    return (
        <GoalSetterStyled>
            <h1>Goal Setter</h1>
            <form onSubmit={handleAddGoal}>
                <input 
                    type="text" 
                    value={goal} 
                    onChange={handleGoalChange} 
                    placeholder="Set a new goal" 
                />
                <button type="submit">Add Goal</button>
            </form>
            <div className="goals-list">
                <h2>Your Goals</h2>
                {goalsList.length > 0 ? (
                    <ul>
                        {goalsList.map((goal, index) => (
                            <li key={index}>{goal}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No goals set yet.</p>
                )}
            </div>
        </GoalSetterStyled>
    );
}

const GoalSetterStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    form {
        display: flex;
        gap: 1rem;

        input {
            flex: 1;
            padding: 0.5rem;
            border: 2px solid #ccc;
            border-radius: 5px;
        }

        button {
            padding: 0.5rem 1rem;
            background: #5cb85c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                background: #4cae4c;
            }
        }
    }

    .goals-list {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 10px;

        ul {
            list-style: none;
            padding: 0;
        }
    }
`;

export default GoalSetter;
