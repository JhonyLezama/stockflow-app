import { useApp, users } from '../store/AppContext';
import { User } from '../types/domain';
import { Flame, ChefHat, Package, Coffee } from 'lucide-react';

const roleInfo: Record<string, { icon: React.ReactNode; color: string; label: string; desc: string }> = {
  owner: { icon: <Flame size={28} />, color: 'bg-brand-500', label: 'Dueña', desc: 'Control total, reportes y aprobaciones' },
  kitchen: { icon: <ChefHat size={28} />, color: 'bg-amber-500', label: 'Cocina', desc: 'Registrar merma, consumo y conteo' },
  warehouse: { icon: <Package size={28} />, color: 'bg-emerald-500', label: 'Almacén', desc: 'Recepción, órdenes y proveedores' },
  service: { icon: <Coffee size={28} />, color: 'bg-blue-500', label: 'Atención', desc: 'Consultar stock y avisar agotados' },
};

export default function LoginPage() {
  const { dispatch } = useApp();

  const handleSelect = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Demo banner */}
      <div className="fixed top-0 left-0 right-0 bg-brand-100 text-brand-800 text-xs text-center py-1 font-medium z-50">
        Demo con datos de ejemplo
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200">
            <Flame size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-warm-800">Mi Inventario</h1>
          <p className="text-warm-500 text-sm mt-1">Pollería Don Tito - Trujillo</p>
        </div>

        {/* Role selection */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-warm-600 text-center mb-4">
            Selecciona tu rol para ingresar:
          </p>
          {users.map(user => {
            const info = roleInfo[user.role];
            return (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                className="w-full bg-white border border-warm-200 rounded-xl p-4 flex items-center gap-4 hover:border-brand-300 hover:shadow-md transition-all active:scale-[0.98] text-left"
              >
                <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                  {info.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-warm-800 text-sm">{user.name}</p>
                  <p className="text-xs text-warm-500">{info.label} · {info.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-warm-400 mt-8">
          Prototipo de validación · Sin datos reales
        </p>
      </div>
    </div>
  );
}
