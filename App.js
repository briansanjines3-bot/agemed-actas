import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Estado inicial con todos los campos vacíos de las actas limpias
const initialState = {
  // PÁGINA 1: ANTECEDENTES
  numInspeccion: '',
  lugarFecha: 'La Paz, ',
  empresa: '',
  numeroId: '',
  rubro: '',
  fechaResolucion: '',
  representanteLegal: '',
  ciRepresentante: '',
  regenteProfesional: '',
  ciRegente: '',
  direccionInspeccionada: '',
  tipoInspeccion: 'ESPECIAL',
  tiempoProgramado: '',

  // HORARIOS Y EQUIPO
  horaInicio: '',
  horaCierre: '',
  inspectorLider: '',
  equipoInspector: '',
  alcanceInspeccion: 'Sistema Nacional de Vigilancia y Control de Medicamentos, Resolución Adm. N°20, y demás normativa vigente.',

  // TABLA DE EVALUACIÓN
  controlCalidadInspector: '',
  controlCalidadEmpresa: '',
  infraestructuraInspector: '',
  infraestructuraEmpresa: '',

  // RESUMEN Y OBSERVACIONES
  resumenObservaciones: '',

  // PÁGINA 2: CONTADORES DE NO CONFORMIDADES
  criticos: '0',
  mayores: '0',
  menores: '0',
};

export default function App() {
  const [form, setForm] = useState(initialState);

  // Actualizar dinámicamente cada sección escrita
  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Función para limpiar todo y volver a llenar desde cero
  const resetForm = () => {
    Alert.alert(
      "Nueva Acta",
      "¿Deseas limpiar todas las secciones para empezar a llenar un acta nueva?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, Limpiar", onPress: () => setForm(initialState) }
      ]
    );
  };

  // Función para generar la plantilla HTML con los datos ingresados y transformarla a PDF
  const createPDF = async () => {
    // Estructura HTML que imita el diseño de las hojas físicas impresas
    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica', Arial, sans-serif; padding: 20px; color: #333; font-size: 12px; }
            .header { text-align: center; border: 2px solid #000; padding: 10px; margin-bottom: 15px; }
            .title { font-size: 16px; font-weight: bold; margin: 0; }
            .subtitle { font-size: 11px; margin: 5px 0 0 0; letter-spacing: 1px; }
            .section-title { background-color: #000; color: #fff; padding: 5px; font-weight: bold; font-size: 11px; margin-top: 15px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; vertical-align: top; }
            th { background-color: #f2f2f2; font-size: 10px; }
            .field-label { font-weight: bold; font-size: 11px; color: #111; }
            .field-value { border-bottom: 1px dotted #666; padding-left: 5px; font-style: italic; color: #222; }
            .footer-table { margin-top: 40px; }
            .signature-space { height: 60px; border-bottom: 1px solid #000; }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="title">MINISTERIO DE SALUD Y DEPORTES</p>
            <p style="margin:2px 0; font-weight:bold;">AGENCIA ESTATAL DE MEDICAMENTOS Y TECNOLOGÍAS EN SALUD - AGEMED</p>
            <p class="subtitle">ACTA DE INSPECCIÓN A EMPRESAS</p>
          </div>

          <div class="section-title">ANTECEDENTES</div>
          <table>
            <tr>
              <td width="30%"><span class="field-label">Acta de Inspección Nº:</span></td>
              <td class="field-value">${form.numInspeccion}</td>
              <td width="20%"><span class="field-label">Lugar y Fecha:</span></td>
              <td class="field-value">${form.lugarFecha}</td>
            </tr>
            <tr>
              <td><span class="field-label">Empresa:</span></td>
              <td class="field-value">${form.empresa}</td>
              <td><span class="field-label">Número / ID:</span></td>
              <td class="field-value">${form.numeroId}</td>
            </tr>
            <tr>
              <td><span class="field-label">Rubro:</span></td>
              <td class="field-value">${form.rubro}</td>
              <td><span class="field-label">Fecha Resol.:</span></td>
              <td class="field-value">${form.fechaResolucion}</td>
            </tr>
            <tr>
              <td><span class="field-label">Rep. Legal:</span></td>
              <td class="field-value" colspan="3">${form.representanteLegal}</td>
            </tr>
            <tr>
              <td><span class="field-label">Regente Profesional:</span></td>
              <td class="field-value" colspan="3">${form.regenteProfesional}</td>
            </tr>
            <tr>
              <td><span class="field-label">Dirección Inspeccionada:</span></td>
              <td class="field-value" colspan="3">${form.direccionInspeccionada}</td>
            </tr>
          </table>

          <div class="section-title">OBJETIVO DE LA INSPECCIÓN</div>
          <table>
            <tr>
              <td width="15%"><span class="field-label">Hora Inicio:</span></td>
              <td class="field-value">${form.horaInicio}</td>
              <td width="15%"><span class="field-label">Hora Cierre:</span></td>
              <td class="field-value">${form.horaCierre}</td>
            </tr>
            <tr>
              <td><span class="field-label">Inspector Líder:</span></td>
              <td class="field-value" colspan="3">${form.inspectorLider}</td>
            </tr>
            <tr>
              <td><span class="field-label">Equipo Inspector:</span></td>
              <td class="field-value" colspan="3">${form.equipoInspector}</td>
            </tr>
            <tr>
              <td><span class="field-label">Alcance:</span></td>
              <td class="field-value" colspan="3">${form.alcanceInspeccion}</td>
            </tr>
          </table>

          <div class="section-title">RESUMEN DE LA INSPECCIÓN Y OBSERVACIONES</div>
          <div style="border: 1px solid #000; padding: 10px; min-height: 180px; margin-top: 5px; line-height: 1.6; font-style: italic;">
            ${form.resumenObservaciones.replace(/\n/g, '<br/>')}
          </div>

          <div class="section-title">CLASIFICACIÓN DE NO CONFORMIDADES TOTALES</div>
          <table style="text-align: center;">
            <tr>
              <th style="text-align:center;">CRÍTICOS</th>
              <th style="text-align:center;">MAYORES</th>
              <th style="text-align:center;">MENORES</th>
            </tr>
            <tr>
              <td style="text-align:center; font-size: 14px; font-weight:bold;">${form.criticos}</td>
              <td style="text-align:center; font-size: 14px; font-weight:bold;">${form.mayores}</td>
              <td style="text-align:center; font-size: 14px; font-weight:bold;">${form.menores}</td>
            </tr>
          </table>

          <div class="section-title">DISTRIBUCIÓN DE LA PRESENTE ACTA Y REGISTRO DE FIRMAS</div>
          <table class="footer-table">
            <tr>
              <th width="50%" style="text-align:center;">Firma Responsable de la Empresa</th>
              <th width="50%" style="text-align:center;">Firma Inspector Líder de la AGEMED</th>
            </tr>
            <tr>
              <td class="signature-space"></td>
              <td class="signature-space"></td>
            </tr>
            <tr>
              <td><span class="field-label">Nombre:</span> ${form.representanteLegal || form.regenteProfesional}</td>
              <td><span class="field-label">Nombre:</span> ${form.inspectorLider}</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      // 1. Genera el archivo PDF en el almacenamiento temporal en la nube/dispositivo
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      // 2. Despliega el menú nativo para guardar en archivos, enviar por WhatsApp o descargar
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Guardar Acta PDF' });
    } catch (error) {
      Alert.alert("Error", "No se pudo generar o descargar el archivo PDF.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* HEADER DE LA APLICACIÓN */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>AGEMED - FORMULARIO DIGITAL</Text>
        <Text style={styles.headerSubtitle}>Llenado de Actas de Inspección</Text>
      </View>

      {/* SECCIÓN 1: ANTECEDENTES */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>1. ANTECEDENTES (PÁG 1)</Text>
        
        <Text style={styles.label}>Nº Acta de Inspección:</Text>
        <TextInput style={styles.input} value={form.numInspeccion} onChangeText={(v) => updateField('numInspeccion', v)} placeholder="Ej. IVM-003/2026" />

        <Text style={styles.label}>Lugar y Fecha:</Text>
        <TextInput style={styles.input} value={form.lugarFecha} onChangeText={(v) => updateField('lugarFecha', v)} />

        <Text style={styles.label}>Empresa / Establecimiento:</Text>
        <TextInput style={styles.input} value={form.empresa} onChangeText={(v) => updateField('empresa', v)} placeholder="Nombre de los laboratorios o empresa" />

        <View style={styles.row}>
          <View style={{flex: 1, marginRight: 5}}>
            <Text style={styles.label}>Número ID:</Text>
            <TextInput style={styles.input} value={form.numeroId} onChangeText={(v) => updateField('numeroId', v)} placeholder="Ej. 164" keyboardType="numeric" />
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            <Text style={styles.label}>Fecha Resolución:</Text>
            <TextInput style={styles.input} value={form.fechaResolucion} onChangeText={(v) => updateField('fechaResolucion', v)} placeholder="Ej. 26 diciembre 2018" />
          </View>
        </View>

        <Text style={styles.label}>Rubro:</Text>
        <TextInput style={styles.input} value={form.rubro} onChangeText={(v) => updateField('rubro', v)} placeholder="Ej. INDUSTRIA FARMACÉUTICA" />

        <Text style={styles.label}>Nombre Representante Legal:</Text>
        <TextInput style={styles.input} value={form.representanteLegal} onChangeText={(v) => updateField('representanteLegal', v)} />

        <Text style={styles.label}>Nombre Regente / Profesional Responsable:</Text>
        <TextInput style={styles.input} value={form.regenteProfesional} onChangeText={(v) => updateField('regenteProfesional', v)} />

        <Text style={styles.label}>Dirección Inspeccionada:</Text>
        <TextInput style={styles.input} value={form.direccionInspeccionada} onChangeText={(v) => updateField('direccionInspeccionada', v)} multiline placeholder="Dirección completa, avenidas, nro..." />
      </View>

      {/* SECCIÓN 2: OBJETIVOS Y TIEMPOS */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>2. TIEMPOS Y EQUIPO INSPECTOR</Text>
        
        <View style={styles.row}>
          <View style={{flex: 1, marginRight: 5}}>
            <Text style={styles.label}>Hora Inicio:</Text>
            <TextInput style={styles.input} value={form.horaInicio} onChangeText={(v) => updateField('horaInicio', v)} placeholder="Ej. 09:30 a.m." />
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            <Text style={styles.label}>Hora Cierre:</Text>
            <TextInput style={styles.input} value={form.horaCierre} onChangeText={(v) => updateField('horaCierre', v)} placeholder="Ej. 13:00 p.m." />
          </View>
        </View>

        <Text style={styles.label}>Inspector Líder:</Text>
        <TextInput style={styles.input} value={form.inspectorLider} onChangeText={(v) => updateField('inspectorLider', v)} />

        <Text style={styles.label}>Equipo Inspector:</Text>
        <TextInput style={styles.input} value={form.equipoInspector} onChangeText={(v) => updateField('equipoInspector', v)} multiline placeholder="Nombres de los co-inspectores" />

        <Text style={styles.label}>Alcance de la Inspección:</Text>
        <TextInput style={styles.input} value={form.alcanceInspeccion} onChangeText={(v) => updateField('alcanceInspeccion', v)} multiline />
      </View>

      {/* SECCIÓN 3: CUERPO TEXTUAL DE OBSERVACIONES */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>3. RESUMEN DE LA INSPECCIÓN Y OBSERVACIONES</Text>
        <Text style={styles.label}>Contenido del Acta (Llenado dinámico libre):</Text>
        <TextInput 
          style={[styles.input, {height: 160, textAlignVertical: 'top'}]} 
          value={form.resumenObservaciones} 
          onChangeText={(v) => updateField('resumenObservaciones', v)} 
          multiline 
          numberOfLines={8}
          placeholder="Escribe todo el desarrollo de las observaciones y hojas de ruta aquí..."
        />
      </View>

      {/* SECCIÓN 4: RECUADRO DE CONFORMIDADES DE PÁGINA 2 */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>4. RESUMEN DE NO CONFORMIDADES (PÁG 2)</Text>
        <View style={styles.row}>
          <View style={{flex: 1, paddingHorizontal: 4}}>
            <Text style={styles.labelCenter}>Críticos</Text>
            <TextInput style={[styles.input, {textAlign: 'center', fontWeight: 'bold'}]} value={form.criticos} onChangeText={(v) => updateField('criticos', v)} keyboardType="numeric"/>
          </View>
          <View style={{flex: 1, paddingHorizontal: 4}}>
            <Text style={styles.labelCenter}>Mayores</Text>
            <TextInput style={[styles.input, {textAlign: 'center', fontWeight: 'bold'}]} value={form.mayores} onChangeText={(v) => updateField('mayores', v)} keyboardType="numeric"/>
          </View>
          <View style={{flex: 1, paddingHorizontal: 4}}>
            <Text style={styles.labelCenter}>Menores</Text>
            <TextInput style={[styles.input, {textAlign: 'center', fontWeight: 'bold'}]} value={form.menores} onChangeText={(v) => updateField('menores', v)} keyboardType="numeric"/>
          </View>
        </View>
      </View>

      {/* BOTONES ACCIONES PRINCIPALES */}
      <TouchableOpacity style={styles.btnSave} onPress={createPDF}>
        <Text style={styles.btnText}>Guardar y Exportar PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnClear} onPress={resetForm}>
        <Text style={styles.btnTextClear}>Limpiar Campos (Nueva Acta)</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  contentContainer: { padding: 16, paddingBottom: 60 },
  headerBox: { backgroundColor: '#0f172a', padding: 20, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  headerSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  sectionCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 4, marginTop: 10 },
  labelCenter: { fontSize: 12, fontWeight: '600', color: '#475569', textAlign: 'center', marginBottom: 4 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, color: '#1e293b' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btnSave: { backgroundColor: '#0284c7', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnClear: { backgroundColor: 'transparent', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#ef4444' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  btnTextClear: { color: '#ef4444', fontSize: 14, fontWeight: '600' }
});
