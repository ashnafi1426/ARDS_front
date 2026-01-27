import { useState, useEffect } from 'react';
import api from '../../config/api';

const SelfAssessment = () => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  useEffect(() => {
    fetchCurrentAssessment();
    fetchAssessmentHistory();
  }, []);

  const fetchCurrentAssessment = async () => {
    try {
      setLoading(true);
      // Mock assessment data - replace with actual API
      const mockAssessment = {
        id: 1,
        title: 'Weekly Academic Risk Assessment',
        description: 'Please complete this self-assessment to help us understand your current academic situation',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        questions: [
          {
            id: 1,
            category: 'Academic Performance',
            question: 'How many classes did you attend this week?',
            type: 'scale',
            min: 0,
            max: 5,
            unit: 'classes',
            weight: 0.15
          },
          {
            id: 2,
            category: 'Academic Performance',
            question: 'How many hours did you study this week?',
            type: 'scale',
            min: 0,
            max: 40,
            unit: 'hours',
            weight: 0.20
          },
          {
            id: 3,
            category: 'Academic Performance',
            question: 'How many assignments did you complete on time?',
            type: 'scale',
            min: 0,
            max: 10,
            unit: 'assignments',
            weight: 0.15
          },
          {
            id: 4,
            category: 'Engagement',
            question: 'Rate your class participation level',
            type: 'scale',
            min: 1,
            max: 10,
            unit: 'score',
            weight: 0.10
          },
          {
            id: 5,
            category: 'Personal Well-being',
            question: 'Current stress level (1=low, 10=high)',
            type: 'scale',
            min: 1,
            max: 10,
            unit: 'level',
            weight: 0.15
          },
          {
            id: 6,
            category: 'Personal Well-being',
            question: 'How would you rate your sleep quality?',
            type: 'scale',
            min: 1,
            max: 10,
            unit: 'score',
            weight: 0.10
          },
          {
            id: 7,
            category: 'Support System',
            question: 'How strong is your social support network?',
            type: 'scale',
            min: 1,
            max: 10,
            unit: 'score',
            weight: 0.10
          },
          {
            id: 8,
            category: 'Support System',
            question: 'Are you experiencing financial concerns?',
            type: 'scale',
            min: 1,
            max: 10,
            unit: 'level',
            weight: 0.05
          }
        ]
      };
      setCurrentAssessment(mockAssessment);
    } catch (error) {
      setError('Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentHistory = async () => {
    try {
      // Mock history data
      const mockHistory = [
        {
          id: 1,
          submittedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          score: 0.45,
          riskLevel: 'low',
          responses: { attendance: 4, studyHours: 18, assignments: 8 }
        },
        {
          id: 2,
          submittedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          score: 0.62,
          riskLevel: 'moderate',
          responses: { attendance: 3, studyHours: 12, assignments: 6 }
        }
      ];
      setAssessmentHistory(mockHistory);
    } catch (error) {
      console.error('Failed to fetch assessment history');
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: parseInt(value)
    });
  };

  const calculateProgress = () => {
    if (!currentAssessment) return 0;
    const totalQuestions = currentAssessment.questions.length;
    const answeredQuestions = Object.keys(responses).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate risk score (mock calculation)
      const totalWeight = currentAssessment.questions.reduce((sum, q) => sum + q.weight, 0);
      const weightedScore = currentAssessment.questions.reduce((sum, q) => {
        const response = responses[q.id] || 0;
        const normalizedScore = (response - q.min) / (q.max - q.min);
        return sum + (normalizedScore * q.weight);
      }, 0);
      
      const finalScore = weightedScore / totalWeight;
      
      setSuccess(`Assessment submitted successfully! Your risk score: ${(finalScore * 100).toFixed(0)}%`);
      setSubmitted(true);
      
      // Refresh history
      fetchAssessmentHistory();
    } catch (error) {
      setError('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 0.4) return 'text-green-400';
    if (score < 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (value, min, max) => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage < 40) return 'bg-green-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading assessment...</div>
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Active Assessment</h3>
        <p className="text-gray-400">Check back later for new assessments</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-semibold text-white mb-2">Assessment Completed!</h3>
          <p className="text-gray-400 mb-6">Thank you for completing your self-assessment</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setResponses({});
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Take Another Assessment
          </button>
        </div>

        {/* Assessment History */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Assessments</h3>
          <div className="space-y-3">
            {assessmentHistory.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {new Date(assessment.submittedAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Risk Score: <span className={getRiskColor(assessment.score)}>{(assessment.score * 100).toFixed(0)}%</span>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  assessment.riskLevel === 'low' ? 'bg-green-900/20 text-green-400' :
                  assessment.riskLevel === 'moderate' ? 'bg-yellow-900/20 text-yellow-400' :
                  'bg-red-900/20 text-red-400'
                }`}>
                  {assessment.riskLevel.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Self-Assessment Questionnaire</h2>
          <p className="text-gray-400 mt-1">Complete your weekly academic risk assessment</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Due: {new Date(currentAssessment.dueDate).toLocaleDateString()}</p>
          <div className="text-sm text-gray-400">Progress: {calculateProgress().toFixed(0)}%</div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmitAssessment} className="space-y-6">
        {/* Progress Bar */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Assessment Progress</span>
            <span>{calculateProgress().toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {['Academic Performance', 'Engagement', 'Personal Well-being', 'Support System'].map((category) => (
            <div key={category} className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{category}</h3>
              <div className="space-y-6">
                {currentAssessment.questions
                  .filter(q => q.category === category)
                  .map((question) => (
                    <div key={question.id} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <label className="text-white font-medium flex-1">
                          {question.question}
                        </label>
                        <span className="text-sm text-gray-400">
                          Weight: {(question.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={question.min}
                          max={question.max}
                          value={responses[question.id] || question.min}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          className="flex-1"
                        />
                        <div className="w-20 text-right">
                          <span className="text-white font-medium">
                            {responses[question.id] || question.min}
                          </span>
                          <span className="text-gray-400 text-sm ml-1">{question.unit}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(
                            responses[question.id] || question.min, 
                            question.min, 
                            question.max
                          )}`}
                          style={{ 
                            width: `${((responses[question.id] || question.min - question.min) / (question.max - question.min)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setResponses({})}
            className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
          >
            Reset Answers
          </button>
          <button
            type="submit"
            disabled={submitting || calculateProgress() < 100}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">💡 Assessment Tips</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• Be honest with your responses - this helps us provide accurate support</li>
          <li>• Take your time to think about each question carefully</li>
          <li>• Your responses are confidential and used only for academic support purposes</li>
          <li>• Complete assessments weekly to track your progress over time</li>
        </ul>
      </div>
    </div>
  );
};

export default SelfAssessment;
