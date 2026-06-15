import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select, Checkbox } from '../../../components/ui/FormElements';
import { Search } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Cristóbal Clary', handle: '@cristoclo', routine: 'Rutina Asignada 1', status: 'Absoluto', level: 'Beginner', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Marina Martín', handle: '@makaa', routine: 'Rutina Asignada 2', status: 'Absoluto', level: 'Intermediate', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Rocio Stratozy', handle: '@rosiio', routine: 'Rutina Asignada 3', status: 'Absoluto', level: 'Advanced', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Malena Batura', handle: '@pekeniabm', routine: 'Rutina Asignada 4', status: 'Absoluto', level: 'Beginner', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Alazo Niam', handle: '@alanainam', routine: 'Rutina Asignada 5', status: 'Absoluto', level: 'Beginner', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 6, name: 'Azalia Raiman', handle: '@azalaiman', routine: 'Rutina Asignada 6', status: 'Absoluto', level: 'Intermediate', avatar: 'https://i.pravatar.cc/150?u=6' },
];

const AssignRoutineView = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [levelFilters, setLevelFilters] = useState({
    Beginner: true,
    Intermediate: false,
    Advanced: false,
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const handleLevelFilter = (level) => {
    setLevelFilters(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const filteredUsers = mockUsers.filter(user => levelFilters[user.level]);

  return (
    <div className="min-h-screen bg-[#0D0F16] p-8 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">TAREA 2: MÓDULO DE ASIGNACIÓN DE RUTINAS</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Users Table */}
          <Card className="flex-1 border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-sm font-medium text-gray-400">
                    <th className="p-4 w-12">
                      <Checkbox 
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Rutina Asignada</th>
                    <th className="p-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800/50 hover:bg-[#181B29] transition-colors">
                      <td className="p-4">
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-gray-700" />
                          <div>
                            <p className="font-semibold text-gray-200">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.handle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{user.routine}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No hay usuarios que coincidan con los filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Right Panel: Assignment Controls */}
          <Card className="w-full lg:w-80 h-fit border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)] bg-gradient-to-b from-[#1E2235] to-[#151828]">
            <div className="space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">SELECCIONAR RUTINA CREADA</h3>
                <Select 
                  value={selectedRoutine}
                  onChange={(e) => setSelectedRoutine(e.target.value)}
                  className="bg-[#0D0F16]"
                >
                  <option value="">Seleccionar Rutina</option>
                  <option value="rutina-1">Rutina Volumen Avanzado</option>
                  <option value="rutina-2">Rutina Definición Básico</option>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">USUARIOS PARA ASIGNAR</h3>
                <div className="space-y-3">
                  <Checkbox 
                    label="Beginner" 
                    checked={levelFilters.Beginner}
                    onChange={() => handleLevelFilter('Beginner')}
                  />
                  <Checkbox 
                    label="Intermediate" 
                    checked={levelFilters.Intermediate}
                    onChange={() => handleLevelFilter('Intermediate')}
                  />
                  <Checkbox 
                    label="Advanced" 
                    checked={levelFilters.Advanced}
                    onChange={() => handleLevelFilter('Advanced')}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <Button className="w-full py-3" disabled={selectedUsers.length === 0 || !selectedRoutine}>
                  ASIGNAR RUTINAS A USUARIOS
                </Button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  {selectedUsers.length} usuarios seleccionados
                </p>
              </div>

            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AssignRoutineView;
