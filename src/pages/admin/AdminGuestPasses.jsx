import React, { useState, useMemo } from 'react';
import { Ticket, Loader2, Plus, FileSpreadsheet } from 'lucide-react';
import { apiFetch } from '../../interceptors/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { API_ROUTES } from '../../constants/apiRoutes';
import { useFetch } from '../../hooks/useFetch';
import { useCatalogos } from '../../hooks/useCatalogos';
import AlumnoAutocomplete from './guest-passes/AlumnoAutocomplete';
import HorarioFilters from './guest-passes/HorarioFilters';
import HorarioSelect from './guest-passes/HorarioSelect';
import ClaseUnicaDetailsFields from './guest-passes/ClaseUnicaDetailsFields';
import ResumenClasesSidebar from './guest-passes/ResumenClasesSidebar';

const diasSemana = [
  { id: 1, nombre: "lunes" },
  { id: 2, nombre: "martes" },
  { id: 3, nombre: "miercoles" },
  { id: 4, nombre: "jueves" },
  { id: 5, nombre: "viernes" },
  { id: 6, nombre: "sabado" },
  { id: 7, nombre: "domingo" },
]

const getDayName = (dayNumber) => {
  const days = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return days[dayNumber] || 'Día inválido';
}

const AdminGuestPasses = () => {
  const { userId } = useAuth();

  // Estados para el Formulario de Venta
  const [alumnoSelect, setAlumnoSelect] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [sedeSelect, setSedeSelect] = useState('');
  const [nivelSelect, setNivelSelect] = useState('');
  const [diaSelect, setDiaSelect] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Sedes, niveles, horarios y metodos de pago vienen de la cache de catalogos:
  // antes esta vista los pedia uno detras de otro con cinco `await` en cadena,
  // bloqueando el formulario durante la suma de las cinco latencias (y cada
  // fallo se tragaba en un console.error, dejando selects vacios sin explicacion).
  const {
    sedes: sedesRaw,
    niveles,
    horarios: horariosRaw,
    metodosPago: metodosPagoRaw,
  } = useCatalogos(['sedes', 'niveles', 'horarios', 'metodosPago']);

  // Lo unico propio de esta vista es la lista de alumnos.
  const { data: alumnos } = useFetch(
    async () => {
      const res = await apiFetch.get(API_ROUTES.USUARIOS.ALUMNOS);
      const result = await res.json();
      return result.data || [];
    },
    [],
    { initialData: [], errorMessage: 'Error cargando alumnos' }
  );

  // Se mantienen los mismos filtros y la misma transformacion que hacia la
  // version anterior, para no cambiar lo que ve el formulario.
  const sedes = useMemo(() => sedesRaw.filter(s => s.activo), [sedesRaw]);
  const metodosPago = useMemo(() => metodosPagoRaw.filter(m => m.activo), [metodosPagoRaw]);
  const horarios = useMemo(
    () => horariosRaw
      .filter(h => h.activo)
      .map(rh => ({
        id: rh.id,
        dia: { id: rh.dia_semana, nombre: getDayName(rh.dia_semana) },
        hora: `${rh.hora_inicio} - ${rh.hora_fin}`,
        nivel: rh.nivel,
        sede: rh.cancha?.sede,
      })),
    [horariosRaw]
  );

  // Estado para el botón de Excel
  const [isExporting, setIsExporting] = useState(false);

  const [formData, setFormData] = useState({
    alumno_id: '',
    idHorario: '',
    fecha_inicio_electiva: '',
    metodo_pago: '',
    montoTotal: '',
    usuario_admin_id: ''
  });
  const [formDataList, setFormDataList] = useState([]);

  const addInscInd = () => {
    if (!alumnoSelect) {
      toast.error('Falta seleccionar el alumno.');
      return;
    }
    if (!userId) {
      toast.error('Falta ID del admin. Por favor, vuelva a iniciar sesión.');
      return;
    }
    if (!formData.idHorario) {
      toast.error('Falta seleccionar el horario.');
      return;
    }
    if (!formData.fecha_inicio_electiva) {
      toast.error('Falta seleccionar la fecha de la clase.');
      return;
    }
    if (!formData.metodo_pago) {
      toast.error('Falta seleccionar el método de pago.');
      return;
    }
    const formActualizado = {
      ...formData,
      alumno_id: alumnoSelect.id,
      usuario_admin_id: userId,
    }

    setFormDataList(prev => [...prev, formActualizado])
    setFormData({
      ...formData,
      fecha_inicio_electiva: '',
    })
  }

  const handleInscripcionIndividual = async (e) => {
    e.preventDefault();

    if (formDataList.length === 0) {
      toast.error('No hay ninguna clase agregada.');
      return;
    }
    setSubmitting(true);
    setFormDataList([]);
    setAlumnoSelect(null);
    setTextoBusqueda('');
    setSedeSelect('')
    setNivelSelect('')
    setDiaSelect('')
    setFormData({
      alumno_id: '',
      idHorario: '',
      fecha_inicio_electiva: '',
      metodo_pago: '',
      montoTotal: '',
      usuario_admin_id: ''
    })
    try {
      const result = await apiFetch.post(API_ROUTES.INSCRIPCIONES.INDIVIDUAL_ADMIN, formDataList);
      const data = await result.json();
      if (!result.ok) {
        throw new Error(data.message || 'Error en el proceso de inscripción individual')
      }
      toast.success('Inscripción(es) realizada(s) correctamente')
    } catch (error) {
      toast.error(error.message || "Error Interno del Servidor");
    } finally {
      setSubmitting(false);
    }
  };

  // Exporta el reporte de clases individuales a Excel
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      // XLSX se carga con import() dentro del handler: son 870 kB (323 kB gzip) que solo
      // hacen falta al pulsar el botón de exportar, no al abrir la vista.
      const XLSX = await import('xlsx-js-style');
      const response = await apiFetch.get(API_ROUTES.INSCRIPCIONES.REPORTE_INDIVIDUALES);
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(result.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clases_Individuales");
        XLSX.writeFile(workbook, `Reporte_Clases_Individuales_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success("Excel descargado correctamente");
      } else {
        toast.error("No hay datos para exportar");
      }
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error de conexión al generar el reporte");
    } finally {
      setIsExporting(false);
    }
  };

  const alumnosFiltrados = alumnos.filter((usuario) => {
    const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
    return nombreCompleto.includes(textoBusqueda.toLowerCase());
  });

  const horariosFiltrados = horarios.filter(h =>
    (!diaSelect || h.dia.id === Number(diaSelect)) &&
    (!nivelSelect || h.nivel.id === Number(nivelSelect)) &&
    (!sedeSelect || h.sede.id === Number(sedeSelect))
  );

  const handleTextoBusquedaChange = (value) => {
    setTextoBusqueda(value);
    setAlumnoSelect(null);
    setIsOpen(true);
  };

  const handleSelectAlumno = (usuario) => {
    setAlumnoSelect(usuario);
    setTextoBusqueda(`${usuario.nombres} ${usuario.apellidos}`);
    setIsOpen(false);
  };

  const handleSedeChange = (value) => {
    setSedeSelect(value);
    setFormData(prev => ({ ...prev, idHorario: '' }));
  };

  const handleNivelChange = (value) => {
    setNivelSelect(value);
    setFormData(prev => ({ ...prev, idHorario: '' }));
  };

  const handleDiaChange = (value) => {
    setDiaSelect(value);
    setFormData(prev => ({ ...prev, idHorario: '' }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in pb-24">

      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-2xl flex items-center justify-center text-white shadow-xl transform -rotate-3 shrink-0">
            <Ticket size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-brand-primary uppercase tracking-tighter italic leading-none">
              Inscripción <span className="text-brand-accent">Individual</span>
            </h1>
            <p className="text-sm font-bold text-brand-muted uppercase tracking-widest mt-1">
              Registro de Clases Únicas al Alumno
            </p>
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
        >
          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
          {isExporting ? 'Generando...' : 'Descargar Reporte'}
        </button>
      </div>

      <form onSubmit={handleInscripcionIndividual} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2">
            <div className={`bg-brand-surface p-8 rounded-[2.5rem] shadow-2xl border-4 border-white transition-opacity`}>

              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-brand-primary uppercase italic text-2xl">Formulario de Registro</h2>
              </div>

              <div className="space-y-6">
                <AlumnoAutocomplete
                  textoBusqueda={textoBusqueda}
                  onTextoBusquedaChange={handleTextoBusquedaChange}
                  alumnoSelect={alumnoSelect}
                  onSelectAlumno={handleSelectAlumno}
                  alumnosFiltrados={alumnosFiltrados}
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                  disabled={formDataList.length > 0}
                />

                <HorarioFilters
                  sedes={sedes}
                  sedeSelect={sedeSelect}
                  onSedeChange={handleSedeChange}
                  niveles={niveles}
                  nivelSelect={nivelSelect}
                  onNivelChange={handleNivelChange}
                  diasSemana={diasSemana}
                  diaSelect={diaSelect}
                  onDiaChange={handleDiaChange}
                />

                <HorarioSelect
                  horariosFiltrados={horariosFiltrados}
                  idHorario={formData.idHorario}
                  onChange={(value) => setFormData({ ...formData, idHorario: value })}
                />

                <ClaseUnicaDetailsFields
                  fecha={formData.fecha_inicio_electiva}
                  onFechaChange={(value) => setFormData({ ...formData, fecha_inicio_electiva: value })}
                  metodoPago={formData.metodo_pago}
                  onMetodoPagoChange={(value) => setFormData({ ...formData, metodo_pago: value })}
                  metodosPago={metodosPago}
                  monto={formData.montoTotal}
                  onMontoChange={(value) => setFormData({ ...formData, montoTotal: value })}
                  disabled={formDataList.length > 0}
                />

                <button
                  type="button"
                  onClick={addInscInd}
                  className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-brand-primary/30 group mt-4"
                >
                  {<Plus size={20} className="group-hover:translate-x-1 transition-transform" />}
                  Agregar Clase Única
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 sticky top-6">
            <ResumenClasesSidebar
              formDataList={formDataList}
              alumnos={alumnos}
              horarios={horarios}
              metodosPago={metodosPago}
              onRemoveItem={(index) => setFormDataList(formDataList.filter((_, i) => i !== index))}
              submitting={submitting}
            />
          </div>

        </div>
      </form>
    </div>
  );
};

export default AdminGuestPasses;
