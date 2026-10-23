import { useApp } from '../store/AppContext';
import { AlertTriangle, Bell, Check, CheckCheck, Package, TrendingDown } from 'lucide-react';

export default function AlertsPage() {
  const { state, dispatch } = useApp();

  const unreadAlerts = state.alerts.filter(a => !a.read);
  const readAlerts = state.alerts.filter(a => a.read);

  const handleMarkRead = (id: string) => {
    dispatch({ type: 'MARK_ALERT_READ', payload: id });
  };

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_ALERTS_READ' });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'out_of_stock': return <Package size={16} className="text-red-500" />;
      case 'low_stock': return <TrendingDown size={16} className="text-amber-500" />;
      case 'count_discrepancy': return <AlertTriangle size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-warm-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'out_of_stock': return 'border-red-200 bg-red-50';
      case 'low_stock': return 'border-amber-200 bg-amber-50';
      case 'count_discrepancy': return 'border-purple-200 bg-purple-50';
      default: return 'border-warm-200 bg-white';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-warm-800">Alertas</h2>
          <p className="text-sm text-warm-500">
            {unreadAlerts.length} sin leer
          </p>
        </div>
        {unreadAlerts.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700"
          >
            <CheckCheck size={14} /> Marcar todas
          </button>
        )}
      </div>

      {/* Unread */}
      {unreadAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-warm-500 uppercase tracking-wide">Nuevas</h3>
          {unreadAlerts.map(alert => (
            <div
              key={alert.id}
              className={`border rounded-xl p-3 flex items-start gap-3 ${getAlertColor(alert.type)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warm-700">{alert.message}</p>
                <p className="text-[10px] text-warm-400 mt-0.5">
                  {new Date(alert.created_at).toLocaleDateString('es-PE')} {new Date(alert.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={() => handleMarkRead(alert.id)}
                className="p-1.5 rounded-lg hover:bg-white/50 flex-shrink-0"
                aria-label="Marcar como leída"
              >
                <Check size={14} className="text-warm-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Read */}
      {readAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-warm-500 uppercase tracking-wide">Leídas</h3>
          {readAlerts.map(alert => (
            <div
              key={alert.id}
              className="border border-warm-100 rounded-xl p-3 flex items-start gap-3 bg-warm-50 opacity-60"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-warm-600">{alert.message}</p>
                <p className="text-[10px] text-warm-400 mt-0.5">
                  {new Date(alert.created_at).toLocaleDateString('es-PE')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {state.alerts.length === 0 && (
        <div className="text-center py-12 text-warm-400 text-sm">
          <Bell size={32} className="mx-auto mb-2 text-warm-300" />
          No hay alertas. ¡Todo en orden!
        </div>
      )}
    </div>
  );
}
