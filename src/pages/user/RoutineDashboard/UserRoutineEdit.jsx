import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Select } from '../../../components/ui/FormElements';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

const initialExercises = [
  { id: 1, name: 'Press Banca', sets: 4, reps: 10, weight: 60, weightUnit: 'Kg', rest: 60 },
  { id: 2, name: 'Sentadilla Libre', sets: 3, reps: 12, weight: 80, weightUnit: 'Kg', rest: 90 },
  { id: 3, name: 'Peso Muerto', sets: 4, reps: 8, weight: 100, weightUnit: 'Kg', rest: 120 },
];

const UserRoutineEdit = ({ onBack }) => {
  const [exercises, setExercises] = useState(initialExercises);

  const handleChange = (id, field, value) => {
    setExercises(prev => 
      prev.map(ex => ex.id === id ? { ...ex, [field]: value } : ex)
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0F16] p-4 md:p-8 text-white font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-full bg-[#181B29] text-gray-400 hover:text-white border border-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edición de Entrenamiento</h1>
            <p className="text-sm text-[#D4AF37]">Ajusta tu rendimiento de hoy</p>
          </div>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, idx) => (
            <Card key={exercise.id} className="border-[#D4AF37]/20 bg-gradient-to-r from-[#1E2235] to-[#151828]">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-[#2A2F45] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-lg">{exercise.name}</h3>
                </div>
                <CheckCircle className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium ml-1">Series Totales</label>
                  <Input 
                    type="number" 
                    value={exercise.sets}
                    onChange={(e) => handleChange(exercise.id, 'sets', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium ml-1">Reps / Serie</label>
                  <Input 
                    type="number" 
                    value={exercise.reps}
                    onChange={(e) => handleChange(exercise.id, 'reps', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-gray-400 font-medium ml-1">Peso Utilizado</label>
                  <div className="flex space-x-2">
                    <Input 
                      type="number" 
                      value={exercise.weight}
                      onChange={(e) => handleChange(exercise.id, 'weight', parseFloat(e.target.value))}
                      className="w-full text-[#D4AF37] font-bold"
                    />
                    <Select
                      value={exercise.weightUnit}
                      onChange={(e) => handleChange(exercise.id, 'weightUnit', e.target.value)}
                      className="w-24"
                    >
                      <option value="Kg">Kg</option>
                      <option value="Lbs">Lbs</option>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-800 flex justify-end">
          <Button size="lg" icon={Save} className="w-full md:w-auto px-12 py-3 shadow-[0_0_20px_rgba(212,175,55,0.2)] text-lg">
            GUARDAR MIS CAMBIOS
          </Button>
        </div>

      </div>
    </div>
  );
};

export default UserRoutineEdit;
