import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Select, Checkbox } from '../../../components/ui/FormElements';
import { Plus, Copy, Trash2, Dumbbell, User, Target } from 'lucide-react';

const CreateRoutineView = () => {
  const [formData, setFormData] = useState({
    name: '',
    days: [],
    goal: '',
    level: '',
    exercises: [
      { id: 1, name: '', sets: 1, reps: 1, weight: 0, weightUnit: 'Kg', rest: 0 }
    ]
  });

  const handleAddExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { id: Date.now(), name: '', sets: 1, reps: 1, weight: 0, weightUnit: 'Kg', rest: 0 }
      ]
    }));
  };

  const handleRemoveExercise = (id) => {
    if (formData.exercises.length > 1) {
      setFormData(prev => ({
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== id)
      }));
    }
  };

  const handleDuplicateExercise = (exercise) => {
    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { ...exercise, id: Date.now() }
      ]
    }));
  };

  const handleExerciseChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="min-h-screen bg-[#0D0F16] p-8 text-white font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">TAREA 1: FORMULARIO DE CREACIÓN DE RUTINAS</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full"></div>
        </div>

        <Card className="border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
          <div className="space-y-10">
            
            {/* Step 1: Datos Generales */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0D0F16] font-bold">1</div>
                <h2 className="text-xl font-bold tracking-wide">DATOS GENERALES</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-11">
                <div className="md:col-span-2">
                  <Input 
                    label="Nombre de la Rutina" 
                    placeholder="Ej. Hipertrofia Avanzada"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Días de la semana</label>
                  <div className="flex flex-wrap gap-3">
                    {DAYS.map(day => (
                      <Button
                        key={day}
                        variant={formData.days.includes(day) ? 'primary' : 'secondary'}
                        onClick={() => {
                          const newDays = formData.days.includes(day) 
                            ? formData.days.filter(d => d !== day)
                            : [...formData.days, day];
                          setFormData({...formData, days: newDays});
                        }}
                        className="rounded-full text-sm py-1.5"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-300">Objetivo</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setFormData({...formData, goal: 'Gain Weight'})}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all ${formData.goal === 'Gain Weight' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-gray-700 bg-[#11131E] text-gray-400 hover:border-gray-500'}`}
                    >
                      <Target className="w-5 h-5" />
                      <span>Gain Weight</span>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, goal: 'Lose Weight'})}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all ${formData.goal === 'Lose Weight' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-gray-700 bg-[#11131E] text-gray-400 hover:border-gray-500'}`}
                    >
                      <User className="w-5 h-5" />
                      <span>Lose Weight</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-300">Nivel</label>
                  <div className="flex gap-3">
                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                      <button 
                        key={level}
                        onClick={() => setFormData({...formData, level})}
                        className={`flex-1 py-3 px-4 rounded-xl border text-sm transition-all ${formData.level === level ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0D0F16] font-bold' : 'border-gray-700 bg-[#11131E] text-gray-400 hover:bg-gray-800'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* Step 2: Ejercicios */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0D0F16] font-bold">2</div>
                <h2 className="text-xl font-bold tracking-wide">EJERCICIOS</h2>
              </div>

              <div className="pl-11 space-y-4">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-400 px-4 mb-2 hidden md:grid">
                  <div className="col-span-4">Nombre del Ejercicio</div>
                  <div className="col-span-2 text-center">Nº Series</div>
                  <div className="col-span-2 text-center">Nº Repeticiones</div>
                  <div className="col-span-2 text-center">Peso</div>
                  <div className="col-span-1 text-center">Descanso</div>
                  <div className="col-span-1 text-center">Acción</div>
                </div>

                <AnimatePresence>
                  {formData.exercises.map((exercise, index) => (
                    <motion.div 
                      key={exercise.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-[#181B29] border border-gray-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group hover:border-gray-700 transition-colors relative"
                    >
                      <div className="md:col-span-4">
                        <Select 
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Bench Press">Bench Press</option>
                          <option value="Squat">Squat</option>
                          <option value="Deadlift">Deadlift</option>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Input 
                          type="number" 
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(exercise.id, 'sets', parseInt(e.target.value))}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Input 
                          type="number" 
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(exercise.id, 'reps', parseInt(e.target.value))}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="md:col-span-2 flex space-x-2">
                        <Input 
                          type="number" 
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(exercise.id, 'weight', parseFloat(e.target.value))}
                          className="w-full text-center"
                        />
                        <Select
                          value={exercise.weightUnit}
                          onChange={(e) => handleExerciseChange(exercise.id, 'weightUnit', e.target.value)}
                          className="w-20 px-2"
                        >
                          <option value="Kg">Kg</option>
                          <option value="Lbs">Lbs</option>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-1">
                        <Input 
                          type="number" 
                          value={exercise.rest}
                          onChange={(e) => handleExerciseChange(exercise.id, 'rest', parseInt(e.target.value))}
                          className="text-center"
                          placeholder="s"
                        />
                      </div>
                      
                      <div className="md:col-span-1 flex justify-end space-x-2">
                        <button 
                          onClick={() => handleDuplicateExercise(exercise)}
                          className="p-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button 
                  variant="outline" 
                  onClick={handleAddExercise}
                  icon={Plus}
                  className="mt-4"
                >
                  Añadir Ejercicio
                </Button>
              </div>
            </section>
            
            <div className="pt-6 border-t border-gray-800 flex justify-center">
              <Button className="w-full md:w-auto md:px-16 py-3 text-lg">
                GUARDAR RUTINA
              </Button>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoutineView;
