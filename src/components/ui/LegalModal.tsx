import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

type LegalKey = 'terminos' | 'privacidad' | 'cookies';

interface Section { subtitle: string; text: string; }
interface LegalContent { title: string; date: string; sections: Section[]; }

const LEGAL_CONTENT: Record<LegalKey, LegalContent> = {
  terminos: {
    title: 'Términos de uso',
    date: 'Última actualización: 13 de Mayo, 2026',
    sections: [
      { subtitle: '1. Aceptación de los términos', text: 'Al acceder y utilizar Órbita, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.' },
      { subtitle: '2. Uso de la plataforma', text: 'Órbita proporciona un servicio integral de gestión empresarial. Te comprometes a utilizar la plataforma solo para fines legales y de una manera que no infrinja los derechos de terceros.' },
      { subtitle: '3. Cuentas de usuario', text: 'Eres responsable de salvaguardar la contraseña que utilizas para acceder a Órbita y de cualquier actividad o acción bajo tu contraseña.' },
      { subtitle: '4. Modificaciones del servicio', text: 'Nos reservamos el derecho de retirar o modificar nuestro servicio a nuestra entera discreción sin previo aviso.' },
    ],
  },
  privacidad: {
    title: 'Política de privacidad',
    date: 'Última actualización: 13 de Mayo, 2026',
    sections: [
      { subtitle: '1. Recopilación de información', text: 'Recopilamos varios tipos de información para proporcionar y mejorar nuestro servicio, incluyendo datos personales y de uso.' },
      { subtitle: '2. Uso de datos', text: 'Órbita utiliza los datos recopilados para proporcionar y mantener nuestro servicio, notificarte sobre cambios, y proporcionar soporte al cliente.' },
      { subtitle: '3. Seguridad de los datos', text: 'Utilizamos encriptación de extremo a extremo y medidas de seguridad estándar de la industria para proteger tu información.' },
      { subtitle: '4. Tus derechos', text: 'Tienes derecho a acceder, actualizar o eliminar la información que tenemos sobre ti contactando a nuestro equipo de soporte.' },
    ],
  },
  cookies: {
    title: 'Política de cookies',
    date: 'Última actualización: 13 de Mayo, 2026',
    sections: [
      { subtitle: '1. ¿Qué son las cookies?', text: 'Las cookies son archivos con una pequeña cantidad de datos. Se envían a tu navegador desde un sitio web y se almacenan en tu dispositivo.' },
      { subtitle: '2. Cómo usamos las cookies', text: 'Utilizamos cookies y tecnologías de seguimiento similares para rastrear la actividad en nuestro servicio y recordar tus preferencias.' },
      { subtitle: '3. Tipos de cookies', text: 'Utilizamos cookies de sesión, de preferencias y de seguridad para el correcto funcionamiento de la plataforma.' },
      { subtitle: '4. Gestión de cookies', text: 'Puedes instruir a tu navegador para que rechace todas las cookies, aunque esto puede afectar algunas funcionalidades del servicio.' },
    ],
  },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contentKey: LegalKey | null;
}

export function LegalModal({ isOpen, onClose, contentKey }: Props) {
  const { isDark } = useTheme();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !contentKey) return null;
  const content = LEGAL_CONTENT[contentKey];
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200'
      }`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-white/10 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
        }`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{content.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{content.date}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar modal"
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {content.sections.map((section, idx) => (
              <div key={idx}>
                <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{section.subtitle}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{section.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
            <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
              Para cualquier duda relacionada con nuestros documentos legales, por favor contactá a <strong>legal@orbita.app</strong>
            </p>
          </div>
        </div>

        <div className={`px-6 py-4 border-t flex justify-end ${isDark ? 'border-white/10 bg-slate-800/30' : 'border-slate-100 bg-slate-50'}`}>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/25">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
