import { useState } from "react";

import "./App.css";

interface FormData {
  nombre: string;
  fecha: string;
  horaInicio: string;
  horaSalida: string;
}

function App() {
  const [formFields, setFormFields] = useState<FormData[]>([
    { nombre: "", fecha: "", horaInicio: "", horaSalida: "" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalDays: 0,
    totalHours: 0,
    paymentTransport: 0,
    payment: 0,
  });

  const [whatsappNumber, setWhatsappNumber] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedFields = [...formFields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setFormFields(updatedFields);
  };

  const handleAddForm = () => {
    setFormFields([
      ...formFields,
      { nombre: "", fecha: "", horaInicio: "", horaSalida: "" },
    ]);
  };

  const handleRemoveForm = (index: number) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let totalMinutes = 0;
    let totalDays = 0;
    let totalHours = 0;

    formFields.forEach((field) => {
      const inicio = new Date(`2000-01-01T${field.horaInicio}`);
      const salida = new Date(`2000-01-01T${field.horaSalida}`);
      const diff = Math.abs(salida.getTime() - inicio.getTime());
      const minutes = Math.floor(diff / (1000 * 60));
      totalDays += 1;
      totalMinutes += minutes;
      totalHours = parseFloat((totalMinutes / 60).toFixed(1));
    });

    const priceMinute = 5000 / 60; // Precio por minuto
    const transport = 3000;
    const paymentTransport = totalDays * transport;
    const payment = totalMinutes * priceMinute + paymentTransport;

    setSummaryData({
      totalDays: totalDays,
      totalHours: totalHours,
      paymentTransport: paymentTransport,
      payment: payment,
    });

    setModalVisible(true);

    console.log(payment, "pago total");
    console.log(paymentTransport, "pago de transporte");
    console.log(totalDays, "días totales");
    console.log("Total de minutos:", totalMinutes);
    console.log("Total de horas:", totalHours);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const sendWhatsAppMessage = () => {
    const { totalDays, totalHours, paymentTransport, payment } = summaryData;
    const message = `¡Hola! soy sebastian.\n\nResumen del pago:\nDías totales: ${totalDays}\nTotal de horas: ${totalHours}\nPago de transporte: ${paymentTransport}\nPago total: ${payment}`;
    const phoneNumber = whatsappNumber.trim(); // Reemplaza con el número de WhatsApp de destino

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow mt-4">
      <h1 className="text-2xl font-bold mb-4">Formulario</h1>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="nombre"
      >
        Nombre
      </label>
      <input
        className="appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="nombre"
        type="text"
        name="nombre"
        placeholder="Nombre"
      />
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="whatsapp"
      >
        Número de WhatsApp
      </label>
      <input
        className="appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="whatsapp"
        type="text"
        name="whatsapp"
        placeholder="Número de WhatsApp"
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formFields.map((field, index) => (
            <div key={index} className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor={`fecha-${index}`}
              >
                Fecha
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`fecha-${index}`}
                type="date"
                name="fecha"
                value={field.fecha}
                onChange={(e) => handleInputChange(e, index)}
              />

              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor={`inicio-${index}`}
              >
                Hora inicio
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`inicio-${index}`}
                type="time"
                name="horaInicio"
                value={field.horaInicio}
                onChange={(e) => handleInputChange(e, index)}
              />

              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor={`salida-${index}`}
              >
                Hora salida
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`salida-${index}`}
                type="time"
                name="horaSalida"
                value={field.horaSalida}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Calcular
          </button>
        </div>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
          type="button"
          onClick={handleAddForm}
        >
          Agregar dia
        </button>
        {formFields.length > 1 && (
          <div className="mt-4">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 rounded"
              type="button"
              onClick={() => handleRemoveForm(formFields.length - 1)}
            >
              Quitar dia
            </button>
          </div>
        )}
      </form>
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Resumen del pago</h2>
            <p className="mb-2">Días totales: {summaryData.totalDays}</p>
            <p className="mb-2">Total de horas: {summaryData.totalHours}</p>
            <p className="mb-2">
              Pago de transporte: {summaryData.paymentTransport}
            </p>
            <p className="mb-2">Pago total: {summaryData.payment}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-2"
              onClick={sendWhatsAppMessage}
            >
              Enviar por WhatsApp
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
