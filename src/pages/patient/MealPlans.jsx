import { useState } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/Card'
import { UtensilsCrossed, Plus, Calendar, Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/database'
import { aiService } from '../../services/aiService'
import { motion, AnimatePresence } from 'framer-motion'

function MealPlans() {
  const { user } = useAuth()
  const [mealPlans, setMealPlans] = useState(db.getMealPlansByUserId(user.id))
  const [generating, setGenerating] = useState(false)
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [preferences, setPreferences] = useState({
    goal: '',
    dietType: '',
    calories: ''
  })

  const handleGeneratePlan = async (e) => {
    e.preventDefault()
    setGenerating(true)

    const plan = await aiService.generateDietPlan(user, preferences)
    
    const newPlan = db.createMealPlan({
      userId: user.id,
      ...plan,
      preferences
    })

    setMealPlans([newPlan, ...mealPlans])
    setGenerating(false)
    setShowGenerateForm(false)
    setPreferences({ goal: '', dietType: '', calories: '' })
  }

  return (
    <Layout title="Meal Plans">
      <div className="space-y-6">
        <button
          onClick={() => setShowGenerateForm(!showGenerateForm)}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          Generate AI Meal Plan
        </button>

        <AnimatePresence>
          {showGenerateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card hover={false}>
                <form onSubmit={handleGeneratePlan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health Goal</label>
                    <select
                      value={preferences.goal}
                      onChange={(e) => setPreferences({ ...preferences, goal: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select goal</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="heart_health">Heart Health</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
                    <select
                      value={preferences.dietType}
                      onChange={(e) => setPreferences({ ...preferences, dietType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="balanced">Balanced</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                      <option value="mediterranean">Mediterranean</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Daily Calories</label>
                    <input
                      type="number"
                      value={preferences.calories}
                      onChange={(e) => setPreferences({ ...preferences, calories: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 2000"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={generating}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {generating ? 'Generating...' : 'Generate Plan'}
                  </button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {mealPlans.length === 0 ? (
          <Card hover={false}>
            <div className="text-center py-8 text-gray-500">
              <UtensilsCrossed size={48} className="mx-auto mb-4 opacity-50" />
              <p>No meal plans yet. Generate your first AI-powered meal plan!</p>
            </div>
          </Card>
        ) : (
          mealPlans.map((plan) => (
            <Card key={plan.id} hover={false}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.duration} • {plan.calories} calories/day</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar size={14} />
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>

              <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                {plan.meals.map((meal, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{meal.day}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Breakfast:</span>
                        <span className="text-gray-600 ml-2">{meal.breakfast}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Lunch:</span>
                        <span className="text-gray-600 ml-2">{meal.lunch}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Dinner:</span>
                        <span className="text-gray-600 ml-2">{meal.dinner}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Snacks:</span>
                        <span className="text-gray-600 ml-2">{meal.snacks.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </Layout>
  )
}

export default MealPlans
