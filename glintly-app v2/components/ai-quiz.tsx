"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, CheckCircle, XCircle, Trophy, Target, Lightbulb } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

interface AIQuizProps {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
  onSkip: () => void
  videosWatched: number
}

export function AIQuiz({ questions, onComplete, onSkip, videosWatched }: AIQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false))

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }

    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = true
    setAnsweredQuestions(newAnsweredQuestions)

    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onComplete(score)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80)
      return { message: "Excellent! You're mastering this content!", icon: Trophy, color: "text-green-500" }
    if (percentage >= 60) return { message: "Good job! Keep up the learning!", icon: Target, color: "text-blue-500" }
    return { message: "Keep practicing! Every question helps you learn.", icon: Lightbulb, color: "text-orange-500" }
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">AI Tutor Quiz</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            You've watched {videosWatched} videos! Let's test your knowledge.
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>
                Score: {score}/{questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <Badge variant="outline" className="mb-3">
                  {currentQuestion.category}
                </Badge>
                <h3 className="text-lg font-semibold text-balance mb-4">{currentQuestion.question}</h3>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === currentQuestion.correctAnswer
                  const showResult = showExplanation

                  let buttonVariant: "outline" | "default" | "destructive" = "outline"
                  let buttonClass = "justify-start text-left h-auto p-4 bg-transparent"

                  if (showResult) {
                    if (isCorrect) {
                      buttonVariant = "default"
                      buttonClass += " bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300"
                    } else if (isSelected && !isCorrect) {
                      buttonVariant = "destructive"
                      buttonClass += " bg-red-500/20 border-red-500/50"
                    }
                  } else if (isSelected) {
                    buttonClass += " bg-primary/10 border-primary/50"
                  }

                  return (
                    <Button
                      key={index}
                      variant={buttonVariant}
                      className={buttonClass}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-semibold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-balance">{option}</span>
                        {showResult && isCorrect && <CheckCircle className="h-5 w-5 ml-auto text-green-500" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 ml-auto text-red-500" />}
                      </div>
                    </Button>
                  )
                })}
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Explanation</h4>
                      <p className="text-sm text-muted-foreground text-balance">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 pt-4">
            {!showExplanation ? (
              <>
                <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null} className="flex-1 rounded-2xl">
                  Submit Answer
                </Button>
                <Button variant="outline" onClick={onSkip} className="rounded-2xl bg-transparent">
                  Skip Quiz
                </Button>
              </>
            ) : (
              <Button onClick={handleNextQuestion} className="flex-1 rounded-2xl">
                {isLastQuestion ? "See Results" : "Next Question"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function QuizResults({
  score,
  totalQuestions,
  onContinue,
}: {
  score: number
  totalQuestions: number
  onContinue: () => void
}) {
  const percentage = (score / totalQuestions) * 100
  const {
    message,
    icon: Icon,
    color,
  } = (() => {
    if (percentage >= 80)
      return { message: "Excellent! You're mastering this content!", icon: Trophy, color: "text-green-500" }
    if (percentage >= 60) return { message: "Good job! Keep up the learning!", icon: Target, color: "text-blue-500" }
    return { message: "Keep practicing! Every question helps you learn.", icon: Lightbulb, color: "text-orange-500" }
  })()

  return (
    <div className="h-full w-full bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6"
          >
            <Icon className={`h-16 w-16 mx-auto ${color}`} />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-6 text-balance">{message}</p>

          <div className="mb-6">
            <div className="text-3xl font-bold mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">{percentage.toFixed(0)}% correct</div>
          </div>

          <Button onClick={onContinue} className="w-full rounded-2xl">
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
