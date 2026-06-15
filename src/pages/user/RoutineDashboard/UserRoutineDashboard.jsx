import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Dumbbell, Activity, Calendar, ArrowRight, Edit2, Target } from 'lucide-react';

const progressData = [
  { name: 'Lun', weight: 60 },
  { name: 'Mar', weight: 65 },
  { name: 'Mié', weight: 65 },
  { name: 'Jue', weight: 70 },
  { name: 'Vie', weight: 72 },
  { name: 'Sáb', weight: 75 },
  { name: 'Dom', weight: 75 },
];

const UserRoutineDashboard = ({ onEdit }) => {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 text-black font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* User Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-14 h-14 rounded-full border border-black" />
            <div>
              <h2 className="text-xl font-bold text-black">Chabrol Amador</h2>
              <p className="text-sm text-gray-500">@carlosamador</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black border border-black hover:bg-black hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black border border-black hover:bg-black hover:text-white transition-colors">
              <Activity className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Calendar Card */}
          <Card className="border border-black bg-white shadow-none rounded-none">
            <div className="flex justify-between items-center mb-4 border-b border-black pb-4">
              <h3 className="font-bold text-black">Enero 2023</h3>
              <div className="flex space-x-2 text-black">
                <button className="w-6 h-6 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">&lt;</button>
                <button className="w-6 h-6 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">&gt;</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 text-gray-500 font-bold border-b border-black pb-2">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm pt-2">
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className={`p-1.5 flex items-center justify-center border border-transparent ${i === 14 ? 'bg-black text-white font-bold' : 'text-black hover:border-black cursor-pointer'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </Card>

          {/* Progress Chart */}
          <Card className="border border-black bg-white shadow-none rounded-none flex flex-col">
            <div className="flex justify-between items-start mb-4 border-b border-black pb-4">
              <div>
                <h3 className="font-bold text-black">Progreso semanal</h3>
                <p className="text-xs text-gray-500 font-medium">Ganancia de Fuerza (Kg)</p>
              </div>
              <Activity className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-h-[150px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}} 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #000000', borderRadius: '0', color: '#000000', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="weight" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Exercises List */}
        <div className="mt-8 border border-black p-6 bg-white">
          <div className="flex justify-between items-center mb-6 border-b border-black pb-4">
            <h3 className="text-lg font-bold text-black">Ejercicios de hoy</h3>
            <Button className="bg-black text-white border border-black hover:bg-white hover:text-black hover:scale-[1.02] font-bold rounded-none px-4 py-2 transition-all flex items-center" onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" /> Modo Edición
            </Button>
          </div>
          
          <div className="space-y-0 divide-y divide-black border border-black">
            {[
              { name: 'Press Banca', sets: 4, reps: 10, weight: '60 Kg', rest: '60s', icon: Target },
              { name: 'Sentadilla Libre', sets: 3, reps: 12, weight: '80 Kg', rest: '90s', icon: Dumbbell },
              { name: 'Peso Muerto', sets: 4, reps: 8, weight: '100 Kg', rest: '120s', icon: Activity },
            ].map((exercise, idx) => (
              <div key={idx} className="bg-white hover:bg-gray-100 transition-colors group cursor-pointer p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 border border-black bg-white flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <exercise.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-black">{exercise.name}</h4>
                    <div className="flex space-x-3 text-xs text-gray-500 font-medium mt-1">
                      <span>{exercise.sets} Series</span>
                      <span>•</span>
                      <span>{exercise.reps} Reps</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <p className="font-black text-black text-lg">{exercise.weight}</p>
                    <p className="text-xs text-gray-500 font-bold">{exercise.rest} rest</p>
                  </div>
                  <div className="w-10 h-10 border border-black flex items-center justify-center bg-white text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserRoutineDashboard;
