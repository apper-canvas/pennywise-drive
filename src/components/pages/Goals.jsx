import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import GoalForm from "@/components/organisms/GoalForm"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { formatCurrency, formatDate, calculateProgress } from "@/utils/formatters"
import goalService from "@/services/api/goalService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { toast } from "react-toastify"

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const loadGoals = async () => {
    try {
      setLoading(true)
      setError("")
      
      await new Promise(resolve => setTimeout(resolve, 300))
      const data = await goalService.getAll()
      setGoals(data)
    } catch (err) {
      setError("Failed to load savings goals")
      console.error("Error loading goals:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleAddGoal = async (goalData) => {
    try {
      const newGoal = await goalService.create(goalData)
      setGoals(prev => [...prev, newGoal].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)))
      setShowForm(false)
      toast.success("Savings goal created successfully!")
    } catch (err) {
      console.error("Error adding goal:", err)
      toast.error("Failed to create goal")
    }
  }

  const handleEditGoal = async (goalData) => {
    try {
      const updatedGoal = await goalService.update(editingGoal.Id, goalData)
      setGoals(prev => 
        prev.map(g => g.Id === editingGoal.Id ? updatedGoal : g)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      )
      setEditingGoal(null)
      toast.success("Goal updated successfully!")
    } catch (err) {
      console.error("Error updating goal:", err)
      toast.error("Failed to update goal")
    }
  }

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) return

    try {
      await goalService.delete(id)
      setGoals(prev => prev.filter(g => g.Id !== id))
      toast.success("Goal deleted successfully!")
    } catch (err) {
      console.error("Error deleting goal:", err)
      toast.error("Failed to delete goal")
    }
  }

  const handleUpdateProgress = async (id, amount) => {
    try {
      const updatedGoal = await goalService.updateProgress(id, amount)
      setGoals(prev => 
        prev.map(g => g.Id === id ? updatedGoal : g)
      )
      toast.success(`Added ${formatCurrency(amount)} to your goal!`)
    } catch (err) {
      console.error("Error updating progress:", err)
      toast.error("Failed to update progress")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadGoals} />

  // Calculate totals
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress = calculateProgress(totalCurrentAmount, totalTargetAmount)
  
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length
  const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount).length

  // Check for upcoming deadlines
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
  const urgentGoals = goals.filter(g => {
    const deadline = new Date(g.deadline)
    return deadline <= thirtyDaysFromNow && g.currentAmount < g.targetAmount
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600">Track your progress towards financial milestones</p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Goals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Target</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(totalTargetAmount)}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <ApperIcon name="Target" className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalCurrentAmount)}
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round(overallProgress)}% of total goal
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ApperIcon name="PiggyBank" className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-blue-600">{activeGoals}</p>
                <p className="text-xs text-gray-500">
                  {completedGoals} completed
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ApperIcon name="Trophy" className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent Goals</p>
                <p className="text-2xl font-bold text-orange-600">{urgentGoals}</p>
                <p className="text-xs text-gray-500">
                  Due within 30 days
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ApperIcon name="Clock" className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Goal Form */}
      <AnimatePresence>
        {(showForm || editingGoal) && (
          <GoalForm
            onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
            onCancel={() => {
              setShowForm(false)
              setEditingGoal(null)
            }}
            initialData={editingGoal}
          />
        )}
      </AnimatePresence>

      {/* Goals List */}
      {goals.length === 0 ? (
        <Empty
          title="No savings goals yet"
          description="Create your first savings goal to start building towards your financial future"
          icon="Trophy"
          action={() => setShowForm(true)}
          actionLabel="Create Goal"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
            const isCompleted = progress >= 100
            const deadline = new Date(goal.deadline)
            const isUrgent = deadline <= thirtyDaysFromNow && !isCompleted
            const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
            
            return (
              <motion.div
                key={goal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`${isCompleted ? 'border-green-200 bg-green-50' : isUrgent ? 'border-orange-200 bg-orange-50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <ApperIcon 
                          name={isCompleted ? "CheckCircle" : "Target"} 
                          className={`h-5 w-5 mr-2 ${isCompleted ? 'text-green-600' : 'text-primary-600'}`} 
                        />
                        {goal.name}
                      </CardTitle>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingGoal(goal)}
                        >
                          <ApperIcon name="Edit2" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {isUrgent && (
                      <div className="flex items-center text-orange-600 text-sm">
                        <ApperIcon name="AlertTriangle" className="h-4 w-4 mr-1" />
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Due today!'}
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Circle */}
                      <div className="flex items-center justify-between">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              className="text-gray-200"
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              className={isCompleted ? "text-green-500" : "text-primary-500"}
                              initial={{ strokeDasharray: "0 251.2" }}
                              animate={{ 
                                strokeDasharray: `${(progress * 251.2) / 100} 251.2` 
                              }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-lg font-bold ${isCompleted ? 'text-green-600' : 'text-primary-600'}`}>
                              {Math.round(progress)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 ml-6">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Current</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(goal.currentAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Target</span>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(goal.targetAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Remaining</span>
                              <span className="font-semibold text-blue-600">
                                {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Goal Details */}
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Target Date: {formatDate(goal.deadline)}</span>
                        <span>Created: {formatDate(goal.createdAt)}</span>
                      </div>

                      {/* Quick Actions */}
                      {!isCompleted && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const amount = prompt("How much would you like to add?")
                              if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                                handleUpdateProgress(goal.Id, parseFloat(amount))
                              }
                            }}
                            className="flex-1"
                          >
                            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                            Add Money
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              const amount = prompt("How much would you like to withdraw?")
                              if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                                handleUpdateProgress(goal.Id, -parseFloat(amount))
                              }
                            }}
                          >
                            <ApperIcon name="Minus" className="h-4 w-4 mr-2" />
                            Withdraw
                          </Button>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="flex items-center justify-center p-3 bg-green-100 rounded-lg">
                          <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Goal Completed! 🎉</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Goals