import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Select } from '../../../components/ui/FormElements';
import { Plus, Copy, Trash2, Target, User, History } from 'lucide-react';

const mockRoutine = {
  name: 'Rutina Hipertrofia',
  days: ['Lunes', 'Miércoles', 'Viernes'],
  goal: 'Gain Weight',
  level: 'Intermediate',
  exercises: [
    { id: 1, name: 'Bench Press', sets: 4, reps: 10, weight: 60, weightUnit: 'Kg', rest: 60 },
    { id: 2, name: 'Squat', sets: 4, reps: 8, weight: 80, weightUnit: 'Kg', rest: 90 },
  ]
};

const changeHistory = [
  { id: 1, action: 'Auto-guardado', user: 'Admin', time: 'hace 5 minutos' },
  { id: 2, action: 'Se actualizó nombre de la rutina', user: 'Admin', time: 'hace 1 hora' },
  { id: 3, action: 'Días agregados a la semana', user: 'Admin', time: 'hace 1 día' },
];

const EditRoutineView = () => {
  const [formData, setFormData] = useState(mockRoutine);

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
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== id)
    }));
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-wide">EDITAR RUTINA DE ENTRENAMIENTO</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full mt-2"></div>
          </div>
          <div className="flex -space-x-3">
             <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Admin" className="w-10 h-10 rounded-full border-2 border-[#1E2235]" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Edit Form */}
          <Card className="flex-1 border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
            <div className="space-y-10">
              
              {/* Step 1: Datos Generales */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <h2 className="text-sm font-bold tracking-wide text-[#D4AF37] uppercase">1: Datos Generales</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <Input 
                      label="Nombre de la Rutina" 
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold tracking-wide text-[#D4AF37] uppercase">2: Ejercicios</h2>
                  <Button variant="ghost" onClick={handleAddExercise} icon={Plus} className="text-sm text-gray-400">
                    Añadir Ejercicio
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-400 px-4 mb-2 hidden md:grid">
                    <div className="col-span-4">Nombre del Ejercicio</div>
                    <div className="col-span-2 text-center">Nº Series</div>
                    <div className="col-span-2 text-center">Nº Repeticiones</div>
                    <div className="col-span-2 text-center">Peso</div>
                    <div className="col-span-1 text-center">Descanso</div>
                    <div className="col-span-1 text-center">Acción</div>
                  </div>

                  <AnimatePresence>
                    {formData.exercises.map((exercise) => (
                      <motion.div 
                        key={exercise.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-[#181B29] border border-gray-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group hover:border-gray-700 transition-colors"
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
                </div>
              </section>
              
              <div className="pt-6 border-t border-gray-800 flex justify-center">
                <Button className="w-full md:w-auto md:px-16 py-3 text-lg">
                  GUARDAR CAMBIOS DE RUTINA
                </Button>
              </div>

            </div>
          </Card>

          {/* Right Panel: Change History */}
          <Card className="w-full lg:w-80 h-fit border-[#D4AF37]/10 bg-[#1E2235]/50">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-gray-200">
                <History className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold">Historial de Cambios</h3>
              </div>
              
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#D4AF37]/20 before:to-transparent">
                {changeHistory.map((item, idx) => (
                  <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border border-[#D4AF37] bg-[#11131E] group-[.is-active]:bg-[#D4AF37] text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[2px] z-10" />
                    <div className="w-[calc(100%-1rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 p-3 bg-[#181B29] border border-gray-800 rounded-lg shadow">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-gray-200 text-sm">{item.action}</div>
                      </div>
                      <div className="text-gray-500 text-xs">{item.user}, {item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default EditRoutineView;
